// TODO: Move to an external module required by both frontend and backend
export type NodeKind = "service" | "rds" | "sqs";

export interface BackendNode {
  name: string;
  kind: NodeKind;
  language?: string;
  path?: string;
  publicExposed?: boolean;
  vulnerabilities?: { severity: string; message: string }[];
  metadata?: Record<string, unknown>;
}

export interface BackendEdge {
  from: string;
  to: string;
}
