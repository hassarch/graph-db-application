import { Router } from 'express';
import { runQuery, checkHealth } from './db.js';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const health = await checkHealth();
    res.status(health.status === 'healthy' ? 200 : 503).json(health);
  } catch (error) {
    res.status(503).json({ status: 'error', message: error.message });
  }
});

/**
 * Get database statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const cypher = `
      MATCH (n)
      WITH labels(n) as labels
      UNWIND labels as label
      RETURN label, count(*) as count
      ORDER BY count DESC
    `;
    const results = await runQuery(cypher);
    
    const relCypher = `
      MATCH ()-[r]->()
      RETURN type(r) as type, count(*) as count
      ORDER BY count DESC
    `;
    const relResults = await runQuery(relCypher);
    
    res.json({ nodes: results, relationships: relResults });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats', message: error.message });
  }
});

/**
 * Search across entities
 */
router.get('/search', async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.json([]);
    }

    let cypher = '';
    
    if (type === 'author' || type === 'all') {
      cypher += `
        MATCH (a:Author)
        WHERE toLower(a.name) CONTAINS toLower($query)
        RETURN 'author' as type, a.name as name, id(a) as id, a.h_index as metric
        LIMIT 10
      `;
    }
    
    if (type === 'paper' || type === 'all') {
      if (cypher) cypher += ' UNION ALL ';
      cypher += `
        MATCH (p:Paper)
        WHERE toLower(p.title) CONTAINS toLower($query)
        RETURN 'paper' as type, p.title as name, id(p) as id, p.year as metric
        LIMIT 10
      `;
    }
    
    if (type === 'topic' || type === 'all') {
      if (cypher) cypher += ' UNION ALL ';
      cypher += `
        MATCH (t:Topic)
        WHERE toLower(t.name) CONTAINS toLower($query)
        RETURN 'topic' as type, t.name as name, id(t) as id, null as metric
        LIMIT 10
      `;
    }

    const results = await runQuery(cypher, { query: q });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', message: error.message });
  }
});

/**
 * Get author details and network
 */
