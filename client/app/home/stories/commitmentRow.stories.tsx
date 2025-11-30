import type { Meta, StoryObj } from "@storybook/react-vite";
import CommitmentRow from "../commitmentRow";
import { useCommitmentContract } from "~/hooks/useCommitmentContract";
import { mocked } from "storybook/internal/test";
import {
  createFailedCommitment,
  createInProgressCommitment,
  createSuccessCommitment,
} from "~/__mocks__/commitments";

const TEST_COMMITMENT_ADDRESS =
  "UQCI7d2SQ9ili8W41vpsIuaMyVmBMQcsBxEcM01UE5aL-j5l";

const meta = {
  title: "home/CommitmentRow",
  component: CommitmentRow,
  tags: ["autodocs"],
  argTypes: {},
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommitmentRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FailedCommitment: Story = {
  args: {
    commitmentAddress: TEST_COMMITMENT_ADDRESS,
    visitors: [],
  },
  beforeEach: async () => {
    const contract = await createFailedCommitment({
      title: "Todo",
      description: "Todo",
    });
    mocked(useCommitmentContract).mockReturnValue(contract);
  },
};

export const InProgressCommitment: Story = {
  args: {
    commitmentAddress: TEST_COMMITMENT_ADDRESS,
    visitors: [],
  },
  beforeEach: async () => {
    const contract = await createInProgressCommitment({
      title: "Todo",
      description: "Todo",
    });
    mocked(useCommitmentContract).mockReturnValue(contract);
  },
};

export const SuccessfulCommitment: Story = {
  args: {
    commitmentAddress: TEST_COMMITMENT_ADDRESS,
    visitors: [],
  },
  beforeEach: async () => {
    const contract = await createSuccessCommitment({
      title: "Todo",
      description: "Todo",
    });
    mocked(useCommitmentContract).mockReturnValue(contract);
  },
};
