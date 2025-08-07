import { Address, toNano } from "@ton/core";
import { compile, NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { CommitmentContract } from "../wrappers/CommitmentContract";
import { generateRecipientsKeyList } from "../wrappers/utils";

//just fixture for testing commitment different states
export async function run(provider: NetworkProvider) {
  const commitmentCodeCell = await compile("CommitmentContract");

  const dueDate = 1754057427;
  const keys = ["1", "2", "3"];

  const commitmentContract = await CommitmentContract.createFromConfig(
    {
      stakerAddress: Address.parse(process.env.OWNER_ADDRESS as string),
      title: "Fixture",
      description: "Fixture description for testing",
      dueDate: dueDate,
      recipientsList: generateRecipientsKeyList(keys),
      recipientsCount: keys.length,
    },
    commitmentCodeCell
  );

  const openedContract = provider.open(commitmentContract);
  openedContract.sendDeploy(provider.sender(), toNano("1"));
  await provider.waitForDeploy(commitmentContract.address);

  console.log("Commitment contract deployed successfully, tma link:");
  console.log(
    `${process.env.COMMITMENT_LINK_PREFIX}${Buffer.from(
      `commitment=${commitmentContract.address.toString()};key=${keys[0]}`
    ).toString("base64")}`
  );
}
