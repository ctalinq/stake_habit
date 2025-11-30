import { Cell, toNano, type OpenedContract } from "@ton/core";
import { CommitmentContract } from "blockchain/commitmentContract";
import { hex as commitmentContractHex } from "blockchain/commitment";
import { blockchain, deployer } from "./blockchain";
import { generateRecipientsKeyList } from "blockchain/utils";

const createCommitment = async ({
  title,
  description,
  dueDate,
  status,
}: {
  title: string;
  description: string;
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
        title,
        description,
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

export const createFailedCommitment = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return createCommitment({
    dueDate: Date.now(),
    title,
    description,
  });
};

export const createInProgressCommitment = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return createCommitment({
    title,
    description,
    dueDate: Date.now() + 1000 * 60 * 60 * 24,
  });
};

export const createSuccessCommitment = async ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return createCommitment({
    dueDate: Date.now() + 24,
    status: 1,
    title,
    description,
  });
};
