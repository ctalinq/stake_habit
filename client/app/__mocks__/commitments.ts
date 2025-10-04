import { Cell, toNano, type OpenedContract } from "@ton/core";
import { CommitmentContract } from "blockchain/commitmentContract";
import { hex as commitmentContractHex } from "blockchain/commitment";
import { blockchain, deployer } from "./blockchain";
import { generateRecipientsKeyList } from "blockchain/utils";

const createCommitment = async ({
  dueDate,
  status,
}: {
  dueDate: number;
  status?: number;
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
        title: "testsdfs",
        description: "test",
        dueDate: dueDateSeconds,
        recipientsList: recipientsKeyList,
        recipientsCount: keys.length,
      },
      commitmentCodeCell
    )
  );

  await commitmentContract.sendDeploy(deployer.getSender(), toNano("0.05"));
  //@ts-expect-error mock hook returs type dismatched
  return commitmentContract as OpenedContract<CommitmentContract>;
};

export const createFailedCommitment = async () => {
  return createCommitment({ dueDate: Date.now() });
};

export const createInProgressCommitment = async () => {
  return createCommitment({ dueDate: Date.now() + 1000 * 60 * 60 * 24 });
};

export const createSuccessCommitment = async () => {
  return createCommitment({ dueDate: Date.now() + 24, status: 1 });
};
