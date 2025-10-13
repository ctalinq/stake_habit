import type { Meta, StoryObj } from "@storybook/react-vite";
import { mocked } from "storybook/internal/test";
import useWallet from "~/hooks/useWallet";
import useCommitments from "~/hooks/useCommitments";
import useCommitmentVisitors from "~/hooks/useCommitmentVisitors";
import { useCommitmentContract } from "~/hooks/useCommitmentContract";
import {
  createFailedCommitment,
  createInProgressCommitment,
  createSuccessCommitment,
} from "~/__mocks__/commitments";
import Home from "../home";
import { deployer } from "~/__mocks__/blockchain";
import type { Address, OpenedContract } from "@ton/core";
import type { CommitmentContract } from "blockchain/commitmentContract";
import ownerAvatar from "~/home/stories/ownerAvatar.png";
import mikeAvatar from "~/home/stories/mikeAvatar.png";

const meta = {
  title: "home/Home",
  component: Home,
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
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

const createCommitments = ({
  failedContract,
  inProgressContract,
  successContract,
}: {
  failedContract: OpenedContract<CommitmentContract>;
  inProgressContract: OpenedContract<CommitmentContract>;
  successContract: OpenedContract<CommitmentContract>;
}) => [
  {
    tg_user_id: "1",
    wallet_address: deployer.address.toRawString(),
    tg_user_photo_link: ownerAvatar,
    commitment_address: failedContract.address.toRawString(),
    is_active: true,
  },
  {
    tg_user_id: "1",
    wallet_address: deployer.address.toRawString(),
    tg_user_photo_link: ownerAvatar,
    commitment_address: inProgressContract.address.toRawString(),
    is_active: true,
  },
  {
    tg_user_id: "1",
    wallet_address: deployer.address.toRawString(),
    tg_user_photo_link: ownerAvatar,
    commitment_address: successContract.address.toRawString(),
    is_active: true,
  },
];

const createVisitors = (contract: OpenedContract<CommitmentContract>) => {
  const mock = {
    commitment_address: contract.address.toRawString(),
    tg_user_full_name: "Mike Ferguson",
    tg_user_id: 0,
    tg_user_photo_link: mikeAvatar,
  };

  return Array.from({ length: 100 }, (_, i) => ({
    ...mock,
    tg_user_id: i + 1,
  }));
};

export const CommitmentsPage: Story = {
  args: {},
  beforeEach: async () => {
    //@ts-expect-error just return not empty object
    mocked(useWallet).mockReturnValue({});

    const successContract = await createSuccessCommitment();
    const failedContract = await createFailedCommitment();
    const inProgressContract = await createInProgressCommitment();

    mocked(useCommitmentVisitors).mockReturnValue({
      visitorsMap: {
        [failedContract.address.toRawString()]: createVisitors(failedContract),
        [successContract.address.toRawString()]:
          createVisitors(successContract),
        [inProgressContract.address.toRawString()]:
          createVisitors(inProgressContract),
      },
    });

    mocked(useCommitmentContract).mockImplementation(
      (address: Address | null) => {
        if (address?.toRawString() === successContract.address.toRawString())
          return successContract;
        if (address?.toRawString() === failedContract.address.toRawString())
          return failedContract;
        if (address?.toRawString() === inProgressContract.address.toRawString())
          return inProgressContract;
        return null;
      }
    );

    mocked(useCommitments).mockReturnValue({
      data: {
        pageParams: [],
        pages: [],
      },
      commitments: createCommitments({
        failedContract,
        inProgressContract,
        successContract,
      }),
    });
  },
};
