import type { Meta, StoryObj } from "@storybook/react-vite";
import CommitmentRow from "../commitmentRow";
import { useCommitmentContract } from "~/hooks/useCommitmentContract";
import { mocked } from "storybook/internal/test";
import {
  createFailedCommitment,
  createSuccessCommitment,
} from "~/__mocks__/commitments";

const TEST_COMMITMENT_ADDRESS =
  "UQCI7d2SQ9ili8W41vpsIuaMyVmBMQcsBxEcM01UE5aL-j5l";

const meta = {
  title: "home/CommitmentRow",
  component: CommitmentRow,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof CommitmentRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FailedCommitment: Story = {
  args: {
    commitmentAddress: TEST_COMMITMENT_ADDRESS,
    visitors: [],
  },
  beforeEach: async () => {
    const contract = await createFailedCommitment();
    mocked(useCommitmentContract).mockReturnValue(contract);
  },
};

export const SuccessCommitment: Story = {
  args: {
    commitmentAddress: TEST_COMMITMENT_ADDRESS,
    visitors: [],
  },
  beforeEach: async () => {
    const contract = await createSuccessCommitment();
    mocked(useCommitmentContract).mockReturnValue(contract);
  },
};
