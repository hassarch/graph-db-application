import dotenv from 'dotenv';
import { initDriver, runWriteQuery, closeDriver } from '../server/db.js';

dotenv.config();

// Sample data
const countries = [
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'UK' },
  { name: 'Germany', code: 'DE' },
  { name: 'Canada', code: 'CA' },
  { name: 'Japan', code: 'JP' },
  { name: 'Australia', code: 'AU' }
];

const institutions = [
  { name: 'MIT', type: 'university', country: 'United States' },
  { name: 'Stanford University', type: 'university', country: 'United States' },
  { name: 'Oxford University', type: 'university', country: 'United Kingdom' },
  { name: 'Max Planck Institute', type: 'research lab', country: 'Germany' },
  { name: 'Google Research', type: 'company', country: 'United States' },
  { name: 'DeepMind', type: 'company', country: 'United Kingdom' },
  { name: 'University of Toronto', type: 'university', country: 'Canada' },
  { name: 'Tokyo University', type: 'university', country: 'Japan' },
  { name: 'CSIRO', type: 'research lab', country: 'Australia' },
  { name: 'Cambridge University', type: 'university', country: 'United Kingdom' }
];

const topics = [
  { name: 'Machine Learning', description: 'Algorithms that learn from data' },
  { name: 'Deep Learning', description: 'Neural networks with multiple layers' },
  { name: 'Natural Language Processing', description: 'Processing and understanding human language' },
  { name: 'Computer Vision', description: 'Teaching computers to interpret visual information' },
  { name: 'Reinforcement Learning', description: 'Learning through interaction with environment' },
  { name: 'Graph Neural Networks', description: 'Neural networks for graph-structured data' },
  { name: 'Transformers', description: 'Attention-based neural network architectures' },
  { name: 'Generative Models', description: 'Models that generate new data' },
  { name: 'Transfer Learning', description: 'Applying knowledge from one task to another' },
  { name: 'Explainable AI', description: 'Making AI decisions interpretable' }
];

const topicHierarchy = [
  { parent: 'Machine Learning', child: 'Deep Learning' },
  { parent: 'Machine Learning', child: 'Reinforcement Learning' },
  { parent: 'Deep Learning', child: 'Transformers' },
  { parent: 'Deep Learning', child: 'Graph Neural Networks' },
  { parent: 'Deep Learning', child: 'Generative Models' },
  { parent: 'Machine Learning', child: 'Transfer Learning' }
];

const authors = [
  { name: 'Dr. Sarah Chen', email: 'sarah.chen@example.com', h_index: 45 },
  { name: 'Prof. Michael Rodriguez', email: 'm.rodriguez@example.com', h_index: 62 },
  { name: 'Dr. Emily Watson', email: 'e.watson@example.com', h_index: 38 },
  { name: 'Prof. David Kim', email: 'd.kim@example.com', h_index: 71 },
  { name: 'Dr. Lisa Müller', email: 'l.muller@example.com', h_index: 29 },
  { name: 'Prof. James Anderson', email: 'j.anderson@example.com', h_index: 55 },
  { name: 'Dr. Maria Garcia', email: 'm.garcia@example.com', h_index: 42 },
  { name: 'Prof. Robert Taylor', email: 'r.taylor@example.com', h_index: 68 },
  { name: 'Dr. Yuki Tanaka', email: 'y.tanaka@example.com', h_index: 33 },
  { name: 'Prof. Sophie Laurent', email: 's.laurent@example.com', h_index: 51 },
  { name: 'Dr. Ahmed Hassan', email: 'a.hassan@example.com', h_index: 27 },
  { name: 'Prof. Anna Kowalski', email: 'a.kowalski@example.com', h_index: 47 },
  { name: 'Dr. Thomas Wright', email: 't.wright@example.com', h_index: 35 },
  { name: 'Prof. Isabella Romano', email: 'i.romano@example.com', h_index: 59 },
  { name: 'Dr. Kevin O\'Brien', email: 'k.obrien@example.com', h_index: 31 }
];

