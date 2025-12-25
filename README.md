# Service Dependency Graph API

Visualizes and analyzes service dependencies for the train-ticket system.

## What It Does

- Loads a graph of services (nodes) and their connections (edges) from a JSON file
- Finds all possible routes between services using DFS traversal
- Filters routes based on security-relevant criteria
- Returns a subgraph containing only the filtered routes

## API

```
GET /graph?filter=startPublic,hasVulnerability
```

**Available filters** (combined with AND logic):

- `startPublic` — route starts from a publicly exposed service
- `endSink` — route ends at a data sink (RDS, SQS)
- `hasVulnerability` — at least one service in the route has vulnerabilities

## Decisions

- **DFS with max depth (8)** — Prevents exponential blowup on dense graphs
- **Filter registry pattern** — Easy to add new filters without modifying existing code
- **Routes as `string[]`** — Simple representation; node details looked up when needed
- **Subgraph extraction** — Returns only relevant nodes/edges for visualization

## Assumptions

- Graph data is static and loaded once at startup
- Routes are acyclic (no revisiting nodes in a single path)
- All filters must pass for a route to be included (AND logic)
- Node names are unique identifiers
