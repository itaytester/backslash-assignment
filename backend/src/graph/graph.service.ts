import { Injectable, OnModuleInit } from '@nestjs/common';
import { Graph, GraphNode, GraphResponse, Route } from './graph.types';
import { buildSubGraphFromRoutes } from './graph.utils';
import { GraphRepository } from './repositories/graph.repository';

@Injectable()
export class GraphService implements OnModuleInit {
  private graph: Graph;

  constructor(private readonly graphRepository: GraphRepository) {}

  onModuleInit(): void {
    this.graph = this.graphRepository.loadGraph();
  }

  private tryGetGraph(): Graph {
    return this.graph ?? this.graphRepository.loadGraph();
  }

  getNode(id: string): GraphNode | undefined {
    return this.tryGetGraph().nodes.get(id);
  }

  getAllNodes(): Map<string, GraphNode> {
    return this.tryGetGraph().nodes;
  }

  getNeighbors(id: string): string[] {
    return this.tryGetGraph().adjacency.get(id) ?? [];
  }

  getAdjacencies(): Map<string, string[]> {
    return this.tryGetGraph().adjacency;
  }

  getAllNodeIds(): string[] {
    return Array.from(this.tryGetGraph().nodes.keys());
  }

  getEdges(): { from: string; to: string }[] {
    return this.tryGetGraph().edges;
  }

  getGraphBasedOnRoutes(routes: Route[]): GraphResponse {
    const graph = buildSubGraphFromRoutes(routes, this.tryGetGraph().nodes);
    return {
      edges: graph.edges,
      nodes: Array.from(graph.nodes.values()),
    };
  }
}