router.get('/authors/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    const cypher = `
      MATCH (a:Author {name: $name})
      OPTIONAL MATCH (a)-[:AUTHORED]->(p:Paper)
      OPTIONAL MATCH (a)-[:AFFILIATED_WITH]->(i:Institution)
      OPTIONAL MATCH (a)-[:AUTHORED]->(:Paper)<-[:AUTHORED]-(coauthor:Author)
      WHERE coauthor <> a
      RETURN a,
             collect(DISTINCT {title: p.title, year: p.year, doi: p.doi}) as papers,
             collect(DISTINCT i.name) as institutions,
             collect(DISTINCT coauthor.name)[0..10] as coauthors
    `;
    
    const results = await runQuery(cypher, { name });
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    
    const author = results[0].a.properties;
    const papers = results[0].papers.filter(p => p.title);
    const institutions = results[0].institutions.filter(i => i);
    const coauthors = results[0].coauthors.filter(c => c);
    
    res.json({ author, papers, institutions, coauthors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch author', message: error.message });
  }
});

/**
 * Get paper details and citations
 */
router.get('/papers/:doi', async (req, res) => {
  try {
    const { doi } = req.params;
    
    const cypher = `
      MATCH (p:Paper {doi: $doi})
      OPTIONAL MATCH (p)<-[:AUTHORED]-(a:Author)
      OPTIONAL MATCH (p)-[:COVERS]->(t:Topic)
      OPTIONAL MATCH (p)-[:CITES]->(cited:Paper)
      OPTIONAL MATCH (p)<-[:CITES]-(citing:Paper)
      RETURN p,
             collect(DISTINCT a.name) as authors,
             collect(DISTINCT t.name) as topics,
             collect(DISTINCT {title: cited.title, doi: cited.doi, year: cited.year}) as references,
             collect(DISTINCT {title: citing.title, doi: citing.doi, year: citing.year}) as citedBy
    `;
    
    const results = await runQuery(cypher, { doi });
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    const paper = results[0].p.properties;
    const authors = results[0].authors.filter(a => a);
    const topics = results[0].topics.filter(t => t);
    const references = results[0].references.filter(r => r.title);
    const citedBy = results[0].citedBy.filter(c => c.title);
    
    res.json({ paper, authors, topics, references, citedBy });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch paper', message: error.message });
  }
});

/**
 * Find collaboration path between two authors (multi-hop traversal)
 */
router.get('/collaboration-path', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: 'Both from and to parameters required' });
    }
    
    const cypher = `
      MATCH (a1:Author {name: $from}), (a2:Author {name: $to})
      MATCH path = shortestPath((a1)-[:AUTHORED*..10]-(a2))
      WITH path, 
           [node in nodes(path) WHERE node:Author | node.name] as authors,
           [node in nodes(path) WHERE node:Paper | node.title] as papers
      RETURN authors, papers, length(path) as hops
      LIMIT 1
    `;
    
    const results = await runQuery(cypher, { from, to });
    
    if (results.length === 0) {
      return res.json({ found: false, message: 'No collaboration path found' });
    }
    
    res.json({ 
      found: true, 
      authors: results[0].authors,
      papers: results[0].papers,
      hops: results[0].hops
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find path', message: error.message });
  }
});

/**
 * Get topic details and related papers
 */
router.get('/topics/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    const cypher = `
      MATCH (t:Topic {name: $name})
      OPTIONAL MATCH (t)<-[:COVERS]-(p:Paper)
      OPTIONAL MATCH (t)<-[:SUBTOPIC_OF]-(sub:Topic)
      OPTIONAL MATCH (t)-[:SUBTOPIC_OF]->(parent:Topic)
      RETURN t,
             collect(DISTINCT {title: p.title, doi: p.doi, year: p.year})[0..20] as papers,
             collect(DISTINCT sub.name) as subtopics,
             collect(DISTINCT parent.name) as parents
    `;
    
    const results = await runQuery(cypher, { name });
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    
    const topic = results[0].t.properties;
    const papers = results[0].papers.filter(p => p.title);
    const subtopics = results[0].subtopics.filter(s => s);
    const parents = results[0].parents.filter(p => p);
    
    res.json({ topic, papers, subtopics, parents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topic', message: error.message });
  }
});

/**
 * Get topic co-occurrence (which topics appear together in papers)
 */
router.get('/topic-cooccurrence', async (req, res) => {
  try {
    const cypher = `
      MATCH (t1:Topic)<-[:COVERS]-(p:Paper)-[:COVERS]->(t2:Topic)
      WHERE id(t1) < id(t2)
      WITH t1.name as topic1, t2.name as topic2, count(p) as cooccurrences
      WHERE cooccurrences > 1
      RETURN topic1, topic2, cooccurrences
      ORDER BY cooccurrences DESC
      LIMIT 20
    `;
    
    const results = await runQuery(cypher);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch co-occurrence', message: error.message });
  }
});

/**
 * Get influential authors by citation count
 */
router.get('/influential-authors', async (req, res) => {
  try {
    const cypher = `
      MATCH (a:Author)-[:AUTHORED]->(p1:Paper)<-[:CITES]-(p2:Paper)
      WITH a, count(DISTINCT p2) as citation_count, count(DISTINCT p1) as paper_count
      RETURN a.name as name, citation_count, paper_count, a.h_index as h_index
      ORDER BY citation_count DESC
      LIMIT 20
    `;
    
    const results = await runQuery(cypher);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch influential authors', message: error.message });
  }
});

/**
 * Find cross-institutional collaborations
 */
router.get('/cross-institutional', async (req, res) => {
  try {
    const cypher = `
      MATCH (p:Paper)<-[:AUTHORED]-(a:Author)-[:AFFILIATED_WITH]->(i:Institution)
      WITH p, collect(DISTINCT i.name) as institutions
      WHERE size(institutions) > 1
      RETURN p.title as title, p.year as year, p.doi as doi, institutions
      ORDER BY p.year DESC
      LIMIT 20
    `;
    
    const results = await runQuery(cypher);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collaborations', message: error.message });
  }
});

/**
 * Get citation impact chain (papers that cite this paper, and their citations)
 */
router.get('/citation-chain/:doi', async (req, res) => {
  try {
    const { doi } = req.params;
    const maxHops = parseInt(req.query.maxHops) || 3;
    
    const cypher = `
      MATCH path = (p:Paper {doi: $doi})<-[:CITES*1..${maxHops}]-(citing:Paper)
      WITH citing, length(path) as hops, path
      ORDER BY hops, citing.year DESC
      RETURN citing.title as title, citing.doi as doi, citing.year as year, hops
      LIMIT 50
    `;
    
    const results = await runQuery(cypher, { doi });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch citation chain', message: error.message });
  }
});

/**
 * Get collaboration network for visualization
 */
router.get('/collaboration-network', async (req, res) => {
  try {
    const { author, depth = 2 } = req.query;
    
    if (!author) {
      return res.status(400).json({ error: 'Author parameter required' });
    }
    
    const cypher = `
      MATCH path = (a:Author {name: $author})-[:AUTHORED*..${depth * 2}]-(other:Author)
      WHERE other <> a
      WITH collect(path) as paths
      CALL apoc.convert.toTree(paths) yield value
      RETURN value
    `;
    
    // Fallback simpler query without APOC
    const simpleCypher = `
      MATCH (a:Author {name: $author})-[:AUTHORED]->(p:Paper)<-[:AUTHORED]-(coauthor:Author)
      WHERE coauthor <> a
      WITH DISTINCT coauthor
      LIMIT 20
      MATCH (coauthor)-[:AUTHORED]->(p2:Paper)<-[:AUTHORED]-(level2:Author)
      WHERE level2 <> coauthor AND level2.name <> $author
      RETURN DISTINCT level2.name as name, 'level2' as level
      LIMIT 50
    `;
    
    try {
      const results = await runQuery(cypher, { author });
      res.json(results);
    } catch (err) {
      // APOC may not be available, use simpler query
      const results = await runQuery(simpleCypher, { author });
      res.json(results);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch network', message: error.message });
  }
});

export default router;
