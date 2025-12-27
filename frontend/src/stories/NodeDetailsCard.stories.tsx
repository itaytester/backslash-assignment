import type { Meta, StoryObj } from "@storybook/react";
import { NodeDetailsCard } from "../components/NodeDetailsCard";
import type { BackendNode } from "../types/graph";

const meta: Meta<typeof NodeDetailsCard> = {
  title: "Components/NodeDetailsCard",
  component: NodeDetailsCard,
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
    node: {
      description: "The node to display details for, or null for empty state",
    },
    onClose: {
      action: "closed",
      description: "Callback when close button is clicked",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NodeDetailsCard>;

// Sample nodes for stories
const simpleServiceNode: BackendNode = {
  name: "api-gateway",
  kind: "service",
  language: "TypeScript",
  path: "/services/api-gateway",
};

const publicServiceNode: BackendNode = {
  name: "auth-service",
  kind: "service",
  language: "Go",
  path: "/services/auth",
  publicExposed: true,
};

const vulnerableNode: BackendNode = {
  name: "legacy-api",
  kind: "service",
  language: "Python",
  path: "/services/legacy",
  vulnerabilities: [
    { severity: "high", message: "SQL injection vulnerability in query parser" },
    { severity: "medium", message: "Outdated dependency with known CVE" },
  ],
};

const publicVulnerableNode: BackendNode = {
  name: "payment-service",
  kind: "service",
  language: "Java",
  path: "/services/payments/src/main/java/com/example/payments",
  publicExposed: true,
  vulnerabilities: [
    { severity: "critical", message: "Authentication bypass in payment flow" },
  ],
};

const rdsNode: BackendNode = {
  name: "users-db",
  kind: "rds",
};

const sqsNode: BackendNode = {
  name: "notifications-queue",
  kind: "sqs",
};

// Stories
export const Empty: Story = {
  args: {
    node: null,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no node is selected.",
      },
    },
  },
};

export const SimpleService: Story = {
  args: {
    node: simpleServiceNode,
  },
  parameters: {
    docs: {
      description: {
        story: "A basic service node with language and path information.",
      },
    },
  },
};

export const PublicService: Story = {
  args: {
    node: publicServiceNode,
  },
  parameters: {
    docs: {
      description: {
        story: "A service that is publicly exposed, shown with an info badge.",
      },
    },
  },
};

export const VulnerableService: Story = {
  args: {
    node: vulnerableNode,
  },
  parameters: {
    docs: {
      description: {
        story: "A service with security vulnerabilities displayed.",
      },
    },
  },
};

export const PublicAndVulnerable: Story = {
  args: {
    node: publicVulnerableNode,
  },
  parameters: {
    docs: {
      description: {
        story:
          "A publicly exposed service with vulnerabilities - the most critical state.",
      },
    },
  },
};

export const RDSNode: Story = {
  args: {
    node: rdsNode,
  },
  parameters: {
    docs: {
      description: {
        story: "An RDS database node with minimal information.",
      },
    },
  },
};

export const SQSNode: Story = {
  args: {
    node: sqsNode,
  },
  parameters: {
    docs: {
      description: {
        story: "An SQS queue node.",
      },
    },
  },
};

export const WithCloseButton: Story = {
  args: {
    node: simpleServiceNode,
    onClose: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: "When onClose is provided, a close button appears in the header.",
      },
    },
  },
};

export const LongPath: Story = {
  args: {
    node: {
      name: "deeply-nested-service",
      kind: "service",
      language: "Kotlin",
      path: "/very/long/nested/path/to/service/implementation/src/main/kotlin/com/company/project/module",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates path wrapping for long file paths.",
      },
    },
  },
};

export const ManyVulnerabilities: Story = {
  args: {
    node: {
      name: "insecure-service",
      kind: "service",
      vulnerabilities: [
        { severity: "critical", message: "Remote code execution vulnerability" },
        { severity: "high", message: "SQL injection in user input" },
        { severity: "high", message: "Cross-site scripting (XSS)" },
        { severity: "medium", message: "Insecure deserialization" },
        { severity: "low", message: "Information disclosure in error messages" },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "A node with multiple vulnerabilities of varying severity.",
      },
    },
  },
};

