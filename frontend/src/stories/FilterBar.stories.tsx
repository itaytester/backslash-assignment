import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FilterBar } from '../components/FilterBar'

const meta: Meta<typeof FilterBar> = {
  title: 'Components/FilterBar',
  component: FilterBar,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#212121' },
      ],
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selectedFilters: {
      control: 'check',
      options: ['startPublic', 'endSink', 'hasVulnerability'],
      description: 'Array of selected filter IDs',
    },
    onChange: {
      action: 'filters changed',
      description: 'Callback when filters change',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FilterBar>

// Interactive wrapper
const InteractiveFilterBar = (args: React.ComponentProps<typeof FilterBar>) => {
  const [filters, setFilters] = useState<string[]>(args.selectedFilters || [])

  return (
    <FilterBar
      {...args}
      selectedFilters={filters}
      onChange={(newFilters) => {
        setFilters(newFilters)
        args.onChange?.(newFilters)
      }}
    />
  )
}

export const Default: Story = {
  render: (args) => <InteractiveFilterBar {...args} />,
  args: {
    selectedFilters: [],
  },
}

export const OneSelected: Story = {
  render: (args) => <InteractiveFilterBar {...args} />,
  args: {
    selectedFilters: ['startPublic'],
  },
}

export const MultipleSelected: Story = {
  render: (args) => <InteractiveFilterBar {...args} />,
  args: {
    selectedFilters: ['startPublic', 'endSink'],
  },
}

export const AllSelected: Story = {
  render: (args) => <InteractiveFilterBar {...args} />,
  args: {
    selectedFilters: ['startPublic', 'endSink', 'hasVulnerability'],
  },
}

export const VulnerabilityHighlight: Story = {
  render: (args) => <InteractiveFilterBar {...args} />,
  args: {
    selectedFilters: ['hasVulnerability'],
  },
  parameters: {
    docs: {
      description: {
        story: 'The vulnerability filter uses error/red styling to emphasize security concerns.',
      },
    },
  },
}

export const Compact: Story = {
  render: (args) => <InteractiveFilterBar {...args} />,
  args: {
    selectedFilters: [],
    className: 'max-w-xs',
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
}

export const Wide: Story = {
  render: (args) => <InteractiveFilterBar {...args} />,
  args: {
    selectedFilters: ['startPublic'],
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
}

