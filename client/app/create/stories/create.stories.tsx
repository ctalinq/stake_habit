import type { Meta, StoryObj } from "@storybook/react-vite";
import ownerAvatar from "~/home/stories/ownerAvatar.png";
import { NavbarHeader } from "~/layouts/navbarLayout";
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
        <NavbarHeader photoUrl={ownerAvatar} isFullscreen={false} />
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