const papers = [
  {
    title: 'Attention Is All You Need',
    year: 2017,
    doi: '10.48550/arXiv.1706.03762',
    abstract: 'We propose a new simple network architecture based solely on attention mechanisms.'
  },
  {
    title: 'Deep Residual Learning for Image Recognition',
    year: 2016,
    doi: '10.1109/CVPR.2016.90',
    abstract: 'We present a residual learning framework to ease the training of very deep networks.'
  },
  {
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    year: 2019,
    doi: '10.18653/v1/N19-1423',
    abstract: 'We introduce BERT, a new language representation model.'
  },
  {
    title: 'Generative Adversarial Networks',
    year: 2014,
    doi: '10.48550/arXiv.1406.2661',
    abstract: 'We propose a new framework for estimating generative models via an adversarial process.'
  },
  {
    title: 'Graph Attention Networks',
    year: 2018,
    doi: '10.48550/arXiv.1710.10903',
    abstract: 'We present graph attention networks (GATs), novel neural network architectures.'
  },
  {
    title: 'Neural Machine Translation by Jointly Learning to Align and Translate',
    year: 2015,
    doi: '10.48550/arXiv.1409.0473',
    abstract: 'We introduce an extension to the encoder-decoder model which learns to align and translate jointly.'
  },
  {
    title: 'Mastering the Game of Go with Deep Neural Networks',
    year: 2016,
    doi: '10.1038/nature16961',
    abstract: 'We introduce a new approach to computer Go that uses deep neural networks.'
  },
  {
    title: 'GPT-3: Language Models are Few-Shot Learners',
    year: 2020,
    doi: '10.48550/arXiv.2005.14165',
    abstract: 'We show that scaling up language models greatly improves task-agnostic, few-shot performance.'
  },
  {
    title: 'Vision Transformer for Image Recognition',
    year: 2021,
    doi: '10.48550/arXiv.2010.11929',
    abstract: 'We show that Transformers applied directly to image patches can perform very well.'
  },
  {
    title: 'Self-Supervised Learning of Visual Representations',
    year: 2020,
    doi: '10.48550/arXiv.2002.05709',
    abstract: 'We present a framework for self-supervised learning of visual representations.'
  },
  {
    title: 'Explainable AI: Interpreting Deep Neural Networks',
    year: 2019,
    doi: '10.48550/arXiv.1906.08988',
    abstract: 'We provide methods for interpreting predictions of deep neural networks.'
  },
  {
    title: 'Few-Shot Learning with Graph Neural Networks',
    year: 2018,
    doi: '10.48550/arXiv.1711.04043',
    abstract: 'We propose to use graph neural networks for few-shot learning.'
  },
  {
    title: 'Multimodal Learning with Transformers',
    year: 2021,
    doi: '10.48550/arXiv.2103.00020',
    abstract: 'We present a unified architecture for multimodal learning using transformers.'
  },
  {
    title: 'Reinforcement Learning in Robotics',
    year: 2019,
    doi: '10.48550/arXiv.1909.12271',
    abstract: 'We survey reinforcement learning approaches for robotics applications.'
  },
  {
    title: 'Transfer Learning for Natural Language Processing',
    year: 2020,
    doi: '10.48550/arXiv.2005.00052',
    abstract: 'We explore transfer learning techniques for various NLP tasks.'
  }
];

// Paper authorship (which authors wrote which papers)
const authorships = [
  { paper: 0, authors: [0, 1, 3] },    // Attention paper
  { paper: 1, authors: [2, 4, 7] },    // ResNet paper
  { paper: 2, authors: [3, 6, 9] },    // BERT paper
  { paper: 3, authors: [1, 5] },       // GAN paper
  { paper: 4, authors: [8, 11] },      // GAT paper
  { paper: 5, authors: [0, 2, 10] },   // Neural MT paper
  { paper: 6, authors: [5, 7, 13] },   // AlphaGo paper
  { paper: 7, authors: [1, 3, 6] },    // GPT-3 paper
  { paper: 8, authors: [2, 9, 12] },   // Vision Transformer
  { paper: 9, authors: [4, 8, 14] },   // Self-supervised learning
  { paper: 10, authors: [11, 13] },    // Explainable AI
  { paper: 11, authors: [8, 10, 14] }, // Few-shot GNN
  { paper: 12, authors: [0, 6, 12] },  // Multimodal transformers
  { paper: 13, authors: [5, 9, 14] },  // RL Robotics
  { paper: 14, authors: [3, 10, 13] }  // Transfer learning NLP
];

