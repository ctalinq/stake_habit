import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import Button from "~/components/Button";

const meta = {
  title: "components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Button",
  },
};
