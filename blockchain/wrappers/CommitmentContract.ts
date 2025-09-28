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
import { parseRecipientKeyList } from "./utils";

export type CommitmentContractConfig = {
  stakerAddress: Address;
  recipientsList: Cell;
  recipientsCount: number;
  title: string;
  description: string;
  dueDate: number;
  status?: number;
};

export function commitmentContractConfigToCell(
  config: CommitmentContractConfig
): Cell {
  return beginCell()
    .storeUint(config.status ?? 0, 2)
    .storeAddress(config.stakerAddress)
    .storeRef(beginCell().storeStringTail(config.title).endCell())
    .storeRef(beginCell().storeStringTail(config.description).endCell())
    .storeUint(config.dueDate, 32)
    .storeRef(config.recipientsList)
    .storeUint(config.recipientsCount, 32)
    .storeRef(beginCell().endCell())
    .endCell();
}

export class CommitmentContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static async createFromConfig(
    config: CommitmentContractConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = commitmentContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new CommitmentContract(address, init);
  }

  async getInfo(provider: ContractProvider) {
    const { stack } = await provider.get("get_info", []);
    return {
      status: stack.readNumber(),
      stakerAddress: stack.readAddress(),
      title: stack.readString(),
      description: stack.readString(),
      dueDate: stack.readNumber(),
      awardedKeyList: parseRecipientKeyList(stack.readCell()),
    };
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", []);
    return stack.readBigNumber();
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendRecipientWithdrawal(
    provider: ContractProvider,
    via: Sender,
    key: string
  ) {
    return await provider.internal(via, {
      value: toNano("0.05"),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(0x1, 32)
        .storeRef(beginCell().storeStringTail(key).endCell())
        .endCell(),
    });
  }

  async sendStakerWithdrawal(provider: ContractProvider, via: Sender) {
    return await provider.internal(via, {
      value: toNano("0.05"),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(0x2, 32).endCell(),
    });
  }

  async sendStakerFail(provider: ContractProvider, via: Sender) {
    return await provider.internal(via, {
      value: toNano("0.05"),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(0x3, 32).endCell(),
    });
  }
}
