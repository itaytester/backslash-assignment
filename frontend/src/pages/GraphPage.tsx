import { useState } from "react";
import { FilterBar } from "../components/FilterBar";
import { GraphView } from "../components/GraphView";
import { useGraphQuery, type FilterName } from "../hooks/useGraphQuery";
import { Loader2, AlertCircle } from "lucide-react";
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
            <p className="text-sm text-grey-500 mt-1">
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
            <div className="bg-white rounded-2xl border border-grey-200 p-5 sticky top-6">
              <h2 className="text-sm font-semibold text-grey-700 mb-4">
                Node Details
              </h2>

              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-grey-500 uppercase tracking-wide">
                      Name
                    </label>
                    <p className="text-sm font-medium text-grey-900 mt-0.5">
                      {selectedNode.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs text-grey-500 uppercase tracking-wide">
                      Type
                    </label>
                    <p className="text-sm font-medium text-grey-900 mt-0.5 capitalize">
                      {selectedNode.kind}
                    </p>
                  </div>

                  {selectedNode.language && (
                    <div>
                      <label className="text-xs text-grey-500 uppercase tracking-wide">
                        Language
                      </label>
                      <p className="text-sm font-medium text-grey-900 mt-0.5">
                        {selectedNode.language}
                      </p>
                    </div>
                  )}

                  {selectedNode.path && (
                    <div>
                      <label className="text-xs text-grey-500 uppercase tracking-wide">
                        Path
                      </label>
                      <p className="text-sm font-mono text-grey-700 mt-0.5 break-all">
                        {selectedNode.path}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {selectedNode.publicExposed && (
                      <span className="inline-flex items-center px-2 py-1 bg-info-100 text-info-700 text-xs font-medium rounded-full">
                        Public
                      </span>
                    )}
                    {selectedNode.vulnerabilities &&
                      selectedNode.vulnerabilities.length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 bg-error-100 text-error-700 text-xs font-medium rounded-full">
                          {selectedNode.vulnerabilities.length} Vulnerabilities
                        </span>
                      )}
                  </div>

                  {selectedNode.vulnerabilities &&
                    selectedNode.vulnerabilities.length > 0 && (
                      <div>
                        <label className="text-xs text-grey-500 uppercase tracking-wide">
                          Vulnerabilities
                        </label>
                        <div className="mt-2 space-y-2">
                          {selectedNode.vulnerabilities.map((vuln, i) => (
                            <div
                              key={i}
                              className="p-2 bg-error-50 border border-error-100 rounded-lg"
                            >
                              <span className="text-xs font-semibold text-error-600 uppercase">
                                {vuln.severity}
                              </span>
                              <p className="text-xs text-error-700 mt-0.5">
                                {vuln.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <p className="text-sm text-grey-400 italic">
                  Click a node to see details
                </p>
              )}
            </div>

            {data && (
              <div className="bg-white rounded-2xl border border-grey-200 p-5 mt-4">
                <h2 className="text-sm font-semibold text-grey-700 mb-4">
                  Statistics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-grey-50 rounded-xl">
                    <p className="text-2xl font-bold text-primary-600">
                      {data.nodes.length}
                    </p>
                    <p className="text-xs text-grey-500 mt-1">Nodes</p>
                  </div>
                  <div className="text-center p-3 bg-grey-50 rounded-xl">
                    <p className="text-2xl font-bold text-secondary-600">
                      {data.edges.length}
                    </p>
                    <p className="text-xs text-grey-500 mt-1">Edges</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
