import type { Meta, StoryObj } from "@storybook/react-vite";
import Create from "../create";

const meta = {
  title: "create/Create",
  component: Create,
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
} satisfies Meta<typeof Create>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreatePage: Story = {
  args: {},
};
