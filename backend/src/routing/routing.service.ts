// src/routing/routing.service.ts
import { Injectable } from '@nestjs/common';
import { GraphNode, Route } from '../graph/graph.types';
import { applyFilters, FilterName } from '../graph/graph.filters';

@Injectable()
export class RoutingService {
  private cachedRoutes: Route[] | null = null;

  findAllRoutes(
    nodes: GraphNode[],
    adjacencies: Map<string, string[]>,
    maxDepth = 8,
  ): Route[] {
    if (this.cachedRoutes) {
      return this.cachedRoutes;
    }

    const routes: Route[] = [];

    for (const start of nodes) {
      this.dfs(adjacencies, start.name, [start.name], routes, maxDepth);
    }

    this.cachedRoutes = routes;

    return routes;
  }

  getFilteredRoutes(
    routes: Route[],
    filterNames: FilterName[],
    nodeMap: Map<string, GraphNode>,
  ): Route[] {
    return applyFilters(routes, filterNames, nodeMap).filteredRoutes;
  }

  invalidateCache(): void {
    this.cachedRoutes = null;
  }

  private dfs(
    adjacencies: Map<string, string[]>,
    current: string,
    path: Route,
    routes: Route[],
    maxDepth: number,
  ) {
    if (path.length > maxDepth) return;

    if (path.length > 1) {
      routes.push([...path]);
    }

    const neighbors = adjacencies.get(current) ?? [];

    for (const neighbor of neighbors) {
      if (path.includes(neighbor)) continue;
      path.push(neighbor);
      this.dfs(adjacencies, neighbor, path, routes, maxDepth);
      path.pop();
    }
  }
}
