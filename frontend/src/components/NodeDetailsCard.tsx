import type { BackendNode } from "../types/graph";
import { X } from "lucide-react";

export interface NodeDetailsCardProps {
  node: BackendNode | null;
  onClose?: () => void;
  className?: string;
}

export function NodeDetailsCard({
  node,
  onClose,
  className = "",
}: NodeDetailsCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-grey-200 p-5 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-grey-700">Node Details</h2>
        {node && onClose && (
          <button
            onClick={onClose}
            className="text-grey-400 hover:text-grey-600 transition-colors"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {node ? (
        <div className="space-y-4">
          <DetailField label="Name" value={node.name} />

          <DetailField label="Type" value={node.kind} capitalize />

          {node.language && (
            <DetailField label="Language" value={node.language} />
          )}

          {node.path && (
            <DetailField label="Path" value={node.path} mono breakAll />
          )}

          <div className="flex flex-wrap gap-2">
            {node.publicExposed && (
              <span className="inline-flex items-center px-2 py-1 bg-info-100 text-info-700 text-xs font-medium rounded-full">
                Public
              </span>
            )}
            {node.vulnerabilities && node.vulnerabilities.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 bg-error-100 text-error-700 text-xs font-medium rounded-full">
                {node.vulnerabilities.length} Vulnerabilities
              </span>
            )}
          </div>

          {node.vulnerabilities && node.vulnerabilities.length > 0 && (
            <div>
              <label className="text-xs text-grey-500 uppercase tracking-wide">
                Vulnerabilities
              </label>
              <div className="mt-2 space-y-2">
                {node.vulnerabilities.map((vuln, i) => (
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
  );
}

function DetailField({
  label,
  value,
  capitalize = false,
  mono = false,
  breakAll = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
  mono?: boolean;
  breakAll?: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-grey-500 uppercase tracking-wide">
        {label}
      </label>
      <p
        className={`text-sm mt-0.5 ${
          mono ? "font-mono text-grey-700" : "font-medium text-grey-900"
        } ${capitalize ? "capitalize" : ""} ${breakAll ? "break-all" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

export default NodeDetailsCard;
