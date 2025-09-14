import { Blockchain } from "@ton/sandbox";

export const blockchain = await Blockchain.create();
export const deployer = await blockchain.treasury("deployerAddress");
