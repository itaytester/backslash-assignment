import { Test, TestingModule } from '@nestjs/testing';
import { GraphService } from './graph.service';
import { GraphRepository } from './repositories/graph.repository';
import { Graph, GraphNode } from './graph.types';

describe('GraphService', () => {
  let service: GraphService;
  let mockGraphRepository: jest.Mocked<GraphRepository>;

  // Sample test data
  const mockNodes: Map<string, GraphNode> = new Map([
    ['service-a', { name: 'service-a', kind: 'service', publicExposed: true }],
    ['service-b', { name: 'service-b', kind: 'service' }],
    ['db-main', { name: 'db-main', kind: 'rds' }],
    ['queue-events', { name: 'queue-events', kind: 'sqs' }],
  ]);

  const mockEdges = [
    { from: 'service-a', to: 'service-b' },
    { from: 'service-a', to: 'db-main' },
    { from: 'service-b', to: 'queue-events' },
  ];

  const mockAdjacency = new Map<string, string[]>([
    ['service-a', ['service-b', 'db-main']],
    ['service-b', ['queue-events']],
    ['db-main', []],
    ['queue-events', []],
  ]);

  const mockGraph: Graph = {
    nodes: mockNodes,
    adjacency: mockAdjacency,
    edges: mockEdges,
  };

  beforeEach(async () => {
    mockGraphRepository = {
      loadGraph: jest.fn().mockReturnValue(mockGraph),
    } as unknown as jest.Mocked<GraphRepository>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphService,
        {
          provide: GraphRepository,
          useValue: mockGraphRepository,
        },
      ],
    }).compile();

    service = module.get<GraphService>(GraphService);
    service.onModuleInit(); // Trigger graph loading
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNode', () => {
    it('should return a node by id', () => {
      const node = service.getNode('service-a');
      expect(node).toBeDefined();
      expect(node?.name).toBe('service-a');
      expect(node?.kind).toBe('service');
    });

    it('should return undefined for non-existent node', () => {
      const node = service.getNode('non-existent-node-id');
      expect(node).toBeUndefined();
    });
  });

  describe('getAllNodes', () => {
    it('should return a map of all nodes', () => {
      const nodes = service.getAllNodes();
      expect(nodes).toBeInstanceOf(Map);
      expect(nodes.size).toBe(4);
    });

    it('should contain all expected nodes', () => {
      const nodes = service.getAllNodes();
      expect(nodes.has('service-a')).toBe(true);
      expect(nodes.has('service-b')).toBe(true);
      expect(nodes.has('db-main')).toBe(true);
      expect(nodes.has('queue-events')).toBe(true);
    });
  });

  describe('getAllNodeIds', () => {
    it('should return an array of node ids', () => {
      const nodeIds = service.getAllNodeIds();
      expect(Array.isArray(nodeIds)).toBe(true);
      expect(nodeIds.length).toBe(4);
    });

    it('should contain all expected node ids', () => {
      const nodeIds = service.getAllNodeIds();
      expect(nodeIds).toContain('service-a');
      expect(nodeIds).toContain('service-b');
      expect(nodeIds).toContain('db-main');
      expect(nodeIds).toContain('queue-events');
    });
  });

  describe('getNeighbors', () => {
    it('should return neighbors for a node with edges', () => {
      const neighbors = service.getNeighbors('service-a');
      expect(Array.isArray(neighbors)).toBe(true);
      expect(neighbors).toContain('service-b');
      expect(neighbors).toContain('db-main');
    });

    it('should return empty array for node with no neighbors', () => {
      const neighbors = service.getNeighbors('db-main');
      expect(neighbors).toEqual([]);
    });

    it('should return empty array for non-existent node', () => {
      const neighbors = service.getNeighbors('non-existent-node');
      expect(neighbors).toEqual([]);
    });
  });

  describe('getAdjacencies', () => {
    it('should return adjacency map', () => {
      const adjacencies = service.getAdjacencies();
      expect(adjacencies).toBeInstanceOf(Map);
    });

    it('should have correct adjacencies', () => {
      const adjacencies = service.getAdjacencies();
      expect(adjacencies.get('service-a')).toEqual(['service-b', 'db-main']);
      expect(adjacencies.get('service-b')).toEqual(['queue-events']);
    });
  });

  describe('getEdges', () => {
    it('should return an array of edges', () => {
      const edges = service.getEdges();
      expect(Array.isArray(edges)).toBe(true);
      expect(edges.length).toBe(3);
    });

    it('should have edges with from and to properties', () => {
      const edges = service.getEdges();
      edges.forEach((edge) => {
        expect(edge).toHaveProperty('from');
        expect(edge).toHaveProperty('to');
      });
    });

    it('should contain expected edges', () => {
      const edges = service.getEdges();
      expect(edges).toContainEqual({ from: 'service-a', to: 'service-b' });
      expect(edges).toContainEqual({ from: 'service-a', to: 'db-main' });
      expect(edges).toContainEqual({ from: 'service-b', to: 'queue-events' });
    });
  });

  describe('getGraphBasedOnRoutes', () => {
    it('should return a subgraph based on routes', () => {
      const routes = [['service-a', 'service-b']];
      const subGraph = service.getGraphBasedOnRoutes(routes);

      expect(Array.isArray(subGraph.nodes)).toBe(true);
      expect(Array.isArray(subGraph.edges)).toBe(true);
      expect(subGraph.nodes.length).toBe(2);
    });

    it('should include correct nodes from routes', () => {
      const routes = [['service-a', 'service-b', 'queue-events']];
      const subGraph = service.getGraphBasedOnRoutes(routes);

      const nodeNames = subGraph.nodes.map((n) => n.name);
      expect(nodeNames).toContain('service-a');
      expect(nodeNames).toContain('service-b');
      expect(nodeNames).toContain('queue-events');
    });

    it('should include correct edges from routes', () => {
      const routes = [['service-a', 'service-b']];
      const subGraph = service.getGraphBasedOnRoutes(routes);

      expect(subGraph.edges).toContainEqual({
        from: 'service-a',
        to: 'service-b',
      });
    });

    it('should return empty graph for empty routes', () => {
      const subGraph = service.getGraphBasedOnRoutes([]);

      expect(subGraph.nodes.length).toBe(0);
      expect(subGraph.edges.length).toBe(0);
    });

    it('should handle multiple routes with overlapping nodes', () => {
      const routes = [
        ['service-a', 'service-b'],
        ['service-a', 'db-main'],
      ];
      const subGraph = service.getGraphBasedOnRoutes(routes);

      // service-a should only appear once
      const nodeNames = subGraph.nodes.map((n) => n.name);
      expect(nodeNames.filter((n) => n === 'service-a').length).toBe(1);
      expect(subGraph.nodes.length).toBe(3); // service-a, service-b, db-main
    });
  });
});
