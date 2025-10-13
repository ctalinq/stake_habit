import type { Meta, StoryObj } from "@storybook/react-vite";
import CommitmentStatusBadge from "../CommitmentStatusBadge";

const meta = {
  title: "containers/CommitmentStatusBadge",
  component: CommitmentStatusBadge,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="p-3 h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommitmentStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    status: "success",
  },
};

export const Failed: Story = {
  args: {
    status: "failed",
  },
};

export const InProcess: Story = {
  args: {
    status: "inProcess",
  },
};
