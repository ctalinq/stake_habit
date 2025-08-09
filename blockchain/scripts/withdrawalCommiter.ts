import { Address, toNano } from "@ton/core";
import { compile, NetworkProvider } from "@ton/blueprint";
import { CommiterContract } from "../wrappers/CommiterContract";
import "dotenv/config";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  openedContract.sendWithdrawal(provider.sender());
  await delay(30000);
}
