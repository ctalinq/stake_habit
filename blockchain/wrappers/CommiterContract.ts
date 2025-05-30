import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  toNano,
} from "@ton/core";

export type CommiterContractConfig = {
  commitment_code: Cell;
  owner_address: Address;
};

enum OP {
  COMMIT = 1,
}

export function commiterContractConfigToCell(
  config: CommiterContractConfig,
): Cell {
  return beginCell()
    .storeAddress(config.owner_address)
    .storeRef(config.commitment_code)
    .endCell();
}

export class CommiterContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static async createFromConfig(
    config: CommiterContractConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = commiterContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new CommiterContract(address, init);
  }

  async sendCommitment(
    provider: ContractProvider,
    sender: Sender,
    description: string,
  ) {

    const msg_body = beginCell()
      .storeUint(OP.COMMIT, 32)
      .storeCoins(toNano("0.5"))
      .storeRef(beginCell().storeStringTail(description).endCell())
      .endCell();

    await provider.internal(sender, {
      value: toNano("1"),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async getAddress(provider: ContractProvider) {
    const { stack } = await provider.get("get_address", []);
    return stack.readAddress();
  }

  async getBalance(provider: ContractProvider) {
    const {stack} = await provider.get("balance", [])
    return stack.readNumber()
  }
}
