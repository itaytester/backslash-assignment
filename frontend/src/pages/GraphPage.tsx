import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { FilterBar } from "../components/FilterBar";
import { GraphView } from "../components/GraphView";
import { NodeDetailsCard } from "../components/NodeDetailsCard";
import { StatisticsCard } from "../components/StatisticsCard";
import { useGraphQuery, type FilterName } from "../hooks/useGraphQuery";
import type { BackendNode } from "../types/graph";

export default function GraphPage() {
  const [selectedFilters, setSelectedFilters] = useState<FilterName[]>([]);
  const [selectedNode, setSelectedNode] = useState<BackendNode | null>(null);

  const { data, isLoading, isError, refetch } = useGraphQuery({
    filters: selectedFilters,
  });

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters as FilterName[]);
    setSelectedNode(null);
  };

  const handleNodeClick = (node: BackendNode) => {
    setSelectedNode(node);
  };

  return (
    <div className="min-h-screen bg-grey-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-grey-900">Graph Explorer</h1>
            <p className="text-sm text-grey-500 mt-1 text-left">
              Visualize and filter service dependencies
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          selectedFilters={selectedFilters}
          onChange={handleFilterChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="bg-white rounded-2xl border border-grey-200 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-grey-500">Loading graph...</p>
                </div>
              </div>
            ) : isError ? (
              <div className="bg-white rounded-2xl border border-error-200 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-10 h-10 text-error-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-error-700">
                    Failed to load graph
                  </p>
                  <p className="text-xs text-error-500 mt-1">
                    An unknown error occurred while fetching the graph
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="mt-4 px-4! py-2! bg-error-500! text-white! rounded-lg! text-sm! font-medium! hover:bg-error-600!"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <GraphView
                nodes={data?.nodes ?? []}
                edges={data?.edges ?? []}
                onNodeClick={handleNodeClick}
                selectedNodeId={selectedNode?.name}
                className="h-[600px]"
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <NodeDetailsCard
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              className="sticky top-6"
            />

            {data && (
              <StatisticsCard
                nodeCount={data.nodes.length}
                edgeCount={data.edges.length}
                className="mt-4"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
