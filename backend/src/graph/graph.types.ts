export const nodeKinds = ['service', 'rds', 'sqs'] as const;
export const vulnerabilitySeverities = [
  'low',
  'medium',
  'high',
  'critical',
] as const;
export type NodeKind = (typeof nodeKinds)[number];
export type VulnerabilitySeverity = (typeof vulnerabilitySeverities)[number];
export interface Vulnerability {
  file: string;
  severity: VulnerabilitySeverity | (string & {});
  message: string;
  metadata?: Record<string, unknown>;
}

export interface GraphNode {
  name: string; // node id
  kind: NodeKind;
  language?: string;
  path?: string;
  publicExposed?: boolean;
  vulnerabilities?: Vulnerability[];
  metadata?: Record<string, unknown>;
}

export interface RawEdge {
  from: string;
  to: string | string[];
}

export interface RawGraph {
  nodes: GraphNode[];
  edges: RawEdge[];
}

export type Route = string[];

export interface Graph {
  nodes: Map<string, GraphNode>;
  adjacency: Map<string, string[]>;
  edges: { from: string; to: string }[];
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: { from: string; to: string }[];
}