// Paper topics
const paperTopics = [
  { paper: 0, topics: ['Transformers', 'Natural Language Processing', 'Deep Learning'] },
  { paper: 1, topics: ['Computer Vision', 'Deep Learning'] },
  { paper: 2, topics: ['Transformers', 'Natural Language Processing', 'Transfer Learning'] },
  { paper: 3, topics: ['Generative Models', 'Deep Learning'] },
  { paper: 4, topics: ['Graph Neural Networks', 'Deep Learning'] },
  { paper: 5, topics: ['Natural Language Processing', 'Deep Learning'] },
  { paper: 6, topics: ['Reinforcement Learning', 'Deep Learning'] },
  { paper: 7, topics: ['Transformers', 'Natural Language Processing', 'Transfer Learning'] },
  { paper: 8, topics: ['Transformers', 'Computer Vision', 'Deep Learning'] },
  { paper: 9, topics: ['Computer Vision', 'Transfer Learning', 'Deep Learning'] },
  { paper: 10, topics: ['Explainable AI', 'Deep Learning'] },
  { paper: 11, topics: ['Graph Neural Networks', 'Transfer Learning', 'Deep Learning'] },
  { paper: 12, topics: ['Transformers', 'Deep Learning', 'Computer Vision'] },
  { paper: 13, topics: ['Reinforcement Learning', 'Deep Learning'] },
  { paper: 14, topics: ['Natural Language Processing', 'Transfer Learning', 'Deep Learning'] }
];

// Citations (which papers cite which papers)
const citations = [
  { from: 2, to: 0, year: 2019 },  // BERT cites Attention
  { from: 7, to: 0, year: 2020 },  // GPT-3 cites Attention
  { from: 7, to: 2, year: 2020 },  // GPT-3 cites BERT
  { from: 8, to: 0, year: 2021 },  // ViT cites Attention
  { from: 8, to: 1, year: 2021 },  // ViT cites ResNet
  { from: 12, to: 0, year: 2021 }, // Multimodal cites Attention
  { from: 12, to: 8, year: 2021 }, // Multimodal cites ViT
  { from: 11, to: 4, year: 2018 }, // Few-shot cites GAT
  { from: 9, to: 1, year: 2020 },  // Self-supervised cites ResNet
  { from: 14, to: 2, year: 2020 }, // Transfer NLP cites BERT
  { from: 5, to: 0, year: 2015 },  // Earlier work that influenced Attention
  { from: 10, to: 1, year: 2019 }, // Explainable cites ResNet
  { from: 10, to: 3, year: 2019 }  // Explainable cites GAN
];

// Author affiliations
const affiliations = [
  { author: 0, institution: 'MIT', from: 2015, to: 2026 },
  { author: 1, institution: 'Google Research', from: 2016, to: 2026 },
  { author: 2, institution: 'Stanford University', from: 2014, to: 2026 },
  { author: 3, institution: 'DeepMind', from: 2017, to: 2026 },
  { author: 4, institution: 'Max Planck Institute', from: 2013, to: 2026 },
  { author: 5, institution: 'DeepMind', from: 2015, to: 2026 },
  { author: 6, institution: 'Google Research', from: 2018, to: 2026 },
  { author: 7, institution: 'MIT', from: 2012, to: 2026 },
  { author: 8, institution: 'Tokyo University', from: 2016, to: 2026 },
  { author: 9, institution: 'Cambridge University', from: 2015, to: 2026 },
  { author: 10, institution: 'University of Toronto', from: 2017, to: 2026 },
  { author: 11, institution: 'Oxford University', from: 2014, to: 2026 },
  { author: 12, institution: 'Stanford University', from: 2019, to: 2026 },
  { author: 13, institution: 'Cambridge University', from: 2013, to: 2026 },
  { author: 14, institution: 'CSIRO', from: 2016, to: 2026 }
];

async function clearDatabase() {
  console.log('Clearing existing data...');
  await runWriteQuery('MATCH (n) DETACH DELETE n');
  console.log('✓ Database cleared');
}

async function createCountries() {
  console.log('Creating countries...');
  for (const country of countries) {
    await runWriteQuery(
      'CREATE (c:Country {name: $name, code: $code})',
      country
    );
  }
  console.log(`✓ Created ${countries.length} countries`);
}

async function createInstitutions() {
  console.log('Creating institutions...');
  for (const inst of institutions) {
    await runWriteQuery(
      `MATCH (c:Country {name: $country})
       CREATE (i:Institution {name: $name, type: $type})
       CREATE (i)-[:LOCATED_IN]->(c)`,
      inst
    );
  }
  console.log(`✓ Created ${institutions.length} institutions`);
}

async function createTopics() {
  console.log('Creating topics...');
  for (const topic of topics) {
    await runWriteQuery(
      'CREATE (t:Topic {name: $name, description: $description})',
      topic
    );
  }
  console.log(`✓ Created ${topics.length} topics`);
  
  console.log('Creating topic hierarchy...');
  for (const rel of topicHierarchy) {
    await runWriteQuery(
      `MATCH (parent:Topic {name: $parent})
       MATCH (child:Topic {name: $child})
       CREATE (child)-[:SUBTOPIC_OF]->(parent)`,
      rel
    );
  }
  console.log(`✓ Created ${topicHierarchy.length} topic relationships`);
}

