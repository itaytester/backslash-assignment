import {
  Filter,
  Globe,
  Database,
  AlertTriangle,
  Check,
  X,
  Sparkles,
} from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "error" | "warning" | "success" | "info";
}

const FILTERS: FilterOption[] = [
  {
    id: "startPublic",
    label: "Public Entry",
    icon: <Globe className="w-4 h-4" />,
    color: "info",
  },
  {
    id: "endSink",
    label: "Data Sink",
    icon: <Database className="w-4 h-4" />,
    color: "secondary",
  },
  {
    id: "hasVulnerability",
    label: "Vulnerable",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "error",
  },
];

const colorClasses = {
  primary: {
    active:
      "bg-primary-500! text-white! border-primary-500! shadow-lg shadow-primary-500/30",
    inactive:
      "bg-white! text-primary-700! border-primary-200! hover:bg-primary-50! hover:border-primary-400!",
  },
  secondary: {
    active:
      "bg-secondary-500! text-white! border-secondary-500! shadow-lg shadow-secondary-500/30",
    inactive:
      "bg-white! text-secondary-700! border-secondary-200! hover:bg-secondary-50! hover:border-secondary-400!",
  },
  error: {
    active:
      "bg-error-500! text-white! border-error-500! shadow-lg shadow-error-500/30",
    inactive:
      "bg-white! text-error-700! border-error-200! hover:bg-error-50! hover:border-error-400!",
  },
  warning: {
    active:
      "bg-warning-500! text-white! border-warning-500! shadow-lg shadow-warning-500/30",
    inactive:
      "bg-white! text-warning-700! border-warning-200! hover:bg-warning-50! hover:border-warning-400!",
  },
  success: {
    active:
      "bg-success-500! text-white! border-success-500! shadow-lg shadow-success-500/30",
    inactive:
      "bg-white! text-success-700! border-success-200! hover:bg-success-50! hover:border-success-400!",
  },
  info: {
    active:
      "bg-info-500! text-white! border-info-500! shadow-lg shadow-info-500/30",
    inactive:
      "bg-white! text-info-700! border-info-200! hover:bg-info-50! hover:border-info-400!",
  },
};

interface FilterBarProps {
  selectedFilters?: string[];
  onChange?: (filters: string[]) => void;
  className?: string;
}

export function FilterBar({
  selectedFilters = [],
  onChange,
  className = "",
}: FilterBarProps) {
  const handleToggle = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];
    onChange?.(newFilters);
  };

  const activeCount = selectedFilters.length;

  return (
    <div
      className={`bg-surface rounded-2xl shadow-md border border-grey-100 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-linear-to-r from-primary-500 to-primary-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">
                Route Filters
              </h3>
              <p className="text-primary-100 text-xs">Refine your graph view</p>
            </div>
          </div>
          {activeCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="bg-white text-primary-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {activeCount} active
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((filter) => {
            const isSelected = selectedFilters.includes(filter.id);
            const colors = colorClasses[filter.color];

            return (
              <button
                key={filter.id}
                onClick={() => handleToggle(filter.id)}
                className={`
                  group relative inline-flex items-center gap-2 px-4! py-2.5! rounded-xl! text-sm! font-medium!
                  border-2! transition-all duration-200 ease-out
                  focus:outline-none! focus:ring-2! focus:ring-offset-2! focus:ring-primary-500!
                  ${isSelected ? colors.active : colors.inactive}
                  ${isSelected ? "scale-[1.02]" : "hover:scale-[1.02]"}
                `}
                aria-pressed={isSelected}
              >
                <span className="absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />

                <span
                  className={`transition-transform duration-200 ${
                    isSelected ? "scale-110" : ""
                  }`}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : filter.icon}
                </span>

                {/* Label */}
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>

        {activeCount > 0 && (
          <div className="mt-4 pt-4 border-t border-grey-100">
            <button
              onClick={() => onChange?.([])}
              className="inline-flex items-center gap-1.5 text-sm text-grey-600 hover:text-error-500 font-medium transition-colors group"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
