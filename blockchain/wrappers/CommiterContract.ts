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

const EXECUTION_FEE: bigint = toNano("0.025");
const COMMITMENT_DEPLOYMENT_FEE: bigint = toNano("0.025");
const COMMITMENT_EXECUTION_FEE: bigint = toNano("0.005");
const INTEREST_FEE: bigint = toNano("0.33");

export type CommiterContractConfig = {
  commitment_code: Cell;
  owner_address: Address;
};

enum OP {
  COMMIT = 1,
}

export function commiterContractConfigToCell(
  config: CommiterContractConfig
): Cell {
  return beginCell()
    .storeAddress(config.owner_address)
    .storeRef(config.commitment_code)
    .endCell();
}

export class CommiterContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static async createFromConfig(
    config: CommiterContractConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = commiterContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new CommiterContract(address, init);
  }

  async sendCommitment(
    provider: ContractProvider,
    sender: Sender,
    title: string,
    description: string,
    dueDate: number,
    recipientsList: Cell,
    recipientsCount: number,
    stake: bigint
  ) {
    const value_to_send =
      stake +
      EXECUTION_FEE * BigInt(2) +
      COMMITMENT_DEPLOYMENT_FEE * BigInt(2) +
      INTEREST_FEE +
      COMMITMENT_EXECUTION_FEE * BigInt(recipientsCount);

    const msg_body = beginCell()
      .storeUint(OP.COMMIT, 32)
      .storeRef(beginCell().storeStringTail(title).endCell())
      .storeRef(beginCell().storeStringTail(description).endCell())
      .storeInt(dueDate, 32)
      .storeRef(recipientsList)
      .endCell();

    await provider.internal(sender, {
      value: value_to_send,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return stack.readNumber();
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }
}
