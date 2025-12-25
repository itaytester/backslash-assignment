import { Test, TestingModule } from '@nestjs/testing';
import { RoutingService } from './routing.service';
import { GraphNode } from './graph.types';

describe('RoutingService', () => {
  let service: RoutingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoutingService],
    }).compile();

    service = module.get<RoutingService>(RoutingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllRoutes', () => {
    it('should find all routes in a simple linear graph', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service' },
        { name: 'B', kind: 'service' },
        { name: 'C', kind: 'rds' },
      ];

      const adjacencies = new Map<string, string[]>([
        ['A', ['B']],
        ['B', ['C']],
        ['C', []],
      ]);

      const routes = service.findAllRoutes(nodes, adjacencies);

      // Should find: A->B, A->B->C, B->C
      expect(routes).toContainEqual(['A', 'B']);
      expect(routes).toContainEqual(['A', 'B', 'C']);
      expect(routes).toContainEqual(['B', 'C']);
    });

    it('should find all routes in a branching graph', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service' },
        { name: 'B', kind: 'service' },
        { name: 'C', kind: 'service' },
        { name: 'D', kind: 'rds' },
      ];

      const adjacencies = new Map<string, string[]>([
        ['A', ['B', 'C']],
        ['B', ['D']],
        ['C', ['D']],
        ['D', []],
      ]);

      const routes = service.findAllRoutes(nodes, adjacencies);

      expect(routes).toContainEqual(['A', 'B']);
      expect(routes).toContainEqual(['A', 'B', 'D']);
      expect(routes).toContainEqual(['A', 'C']);
      expect(routes).toContainEqual(['A', 'C', 'D']);
    });

    it('should handle cycles by not revisiting nodes in the same path', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service' },
        { name: 'B', kind: 'service' },
        { name: 'C', kind: 'service' },
      ];

      const adjacencies = new Map<string, string[]>([
        ['A', ['B']],
        ['B', ['C']],
        ['C', ['A']], // Cycle back to A
      ]);

      const routes = service.findAllRoutes(nodes, adjacencies);

      // Should not have infinite routes or routes with repeated nodes
      routes.forEach((route) => {
        const uniqueNodes = new Set(route);
        expect(uniqueNodes.size).toBe(route.length);
      });
    });

    it('should respect maxDepth parameter', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service' },
        { name: 'B', kind: 'service' },
        { name: 'C', kind: 'service' },
        { name: 'D', kind: 'rds' },
      ];

      const adjacencies = new Map<string, string[]>([
        ['A', ['B']],
        ['B', ['C']],
        ['C', ['D']],
        ['D', []],
      ]);

      const routes = service.findAllRoutes(nodes, adjacencies, 2);

      // With maxDepth=2, should not have routes longer than 2 nodes
      routes.forEach((route) => {
        expect(route.length).toBeLessThanOrEqual(2);
      });
    });

    it('should return empty array for nodes with no edges', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service' },
        { name: 'B', kind: 'service' },
      ];

      const adjacencies = new Map<string, string[]>([
        ['A', []],
        ['B', []],
      ]);

      const routes = service.findAllRoutes(nodes, adjacencies);

      expect(routes).toHaveLength(0);
    });

    it('should return empty array for empty graph', () => {
      const nodes: GraphNode[] = [];
      const adjacencies = new Map<string, string[]>();

      const routes = service.findAllRoutes(nodes, adjacencies);

      expect(routes).toHaveLength(0);
    });

    it('should handle single node graph', () => {
      const nodes: GraphNode[] = [{ name: 'A', kind: 'service' }];
      const adjacencies = new Map<string, string[]>([['A', []]]);

      const routes = service.findAllRoutes(nodes, adjacencies);

      expect(routes).toHaveLength(0);
    });
  });

  describe('getFilteredRoutes', () => {
    const createNodeMap = (nodes: GraphNode[]): Map<string, GraphNode> => {
      return new Map(nodes.map((n) => [n.name, n]));
    };

    it('should return all routes when no filters are applied', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service' },
        { name: 'B', kind: 'rds' },
      ];
      const nodeMap = createNodeMap(nodes);
      const routes = [['A', 'B']];

      const result = service.getFilteredRoutes(routes, [], nodeMap);

      expect(result).toEqual(routes);
    });

    it('should filter routes by startPublic', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service', publicExposed: true },
        { name: 'B', kind: 'service', publicExposed: false },
        { name: 'C', kind: 'rds' },
      ];
      const nodeMap = createNodeMap(nodes);
      const routes = [
        ['A', 'C'],
        ['B', 'C'],
      ];

      const result = service.getFilteredRoutes(
        routes,
        ['startPublic'],
        nodeMap,
      );

      expect(result).toContainEqual(['A', 'C']);
      expect(result).not.toContainEqual(['B', 'C']);
    });

    it('should filter routes by endSink', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service' },
        { name: 'B', kind: 'service' },
        { name: 'C', kind: 'rds' },
      ];
      const nodeMap = createNodeMap(nodes);
      const routes = [
        ['A', 'C'], // Ends at rds (sink)
        ['A', 'B'], // Ends at service (not a sink)
      ];

      const result = service.getFilteredRoutes(routes, ['endSink'], nodeMap);

      expect(result).toContainEqual(['A', 'C']);
      expect(result).not.toContainEqual(['A', 'B']);
    });

    it('should filter routes by hasVulnerability', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service' },
        {
          name: 'B',
          kind: 'service',
          vulnerabilities: [
            { file: 'test.ts', severity: 'high', message: 'XSS' },
          ],
        },
        { name: 'C', kind: 'rds' },
      ];
      const nodeMap = createNodeMap(nodes);
      const routes = [
        ['A', 'B', 'C'], // Contains vulnerable node B
        ['A', 'C'], // No vulnerable nodes
      ];

      const result = service.getFilteredRoutes(
        routes,
        ['hasVulnerability'],
        nodeMap,
      );

      expect(result).toContainEqual(['A', 'B', 'C']);
      expect(result).not.toContainEqual(['A', 'C']);
    });

    it('should apply multiple filters (AND logic)', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service', publicExposed: true },
        { name: 'B', kind: 'service', publicExposed: false },
        {
          name: 'C',
          kind: 'service',
          vulnerabilities: [
            { file: 'test.ts', severity: 'high', message: 'SQL' },
          ],
        },
        { name: 'D', kind: 'rds' },
      ];
      const nodeMap = createNodeMap(nodes);
      const routes = [
        ['A', 'C', 'D'], // Public start, has vuln, ends at sink - passes all
        ['B', 'C', 'D'], // Not public start
        ['A', 'D'], // No vulnerability
      ];

      const result = service.getFilteredRoutes(
        routes,
        ['startPublic', 'hasVulnerability', 'endSink'],
        nodeMap,
      );

      expect(result).toHaveLength(1);
      expect(result).toContainEqual(['A', 'C', 'D']);
    });

    it('should return empty array when no routes match filters', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service', publicExposed: false },
        { name: 'B', kind: 'rds' },
      ];
      const nodeMap = createNodeMap(nodes);
      const routes = [['A', 'B']];

      const result = service.getFilteredRoutes(
        routes,
        ['startPublic'],
        nodeMap,
      );

      expect(result).toHaveLength(0);
    });

    it('should handle empty routes array', () => {
      const nodes: GraphNode[] = [{ name: 'A', kind: 'service' }];
      const nodeMap = createNodeMap(nodes);

      const result = service.getFilteredRoutes([], ['startPublic'], nodeMap);

      expect(result).toHaveLength(0);
    });

    it('should treat sqs as sink', () => {
      const nodes: GraphNode[] = [
        { name: 'A', kind: 'service' },
        { name: 'B', kind: 'sqs' },
      ];
      const nodeMap = createNodeMap(nodes);
      const routes = [['A', 'B']];

      const result = service.getFilteredRoutes(routes, ['endSink'], nodeMap);

      expect(result).toContainEqual(['A', 'B']);
    });
  });
});
