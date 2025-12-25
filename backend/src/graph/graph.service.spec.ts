import { Test, TestingModule } from '@nestjs/testing';
import { GraphService } from './graph.service';

describe('GraphService', () => {
  let service: GraphService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphService],
    }).compile();

    service = module.get<GraphService>(GraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNode', () => {
    it('should return a node by id', () => {
      const nodeIds = service.getAllNodeIds();
      if (nodeIds.length > 0) {
        const node = service.getNode(nodeIds[0]);
        expect(node).toBeDefined();
        expect(node?.name).toBe(nodeIds[0]);
      }
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
      expect(nodes.size).toBeGreaterThan(0);
    });
  });

  describe('getAllNodeIds', () => {
    it('should return an array of node ids', () => {
      const nodeIds = service.getAllNodeIds();
      expect(Array.isArray(nodeIds)).toBe(true);
      expect(nodeIds.length).toBeGreaterThan(0);
    });
  });

  describe('getNeighbors', () => {
    it('should return neighbors for a node with edges', () => {
      const edges = service.getEdges();
      if (edges.length > 0) {
        const neighbors = service.getNeighbors(edges[0].from);
        expect(Array.isArray(neighbors)).toBe(true);
        expect(neighbors).toContain(edges[0].to);
      }
    });

    it('should return empty array for node with no neighbors', () => {
      const neighbors = service.getNeighbors('non-existent-node');
      expect(neighbors).toEqual([]);
    });
  });

  describe('getAdjacencies', () => {
    it('should return adjacency map', () => {
      const adjacencies = service.getAdjacencies();
      expect(adjacencies).toBeInstanceOf(Map);
    });
  });

  describe('getEdges', () => {
    it('should return an array of edges', () => {
      const edges = service.getEdges();
      expect(Array.isArray(edges)).toBe(true);
    });

    it('should have edges with from and to properties', () => {
      const edges = service.getEdges();
      if (edges.length > 0) {
        expect(edges[0]).toHaveProperty('from');
        expect(edges[0]).toHaveProperty('to');
      }
    });
  });

  describe('getGraphBasedOnRoutes', () => {
    it('should return a subgraph based on routes', () => {
      const nodeIds = service.getAllNodeIds();
      if (nodeIds.length >= 2) {
        const routes = [[nodeIds[0], nodeIds[1]]];
        const subGraph = service.getGraphBasedOnRoutes(routes);

        expect(subGraph.nodes).toBeInstanceOf(Map);
        expect(Array.isArray(subGraph.edges)).toBe(true);
      }
    });

    it('should return empty graph for empty routes', () => {
      const subGraph = service.getGraphBasedOnRoutes([]);

      expect(subGraph.edges.length).toBe(0);
    });
  });
});
