import { buildGraphFromRaw, buildSubGraphFromRoutes } from './graph.utils';
import { GraphNode, RawGraph } from './graph.types';

describe('buildGraphFromRaw', () => {
  it('should build graph with nodes indexed by name', () => {
    const raw: RawGraph = {
      nodes: [
        { name: 'a', kind: 'service' },
        { name: 'b', kind: 'rds' },
      ],
      edges: [],
    };

    const graph = buildGraphFromRaw(raw);

    expect(graph.nodes.size).toBe(2);
    expect(graph.nodes.get('a')).toEqual({ name: 'a', kind: 'service' });
    expect(graph.nodes.get('b')).toEqual({ name: 'b', kind: 'rds' });
  });

  it('should build adjacency map from edges with single target', () => {
    const raw: RawGraph = {
      nodes: [
        { name: 'a', kind: 'service' },
        { name: 'b', kind: 'service' },
      ],
      edges: [{ from: 'a', to: 'b' }],
    };

    const graph = buildGraphFromRaw(raw);

    expect(graph.adjacency.get('a')).toEqual(['b']);
    expect(graph.edges).toEqual([{ from: 'a', to: 'b' }]);
  });

  it('should handle edges with multiple targets (array)', () => {
    const raw: RawGraph = {
      nodes: [
        { name: 'a', kind: 'service' },
        { name: 'b', kind: 'service' },
        { name: 'c', kind: 'rds' },
      ],
      edges: [{ from: 'a', to: ['b', 'c'] }],
    };

    const graph = buildGraphFromRaw(raw);

    expect(graph.adjacency.get('a')).toEqual(['b', 'c']);
    expect(graph.edges).toEqual([
      { from: 'a', to: 'b' },
      { from: 'a', to: 'c' },
    ]);
  });

  it('should accumulate edges from same source', () => {
    const raw: RawGraph = {
      nodes: [
        { name: 'a', kind: 'service' },
        { name: 'b', kind: 'service' },
        { name: 'c', kind: 'service' },
      ],
      edges: [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' },
      ],
    };

    const graph = buildGraphFromRaw(raw);

    expect(graph.adjacency.get('a')).toEqual(['b', 'c']);
  });

  it('should return empty structures for empty input', () => {
    const raw: RawGraph = { nodes: [], edges: [] };

    const graph = buildGraphFromRaw(raw);

    expect(graph.nodes.size).toBe(0);
    expect(graph.adjacency.size).toBe(0);
    expect(graph.edges).toEqual([]);
  });
});

describe('buildSubGraphFromRoutes', () => {
  const allNodes = new Map<string, GraphNode>([
    ['a', { name: 'a', kind: 'service', publicExposed: true }],
    ['b', { name: 'b', kind: 'service' }],
    ['c', { name: 'c', kind: 'rds' }],
    ['d', { name: 'd', kind: 'sqs' }],
  ]);

  it('should build subgraph from a single route', () => {
    const routes = [['a', 'b', 'c']];

    const graph = buildSubGraphFromRoutes(routes, allNodes);

    expect(graph.nodes.size).toBe(3);
    expect(graph.nodes.has('a')).toBe(true);
    expect(graph.nodes.has('b')).toBe(true);
    expect(graph.nodes.has('c')).toBe(true);
    expect(graph.edges).toEqual([
      { from: 'a', to: 'b' },
      { from: 'b', to: 'c' },
    ]);
  });

  it('should deduplicate nodes across multiple routes', () => {
    const routes = [
      ['a', 'b'],
      ['a', 'c'],
    ];

    const graph = buildSubGraphFromRoutes(routes, allNodes);

    expect(graph.nodes.size).toBe(3); // a, b, c (a is shared)
  });

  it('should deduplicate edges across multiple routes', () => {
    const routes = [
      ['a', 'b', 'c'],
      ['a', 'b', 'd'],
    ];

    const graph = buildSubGraphFromRoutes(routes, allNodes);

    // a->b should only appear once
    const abEdges = graph.edges.filter((e) => e.from === 'a' && e.to === 'b');
    expect(abEdges.length).toBe(1);
  });

  it('should build correct adjacency map', () => {
    const routes = [['a', 'b', 'c']];

    const graph = buildSubGraphFromRoutes(routes, allNodes);

    expect(graph.adjacency.get('a')).toEqual(['b']);
    expect(graph.adjacency.get('b')).toEqual(['c']);
    expect(graph.adjacency.has('c')).toBe(false); // c has no outgoing edges
  });

  it('should skip nodes not found in allNodes', () => {
    const routes = [['a', 'unknown', 'b']];

    const graph = buildSubGraphFromRoutes(routes, allNodes);

    expect(graph.nodes.has('unknown')).toBe(false);
    expect(graph.nodes.size).toBe(2); // only a and b
  });

  it('should return empty graph for empty routes', () => {
    const graph = buildSubGraphFromRoutes([], allNodes);

    expect(graph.nodes.size).toBe(0);
    expect(graph.adjacency.size).toBe(0);
    expect(graph.edges).toEqual([]);
  });

  it('should handle single-node routes', () => {
    const routes = [['a']];

    const graph = buildSubGraphFromRoutes(routes, allNodes);

    expect(graph.nodes.size).toBe(1);
    expect(graph.nodes.has('a')).toBe(true);
    expect(graph.edges).toEqual([]);
  });

  it('should preserve node properties', () => {
    const routes = [['a']];

    const graph = buildSubGraphFromRoutes(routes, allNodes);

    expect(graph.nodes.get('a')).toEqual({
      name: 'a',
      kind: 'service',
      publicExposed: true,
    });
  });
});
