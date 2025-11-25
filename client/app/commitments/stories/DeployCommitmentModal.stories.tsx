import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import DeployCommitmentModal from "../DeployCommitmentModal";
import { MODAL_ROOT_ID } from "~/const";

const ModalWrapper = ({ isOpen }: { isOpen: boolean }) => {
  const [isModalOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(isOpen);
  }, []);

  return <DeployCommitmentModal isOpen={isModalOpen} />;
};

const meta = {
  title: "commitments/DeployCommitmentModal",
  component: ModalWrapper,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="p-3 h-screen">
        <div id={MODAL_ROOT_ID} />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ModalWrapper>;
type Story = StoryObj<typeof meta>;

export default meta;

export const Primary: Story = {
  args: {
    isOpen: true,
  },
};
