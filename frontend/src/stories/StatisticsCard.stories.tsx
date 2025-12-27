import type { Meta, StoryObj } from "@storybook/react";
import { StatisticsCard } from "../components/StatisticsCard";

const meta: Meta<typeof StatisticsCard> = {
  title: "Components/StatisticsCard",
  component: StatisticsCard,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#f5f5f5" },
        { name: "dark", value: "#212121" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    nodeCount: {
      control: { type: "number", min: 0 },
      description: "Number of nodes in the graph",
    },
    edgeCount: {
      control: { type: "number", min: 0 },
      description: "Number of edges in the graph",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StatisticsCard>;

export const Default: Story = {
  args: {
    nodeCount: 12,
    edgeCount: 18,
  },
};

export const Empty: Story = {
  args: {
    nodeCount: 0,
    edgeCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty graph with no nodes or edges.",
      },
    },
  },
};

export const SmallGraph: Story = {
  args: {
    nodeCount: 3,
    edgeCount: 2,
  },
  parameters: {
    docs: {
      description: {
        story: "A small graph with just a few nodes.",
      },
    },
  },
};

export const LargeGraph: Story = {
  args: {
    nodeCount: 156,
    edgeCount: 423,
  },
  parameters: {
    docs: {
      description: {
        story: "A larger graph with triple-digit counts.",
      },
    },
  },
};

export const VeryLargeGraph: Story = {
  args: {
    nodeCount: 1247,
    edgeCount: 5892,
  },
  parameters: {
    docs: {
      description: {
        story: "Tests display with four-digit numbers.",
      },
    },
  },
};

export const MoreEdgesThanNodes: Story = {
  args: {
    nodeCount: 10,
    edgeCount: 45,
  },
  parameters: {
    docs: {
      description: {
        story: "A densely connected graph where edges greatly outnumber nodes.",
      },
    },
  },
};

export const TreeStructure: Story = {
  args: {
    nodeCount: 15,
    edgeCount: 14,
  },
  parameters: {
    docs: {
      description: {
        story: "A tree structure where edges = nodes - 1.",
      },
    },
  },
};

