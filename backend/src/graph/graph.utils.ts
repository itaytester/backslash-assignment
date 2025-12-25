import { Graph, GraphNode, RawGraph, Route } from './graph.types';

/**
 * Builds a graph from raw graph data (nodes + edges).
 */
export function buildGraphFromRaw(raw: RawGraph): Graph {
  const nodes = new Map<string, GraphNode>();
  const adjacency = new Map<string, string[]>();
  const edges: { from: string; to: string }[] = [];

  for (const node of raw.nodes) {
    nodes.set(node.name, node);
  }

  for (const edge of raw.edges) {
    const targets = Array.isArray(edge.to) ? edge.to : [edge.to];

    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, []);
    }

    const neighbors = adjacency.get(edge.from)!;

    for (const t of targets) {
      neighbors.push(t);
      edges.push({ from: edge.from, to: t });
    }
  }

  return { nodes, adjacency, edges };
}

/**
 * Builds a subgraph from a set of routes.
 * @param routes - Array of routes (each route is an array of node IDs)
 * @param allNodes - Array of all available nodes
 */
export function buildSubGraphFromRoutes(
  routes: Route[],
  allNodes: Map<string, GraphNode>,
): Graph {
  const nodes = new Map<string, GraphNode>();
  const adjacency = new Map<string, string[]>();
  const edgeSet = new Set<string>();
  const edges: { from: string; to: string }[] = [];

  for (const route of routes) {
    for (let i = 0; i < route.length; i++) {
      const nodeId = route[i];

      // Add node if not already present
      if (!nodes.has(nodeId)) {
        const node = allNodes.get(nodeId);
        if (node) {
          nodes.set(nodeId, node);
        }
      }

      // Add edge to next node in route
      if (i < route.length - 1) {
        const from = nodeId;
        const to = route[i + 1];
        const edgeKey = `${from}->${to}`;

        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({ from, to });

          // Update adjacency
          if (!adjacency.has(from)) {
            adjacency.set(from, []);
          }
          adjacency.get(from)!.push(to);
        }
      }
    }
  }

  return { nodes, adjacency, edges };
}
