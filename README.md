# Research Knowledge Graph Explorer

A web application that visualizes and explores relationships between research papers, authors, institutions, and research topics using a graph database.

## 📹 Demo

https://github.com/user-attachments/assets/demo.mp4

> *Watch a complete walkthrough showing search functionality, entity exploration, collaboration path finding, and analytics dashboard with professional UI.*

## Why a Graph Database?

Research networks are inherently graph-structured. Key advantages over relational databases:

1. **Multi-hop Traversals**: Finding collaboration chains ("Who connects Author A to Author B?") requires complex recursive CTEs in SQL but is natural in Cypher with variable-length paths.

2. **Relationship-First Modeling**: Citations, co-authorships, and institutional affiliations are first-class entities with their own properties (citation year, collaboration role, affiliation period).

3. **Pattern Matching**: Queries like "Find all papers where authors from different institutions collaborated" are expressed directly as graph patterns rather than multiple JOIN operations.

4. **Schema Flexibility**: Adding new relationship types (e.g., "REVIEWED_BY", "FUNDED_BY") doesn't require ALTER TABLE or migration of existing data.

5. **Performance on Connected Data**: Graph databases maintain index-free adjacency, making traversals faster than JOIN-heavy queries as the network grows.

## Data Model

```
(Author)-[:AUTHORED {order: int}]->(Paper)
(Paper)-[:CITES {year: int}]->(Paper)
(Paper)-[:COVERS]->(Topic)
(Topic)-[:SUBTOPIC_OF]->(Topic)
(Author)-[:AFFILIATED_WITH {from: int, to: int}]->(Institution)
(Institution)-[:LOCATED_IN]->(Country)
```

### Node Types
- **Author**: name, email, h_index
- **Paper**: title, year, abstract, doi
- **Topic**: name, description
- **Institution**: name, type (university/company/lab)
- **Country**: name, code

### Relationship Types
- **AUTHORED**: Links authors to papers (with author order)
- **CITES**: Citation relationships between papers
- **COVERS**: Papers tagged with research topics
- **SUBTOPIC_OF**: Hierarchical topic taxonomy
- **AFFILIATED_WITH**: Author institutional affiliations over time
- **LOCATED_IN**: Geographic location of institutions

## Features

- � Search papers, authors, and topics
- 🕸️ Visualize collaboration networks
- 📊 Find citation chains and impact analysis
- 🌍 Explore geographic research distributions
- 🔗 Discover shortest collaboration paths between researchers
- 📈 Topic co-occurrence analysis

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite + TailwindCSS
- **Database**: CognoDB (Neo4j-compatible graph database)
- **Visualization**: D3.js for network graphs
- **Driver**: neo4j-driver (official Neo4j JavaScript driver)

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- A CognoDB Cloud instance

### 1. Create CognoDB Instance

1. Go to [https://console.cognodb.com/signup](https://console.cognodb.com/signup)
2. Create a free (c0) instance
3. Save your connection URI (format: `bolt+s://<instance-id>.databases.cognodb.cloud`)
4. Save the generated password for user "cognodb"

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the project root:

```env
COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USER=cognodb
COGNODB_PASSWORD=your-generated-password
PORT=3000
```

### 4. Load Seed Data

```bash
npm run seed
```

This will populate the database with realistic research data including papers, authors, institutions, and their relationships.

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Cypher Queries

### 1. Multi-hop Collaboration Path
Find the shortest collaboration path between two authors:
```cypher
MATCH path = shortestPath(
  (a1:Author {name: $author1})-[:AUTHORED*..10]-(a2:Author {name: $author2})
)
RETURN path
```

### 2. Citation Impact Chain
Find papers that cite a paper and their subsequent citations (2+ hops):
```cypher
MATCH (p:Paper {doi: $doi})<-[:CITES*2..3]-(citing:Paper)
RETURN citing.title, citing.year, length(path) as hops
ORDER BY hops, citing.year DESC
```

### 3. Cross-Institutional Collaborations
Find papers with authors from different institutions (awkward in SQL):
```cypher
MATCH (p:Paper)<-[:AUTHORED]-(a:Author)-[:AFFILIATED_WITH]->(i:Institution)
WITH p, collect(DISTINCT i.name) as institutions
WHERE size(institutions) > 1
RETURN p.title, institutions
```

### 4. Topic Co-occurrence
Find topics that frequently appear together:
```cypher
MATCH (t1:Topic)<-[:COVERS]-(p:Paper)-[:COVERS]->(t2:Topic)
WHERE id(t1) < id(t2)
RETURN t1.name, t2.name, count(p) as co_occurrences
ORDER BY co_occurrences DESC
LIMIT 20
```

### 5. Researcher Influence Network
Find influential authors through citation networks:
```cypher
MATCH (a:Author)-[:AUTHORED]->(p1:Paper)<-[:CITES]-(p2:Paper)
RETURN a.name, count(DISTINCT p2) as citation_count
ORDER BY citation_count DESC
LIMIT 10
```

## Project Structure

```
.
├── server/
│   ├── db.js           # CognoDB connection and driver setup
│   ├── routes.js       # API endpoints
│   └── server.js       # Express server
├── client/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── App.jsx     # Main app component
│   │   └── main.jsx    # Entry point
│   └── index.html
├── scripts/
│   └── seed.js         # Data loading script
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

- `GET /api/search?q=query&type=author|paper|topic` - Search across entities
- `GET /api/authors/:name` - Get author details and network
- `GET /api/papers/:doi` - Get paper details and citations
- `GET /api/collaboration-path?from=name1&to=name2` - Find collaboration path
- `GET /api/topics/:name` - Get topic details and related papers
- `GET /api/stats` - Get database statistics

## Screenshots & Demo

For a complete walkthrough of all features, see the **[Demo Video](#demo)** section above.

### Search Interface
The main search interface allows users to search across authors, papers, and topics with real-time results and smooth animations.

### Author Detail View
Displays author information, publications, affiliations, and collaboration networks with interactive navigation.

### Collaboration Path Finder
Interactive tool to discover connections between researchers through co-authorship chains with visual path display.

### Analytics Dashboard
Comprehensive view of database statistics, influential authors, cross-institutional collaborations, and topic co-occurrence trends.

*For visual demonstrations of these features, please refer to the demo video at the top of this document.*

## Deployment

The application is deployed at: [Demo URL will be added]

## Development Notes

- All Cypher queries use parameterization to prevent injection
- Error handling includes graceful degradation when database is unreachable
- Loading states and empty states are handled throughout the UI
- Connection pooling is managed by the official Neo4j driver

## License

MIT
