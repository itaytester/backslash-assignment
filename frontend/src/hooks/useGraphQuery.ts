import { useQuery } from "@tanstack/react-query";
import type { BackendEdge, BackendNode } from "../types/graph";

export type FilterName = "startPublic" | "endSink" | "hasVulnerability";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface GraphResponse {
  nodes: BackendNode[];
  edges: BackendEdge[];
  routes?: string[][];
}

interface UseGraphQueryOptions {
  filters?: FilterName[];
  enabled?: boolean;
}

async function fetchGraph(filters: FilterName[]): Promise<GraphResponse> {
  const params = new URLSearchParams();

  filters.forEach((filter) => {
    params.append("filter", filter);
  });

  const url =
    filters.length > 0
      ? `${API_BASE_URL}/graph?${params.toString()}`
      : `${API_BASE_URL}/graph`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch graph: ${response.statusText}`);
  }

  return response.json();
}

export function useGraphQuery(options: UseGraphQueryOptions = {}) {
  const { filters = [], enabled = true } = options;

  return useQuery({
    queryKey: ["graph", filters],
    queryFn: () => fetchGraph(filters),
    enabled,
    refetchOnWindowFocus: false,
  });
}

export default useGraphQuery;
