import { GraphNode, Route } from './graph.types';

export interface RouteFilterContext {
  nodeMap: Map<string, GraphNode>;
}

export type RouteFilterFn = (route: Route, ctx: RouteFilterContext) => boolean;

export const filterNames = [
  'startPublic',
  'endSink',
  'hasVulnerability',
] as const;

export type FilterName = (typeof filterNames)[number];

export const routeFiltersRegistry: Record<FilterName, RouteFilterFn> = {
  startPublic(route, { nodeMap }) {
    return !!nodeMap.get(route[0])?.publicExposed;
  },
  endSink(route, { nodeMap }) {
    const n = nodeMap.get(route[route.length - 1]);
    return n?.kind === 'rds' || n?.kind === 'sqs';
  },
  hasVulnerability(route, { nodeMap }) {
    return route.some((id) => {
      const v = nodeMap.get(id)?.vulnerabilities;
      if (!!v && v.length > 0) {
        console.log('stam');
      }
      return !!v && v.length > 0;
    });
  },
};

export interface FilteredGraphResult {
  filteredRoutes: Route[];
}

export function applyFilters(
  routes: Route[],
  filterNames: FilterName[],
  nodeMap: Map<string, GraphNode>,
): FilteredGraphResult {
  const fns = filterNames
    .map((name) => routeFiltersRegistry[name])
    .filter(Boolean);

  const filteredRoutes =
    fns.length === 0
      ? routes
      : routes.filter((route) => fns.every((fn) => fn(route, { nodeMap })));

  return {
    filteredRoutes,
  };
}
