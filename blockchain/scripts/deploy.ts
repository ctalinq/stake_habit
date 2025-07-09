import { Address, toNano } from "@ton/core";
import { compile, NetworkProvider } from "@ton/blueprint";
import { CommiterContract } from "../wrappers/CommiterContract";
import "dotenv/config";

export async function run(provider: NetworkProvider) {
  const commiterCodeCell = await compile("CommiterContract");
  const commitmentCodeCell = await compile("CommitmentContract");

  const commiterContract = await CommiterContract.createFromConfig(
    {
      owner_address: Address.parse(process.env.OWNER_ADDRESS as string),
      commitment_code: commitmentCodeCell,
    },
    commiterCodeCell
  );

  const openedContract = provider.open(commiterContract);
  openedContract.sendDeploy(provider.sender(), toNano("0.05"));
  await provider.waitForDeploy(commiterContract.address);
}
