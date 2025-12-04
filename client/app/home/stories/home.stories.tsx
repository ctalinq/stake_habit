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
import ellaAvatar from "~/home/stories/ellaAvatar.png";
import bellaAvatar from "~/home/stories/bellaAvatar.png";
import johnAvatar from "~/home/stories/johnAvatar.png";
import stellaAvatar from "~/home/stories/stellaAvatar.png";
import spikeAvatar from "~/home/stories/spikeAvatar.png";
import phillyAvatar from "~/home/stories/phillyAvatar.png";
import { NavbarHeader } from "~/layouts/navbarLayout";

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
        <NavbarHeader photoUrl={ownerAvatar} isFullscreen={false} />
        <Story />
        <div id="modal-root" />
      </div>
    ),
  ],
} satisfies Meta<typeof Home>;

export default meta;
type Story = StoryObj<typeof meta>;

const createVisitors = (contract: OpenedContract<CommitmentContract>) => {
  const avatars = [
    mikeAvatar,
    ellaAvatar,
    bellaAvatar,
    johnAvatar,
    stellaAvatar,
    spikeAvatar,
    phillyAvatar,
  ];
  const mock = {
    commitment_address: contract.address.toRawString(),
    tg_user_full_name: "Mike Ferguson",
    tg_user_id: 0,
  };

  return Array.from({ length: 100 }, (_, i) => ({
    ...mock,
    tg_user_photo_link: avatars[i % avatars.length],
    tg_user_id: i + 1,
  }));
};

export const CommitmentsPage: Story = {
  args: {},
  beforeEach: async () => {
    //@ts-expect-error just return not empty object
    mocked(useWallet).mockReturnValue({});

    const successContract_1 = await createSuccessCommitment({
      title: "Update My CV/Resume by Deadline 📄",
      description: "Todo",
    });
    const successContract_2 = await createSuccessCommitment({
      title: "Clean Room Completely 🧹",
      description: "Todo",
    });
    const failedContract = await createFailedCommitment({
      title: "Weekly Budget Plan 💰",
      description: "Todo",
    });
    const inProgressContract_1 = await createInProgressCommitment({
      title: "Gym or Pay Up",
      description: `
This is my commitment: by 27.11.2025 🗓️ I will sign up for a gym membership and finally take the first step toward a healthier, stronger version of myself 💪🔥

To make this goal real, I’ve put TON on the line 💸
If I don’t complete the challenge in time, the reward will be available for someone else to claim 🤑
No excuses, no backing out — accountability is real here

Watch my progress, cheer me on, and stay tuned
Either I achieve my goal and keep my stake…
or you walk away with the prize

Let’s see what wins: discipline and action
or hesitation and delay ⏳😏
`,
    });
    const inProgressContract_2 = await createInProgressCommitment({
      title: "Digital Detox Day 🌿📵",
      description: "Todo",
    });
    const inProgressContract_3 = await createInProgressCommitment({
      title: "Healthy Week: No Junk Food 🍏❌🍟",
      description: "Todo",
    });

    mocked(useCommitmentVisitors).mockReturnValue({
      visitorsMap: {
        [failedContract.address.toRawString()]: createVisitors(failedContract),
        [successContract_1.address.toRawString()]:
          createVisitors(successContract_1),
        [successContract_2.address.toRawString()]:
          createVisitors(successContract_2),
        [inProgressContract_1.address.toRawString()]:
          createVisitors(inProgressContract_1),
        [inProgressContract_2.address.toRawString()]:
          createVisitors(inProgressContract_2),
        [inProgressContract_3.address.toRawString()]:
          createVisitors(inProgressContract_3),
        [successContract_2.address.toRawString()]:
          createVisitors(successContract_2),
      },
    });

    mocked(useCommitmentContract).mockImplementation(
      (address: Address | null) => {
        if (address?.toRawString() === successContract_1.address.toRawString())
          return successContract_1;
        if (address?.toRawString() === successContract_2.address.toRawString())
          return successContract_2;
        if (address?.toRawString() === failedContract.address.toRawString())
          return failedContract;
        if (
          address?.toRawString() === inProgressContract_1.address.toRawString()
        )
          return inProgressContract_1;
        if (
          address?.toRawString() === inProgressContract_2.address.toRawString()
        )
          return inProgressContract_2;
        if (
          address?.toRawString() === inProgressContract_3.address.toRawString()
        )
          return inProgressContract_3;
        if (address?.toRawString() === successContract_2.address.toRawString())
          return successContract_2;
        return null;
      }
    );

    mocked(useCommitments).mockReturnValue({
      data: {
        pageParams: [],
        pages: [],
      },
      commitments: [
        {
          tg_user_id: "1",
          wallet_address: deployer.address.toRawString(),
          tg_user_photo_link: ownerAvatar,
          commitment_address: inProgressContract_1.address.toRawString(),
          is_active: true,
        },
        {
          tg_user_id: "1",
          wallet_address: deployer.address.toRawString(),
          tg_user_photo_link: ownerAvatar,
          commitment_address: inProgressContract_2.address.toRawString(),
          is_active: true,
        },
        {
          tg_user_id: "1",
          wallet_address: deployer.address.toRawString(),
          tg_user_photo_link: ownerAvatar,
          commitment_address: inProgressContract_3.address.toRawString(),
          is_active: true,
        },
        {
          tg_user_id: "1",
          wallet_address: deployer.address.toRawString(),
          tg_user_photo_link: ownerAvatar,
          commitment_address: successContract_1.address.toRawString(),
          is_active: true,
        },
        {
          tg_user_id: "1",
          wallet_address: deployer.address.toRawString(),
          tg_user_photo_link: ownerAvatar,
          commitment_address: successContract_2.address.toRawString(),
          is_active: true,
        },
        {
          tg_user_id: "1",
          wallet_address: deployer.address.toRawString(),
          tg_user_photo_link: ownerAvatar,
          commitment_address: failedContract.address.toRawString(),
          is_active: true,
        },
      ],
    });
  },
};