async function createAuthors() {
  console.log('Creating authors...');
  for (const author of authors) {
    await runWriteQuery(
      'CREATE (a:Author {name: $name, email: $email, h_index: $h_index})',
      author
    );
  }
  console.log(`✓ Created ${authors.length} authors`);
}

async function createPapers() {
  console.log('Creating papers...');
  for (const paper of papers) {
    await runWriteQuery(
      'CREATE (p:Paper {title: $title, year: $year, doi: $doi, abstract: $abstract})',
      paper
    );
  }
  console.log(`✓ Created ${papers.length} papers`);
}

async function createAuthorships() {
  console.log('Creating authorship relationships...');
  for (const authorship of authorships) {
    const paper = papers[authorship.paper];
    for (let i = 0; i < authorship.authors.length; i++) {
      const author = authors[authorship.authors[i]];
      await runWriteQuery(
        `MATCH (a:Author {name: $authorName})
         MATCH (p:Paper {doi: $doi})
         CREATE (a)-[:AUTHORED {order: $order}]->(p)`,
        { authorName: author.name, doi: paper.doi, order: i + 1 }
      );
    }
  }
  console.log('✓ Created authorship relationships');
}

async function createPaperTopics() {
  console.log('Creating paper-topic relationships...');
  for (const pt of paperTopics) {
    const paper = papers[pt.paper];
    for (const topicName of pt.topics) {
      await runWriteQuery(
        `MATCH (p:Paper {doi: $doi})
         MATCH (t:Topic {name: $topicName})
         CREATE (p)-[:COVERS]->(t)`,
        { doi: paper.doi, topicName }
      );
    }
  }
  console.log('✓ Created paper-topic relationships');
}

async function createCitations() {
  console.log('Creating citations...');
  for (const citation of citations) {
    const fromPaper = papers[citation.from];
    const toPaper = papers[citation.to];
    await runWriteQuery(
      `MATCH (p1:Paper {doi: $fromDoi})
       MATCH (p2:Paper {doi: $toDoi})
       CREATE (p1)-[:CITES {year: $year}]->(p2)`,
      { fromDoi: fromPaper.doi, toDoi: toPaper.doi, year: citation.year }
    );
  }
  console.log(`✓ Created ${citations.length} citations`);
}

async function createAffiliations() {
  console.log('Creating author affiliations...');
  for (const aff of affiliations) {
    const author = authors[aff.author];
    await runWriteQuery(
      `MATCH (a:Author {name: $authorName})
       MATCH (i:Institution {name: $institutionName})
       CREATE (a)-[:AFFILIATED_WITH {from: $from, to: $to}]->(i)`,
      { 
        authorName: author.name, 
        institutionName: aff.institution,
        from: aff.from,
        to: aff.to
      }
    );
  }
  console.log('✓ Created author affiliations');
}

async function createIndexes() {
  console.log('Creating indexes...');
  
  try {
    await runWriteQuery('CREATE INDEX author_name IF NOT EXISTS FOR (a:Author) ON (a.name)');
    await runWriteQuery('CREATE INDEX paper_doi IF NOT EXISTS FOR (p:Paper) ON (p.doi)');
    await runWriteQuery('CREATE INDEX paper_title IF NOT EXISTS FOR (p:Paper) ON (p.title)');
    await runWriteQuery('CREATE INDEX topic_name IF NOT EXISTS FOR (t:Topic) ON (t.name)');
    console.log('✓ Created indexes');
  } catch (error) {
    console.log('⚠ Index creation skipped (may not be supported in all versions)');
  }
}

async function seed() {
  try {
    console.log('\n🌱 Starting database seed...\n');
    
    initDriver();
    
    await clearDatabase();
    await createCountries();
    await createInstitutions();
    await createTopics();
    await createAuthors();
    await createPapers();
    await createAuthorships();
    await createPaperTopics();
    await createCitations();
    await createAffiliations();
    await createIndexes();
    
    console.log('\n✅ Database seeded successfully!\n');
    
    // Show some stats
    const stats = await runWriteQuery(`
      MATCH (n)
      RETURN labels(n)[0] as label, count(*) as count
      ORDER BY count DESC
    `);
    
    console.log('Database contents:');
    stats.forEach(row => {
      console.log(`  ${row.label}: ${row.count}`);
    });
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await closeDriver();
  }
}

seed();
