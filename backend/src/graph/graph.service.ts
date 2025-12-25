import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  Graph,
  GraphNode,
  GraphResponse,
  RawGraph,
  Route,
} from './graph.types';
import { buildGraphFromRaw, buildSubGraphFromRoutes } from './graph.utils';

@Injectable()
export class GraphService {
  private readonly graph: Graph;

  constructor() {
    const filePath = path.join(process.cwd(), '/src/graph/graph.json');
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RawGraph;
    this.graph = buildGraphFromRaw(raw);
  }

  getNode(id: string): GraphNode | undefined {
    return this.graph.nodes.get(id);
  }

  getAllNodes(): Map<string, GraphNode> {
    return this.graph.nodes;
  }

  getNeighbors(id: string): string[] {
    return this.graph.adjacency.get(id) ?? [];
  }

  getAdjacencies(): Map<string, string[]> {
    return this.graph.adjacency;
  }

  getAllNodeIds(): string[] {
    return Array.from(this.graph.nodes.keys());
  }

  getEdges(): { from: string; to: string }[] {
    return this.graph.edges;
  }

  getGraphBasedOnRoutes(routes: Route[]): GraphResponse {
    const graph = buildSubGraphFromRoutes(routes, this.graph.nodes);
    return {
      edges: graph.edges,
      nodes: Array.from(graph.nodes.values()),
    };
  }
}
