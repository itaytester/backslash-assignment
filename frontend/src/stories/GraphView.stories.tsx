import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  GraphView,
  type BackendNode,
  type BackendEdge,
} from "../components/GraphView";

const meta: Meta<typeof GraphView> = {
  title: "Components/GraphView",
  component: GraphView,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ height: "600px", padding: "20px", background: "#f5f5f5" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GraphView>;

// Sample data
const sampleNodes: BackendNode[] = [
  { name: "api-gateway", kind: "service", publicExposed: true },
  { name: "user-service", kind: "service" },
  { name: "order-service", kind: "service" },
  {
    name: "payment-service",
    kind: "service",
    vulnerabilities: [{ severity: "high", message: "SQL Injection risk" }],
  },
  { name: "users-db", kind: "rds" },
  { name: "orders-db", kind: "rds" },
  { name: "notification-queue", kind: "sqs" },
  { name: "email-queue", kind: "sqs" },
];

const sampleEdges: BackendEdge[] = [
  { from: "api-gateway", to: "user-service" },
  { from: "api-gateway", to: "order-service" },
  { from: "user-service", to: "users-db" },
  { from: "order-service", to: "orders-db" },
  { from: "order-service", to: "payment-service" },
  { from: "payment-service", to: "notification-queue" },
  { from: "notification-queue", to: "email-queue" },
];

// Interactive wrapper
const InteractiveGraphView = (args: React.ComponentProps<typeof GraphView>) => {
  const [selectedId, setSelectedId] = useState<string | undefined>();

  return (
    <div className="h-full flex flex-col gap-4">
      <GraphView
        {...args}
        selectedNodeId={selectedId}
        onNodeClick={(node) => {
          setSelectedId(node.name);
          args.onNodeClick?.(node);
        }}
        className="flex-1"
      />
      {selectedId && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-grey-200">
          <p className="text-sm">
            <span className="font-medium">Selected:</span> {selectedId}
          </p>
        </div>
      )}
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveGraphView {...args} />,
  args: {
    nodes: sampleNodes,
    edges: sampleEdges,
  },
};

export const SimpleGraph: Story = {
  render: (args) => <InteractiveGraphView {...args} />,
  args: {
    nodes: [
      { name: "service-a", kind: "service", publicExposed: true },
      { name: "service-b", kind: "service" },
      { name: "database", kind: "rds" },
    ],
    edges: [
      { from: "service-a", to: "service-b" },
      { from: "service-b", to: "database" },
    ],
  },
};

export const WithVulnerabilities: Story = {
  render: (args) => <InteractiveGraphView {...args} />,
  args: {
    nodes: [
      { name: "gateway", kind: "service", publicExposed: true },
      {
        name: "vuln-service",
        kind: "service",
        vulnerabilities: [
          { severity: "critical", message: "Remote code execution" },
        ],
      },
      {
        name: "another-vuln",
        kind: "service",
        vulnerabilities: [{ severity: "high", message: "XSS vulnerability" }],
      },
      { name: "safe-service", kind: "service" },
      { name: "database", kind: "rds" },
    ],
    edges: [
      { from: "gateway", to: "vuln-service" },
      { from: "gateway", to: "safe-service" },
      { from: "vuln-service", to: "another-vuln" },
      { from: "another-vuln", to: "database" },
      { from: "safe-service", to: "database" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Graph showing vulnerable nodes highlighted in red",
      },
    },
  },
};

export const AllNodeTypes: Story = {
  render: (args) => <InteractiveGraphView {...args} />,
  args: {
    nodes: [
      { name: "public-api", kind: "service", publicExposed: true },
      { name: "internal-api", kind: "service" },
      { name: "main-db", kind: "rds" },
      { name: "cache-db", kind: "rds" },
      { name: "job-queue", kind: "sqs" },
      { name: "event-queue", kind: "sqs" },
    ],
    edges: [
      { from: "public-api", to: "internal-api" },
      { from: "internal-api", to: "main-db" },
      { from: "internal-api", to: "cache-db" },
      { from: "internal-api", to: "job-queue" },
      { from: "job-queue", to: "event-queue" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Graph showing all node types: services (blue), RDS (purple), SQS (orange)",
      },
    },
  },
};

export const LargeGraph: Story = {
  render: (args) => <InteractiveGraphView {...args} />,
  args: {
    nodes: Array.from({ length: 15 }, (_, i) => ({
      name: `service-${i + 1}`,
      kind: (["service", "rds", "sqs"] as const)[i % 3],
      publicExposed: i === 0,
      vulnerabilities:
        i % 5 === 0 ? [{ severity: "high", message: "Issue" }] : undefined,
    })),
    edges: Array.from({ length: 20 }, (_, i) => ({
      from: `service-${(i % 15) + 1}`,
      to: `service-${((i + 3) % 15) + 1}`,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: "A larger graph to test performance and layout",
      },
    },
  },
};

export const Empty: Story = {
  render: (args) => <InteractiveGraphView {...args} />,
  args: {
    nodes: [],
    edges: [],
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no nodes are provided",
      },
    },
  },
};
