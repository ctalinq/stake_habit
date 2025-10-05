import type { Meta, StoryObj } from "@storybook/react-vite";
import CommitmentPage from "../commitment";
import { mocked } from "storybook/internal/test";
import {
  createFailedCommitment,
  createSuccessCommitment,
} from "~/__mocks__/commitments";
import { useCommitmentContract } from "~/hooks/useCommitmentContract";
import { useCommitmentUserData } from "~/hooks/useCommitmentUserData";
import useWallet from "~/hooks/useWallet";
import avatar from "./avatar.png";

const TEST_COMMITMENT_ADDRESS =
  "UQCI7d2SQ9ili8W41vpsIuaMyVmBMQcsBxEcM01UE5aL-j5l";

const meta = {
  title: "commitments/CommitmentPage",
  component: CommitmentPage,
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
} satisfies Meta<typeof CommitmentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadingCommitment: Story = {
  args: {
    params: {
      commitmentAddress: TEST_COMMITMENT_ADDRESS,
    },
  },
  beforeEach: async () => {
    mocked(useCommitmentContract).mockReturnValue(null);
  },
};

export const SuccessfulCommitment: Story = {
  args: {
    params: {
      commitmentAddress: TEST_COMMITMENT_ADDRESS,
    },
  },
  beforeEach: async () => {
    const contract = await createSuccessCommitment();
    mocked(useCommitmentContract).mockReturnValue(contract);
    mocked(useCommitmentUserData).mockReturnValue({
      data: {
        tg_user_photo_link: avatar,
      },
    });
  },
};

export const FailedCommitment: Story = {
  args: {
    params: {
      commitmentAddress: TEST_COMMITMENT_ADDRESS,
    },
  },
  beforeEach: async () => {
    const contract = await createFailedCommitment();
    mocked(useCommitmentContract).mockReturnValue(contract);
    //@ts-expect-error just return not empty object
    mocked(useWallet).mockReturnValue({});
    mocked(useCommitmentUserData).mockReturnValue({
      data: {
        tg_user_photo_link: avatar,
      },
    });
  },
};
