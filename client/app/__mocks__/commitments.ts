import { Cell, toNano, type OpenedContract } from "@ton/core";
import { CommitmentContract } from "blockchain/commitmentContract";
import { hex as commitmentContractHex } from "blockchain/commitment";
import { blockchain, deployer } from "./blockchain";
import { generateRecipientsKeyList } from "blockchain/utils";

const createCommitment = async ({
  dueDate,
  status,
  description,
}: {
  dueDate: number;
  status?: number;
  description?: string;
}) => {
  const stakerWallet = await blockchain.treasury("stakerAddress");

  const commitmentCodeCell = Cell.fromBoc(
    Buffer.from(commitmentContractHex, "hex")
  )[0];

  const keys = ["1", "2"];
  const recipientsKeyList = generateRecipientsKeyList(keys);
  const dueDateSeconds = Math.floor(dueDate / 1000);

  const commitmentContract = blockchain.openContract(
    await CommitmentContract.createFromConfig(
      {
        status,
        stakerAddress: stakerWallet.address,
        title: "Commitment With Very Long Title",
        description: description || "test",
        dueDate: dueDateSeconds,
        recipientsList: recipientsKeyList,
        recipientsCount: keys.length,
      },
      commitmentCodeCell
    )
  );

  const initialBalance = toNano("50");
  await commitmentContract.sendDeploy(deployer.getSender(), initialBalance);
  //@ts-expect-error mock hook returs type dismatched
  return commitmentContract as OpenedContract<CommitmentContract>;
};

export const createFailedCommitment = async () => {
  return createCommitment({
    dueDate: Date.now(),
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida maximus elit in mattis. Donec sed lectus gravida, feugiat lorem et, tincidunt sem. Integer nec semper sem, at pretium dolor. Morbi eget faucibus dui, quis tempor felis. Cras venenatis malesuada dolor, at blandit ex maximus ut. Mauris egestas pulvinar sodales. Donec in nunc eu ligula sagittis molestie sed nec mi. Pellentesque consectetur tellus tincidunt molestie rhoncus. Nulla venenatis sollicitudin nulla non molestie. Curabitur bibendum nulla venenatis ex viverra sagittis. Aenean lorem ante, tempus at tellus eget, commodo aliquet urna. Donec non dolor diam. Nulla maximus eget nunc eget dapibus. Vestibulum dictum ac nibh mattis vestibulum. Maecenas tincidunt interdum quam.

      Curabitur ultricies consectetur magna, a ornare enim cursus eget. Aliquam maximus mauris ligula, a placerat elit porta sed. Donec varius magna id libero semper, sed condimentum sem pretium. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam sed magna nulla. Nam malesuada vestibulum sem et mollis. Etiam id porttitor ex, at tempus urna. Vivamus et libero a nibh vehicula tempor id nec sapien. Donec aliquam, tortor at tempus hendrerit, enim leo lacinia nibh, a egestas eros enim ut velit. Ut bibendum neque magna, at consectetur nibh tincidunt et. Sed ac finibus massa. Ut pellentesque id enim et facilisis. Nam eget nulla maximus, tempor nulla et, sodales neque.
  `,
  });
};

export const createInProgressCommitment = async () => {
  return createCommitment({ dueDate: Date.now() + 1000 * 60 * 60 * 24 });
};

export const createSuccessCommitment = async () => {
  return createCommitment({
    dueDate: Date.now() + 24,
    status: 1,
  });
};
