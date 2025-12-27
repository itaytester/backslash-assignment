import { GraphCanvas, type GraphNode, type GraphEdge } from "reagraph";
import { useMemo } from "react";
import type { BackendEdge, BackendNode, NodeKind } from "../types/graph";

export interface GraphViewProps {
  nodes: BackendNode[];
  edges: BackendEdge[];
  onNodeClick?: (node: BackendNode) => void;
  selectedNodeId?: string;
  className?: string;
}

const NODE_COLORS: Record<NodeKind, string> = {
  service: "#2196f3",
  rds: "#9c27b0",
  sqs: "#ff9800",
};

const VULNERABLE_COLOR = "#f44336";
const PUBLIC_COLOR = "#03a9f4";

export function GraphView({
  nodes,
  edges,
  onNodeClick,
  selectedNodeId,
  className = "",
}: GraphViewProps) {
  const graphNodes: GraphNode[] = useMemo(
    () =>
      nodes.map((node) => {
        const hasVulnerabilities =
          node.vulnerabilities && node.vulnerabilities.length > 0;

        let fill = NODE_COLORS[node.kind];
        if (hasVulnerabilities) {
          fill = VULNERABLE_COLOR;
        }

        return {
          id: node.name,
          label: node.name,
          fill,
          data: node,
        };
      }),
    [nodes]
  );

  const graphEdges: GraphEdge[] = useMemo(
    () =>
      edges.map((edge, index) => ({
        id: `${edge.from}-${edge.to}-${index}`,
        source: edge.from,
        target: edge.to,
      })),
    [edges]
  );

  const handleNodeClick = (node: GraphNode) => {
    const backendNode = nodes.find((n) => n.name === node.id);
    if (backendNode && onNodeClick) {
      onNodeClick(backendNode);
    }
  };

  const handleNodeDeselect = () => {
    onNodeClick?.(null as unknown as BackendNode);
  };

  return (
    <div
      className={`relative bg-grey-50 rounded-2xl overflow-hidden border border-grey-200 ${className}`}
      style={{ height: "100%", minHeight: 400 }}
    >
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-xl shadow-md border border-grey-200 p-3">
        <div className="text-xs font-medium text-grey-500 mb-2">Legend</div>
        <div className="flex flex-col gap-1.5">
          <LegendItem color={NODE_COLORS.service} label="Service" />
          <LegendItem color={NODE_COLORS.rds} label="RDS" />
          <LegendItem color={NODE_COLORS.sqs} label="SQS" />
          <div className="border-t border-grey-100 my-1" />
          <LegendItem color={VULNERABLE_COLOR} label="Vulnerable" />
          <LegendItem color={PUBLIC_COLOR} label="Public" outlined />
        </div>
      </div>

      {/* Graph Canvas */}
      {graphNodes.length > 0 ? (
        <GraphCanvas
          nodes={graphNodes}
          edges={graphEdges}
          layoutType="forceDirected2d"
          onCanvasClick={handleNodeDeselect}
          labelType="all"
          draggable
          selections={selectedNodeId ? [selectedNodeId] : []}
          onNodeClick={handleNodeClick}
          edgeArrowPosition="end"
          cameraMode="pan"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-grey-400">
            <div className="w-12 h-12 mx-auto mb-3 opacity-50 rounded-full bg-grey-200 flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm font-medium">No nodes to display</p>
            <p className="text-xs">Add some nodes to visualize the graph</p>
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({
  color,
  label,
  outlined = false,
}: {
  color: string;
  label: string;
  outlined?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className="w-3 h-3 rounded-full"
        style={{
          backgroundColor: outlined ? "transparent" : color,
          border: outlined ? `2px solid ${color}` : "none",
        }}
      />
      <span className="text-grey-600">{label}</span>
    </div>
  );
}

export default GraphView;
