import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
} from "@ton/core"

export type CommiterContractConfig = {
    stakerAddress: Address
    recipientsList: Cell
    recipientsCount: number
    title: string
    description: string
    dueDate: number
}

export function commitmentContractConfigToCell(config: CommiterContractConfig): Cell {
    return beginCell()
        .storeUint(0, 2)
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
        readonly init?: { code: Cell, data: Cell }
    ) {
    }

    static async createFromConfig(
        config: CommiterContractConfig,
        code: Cell,
        workchain = 0
    ) {
        const data = commitmentContractConfigToCell(config)
        const init = {code, data}
        const address = contractAddress(workchain, init)

        return new CommitmentContract(address, init)
    }

    async getInfo(provider: ContractProvider) {
        const {stack} = await provider.get('get_info', [])
        return {
            stakerAddress: stack.readAddress(),
            title: stack.readString(),
            description: stack.readString(),
            dueDate: stack.readNumber()
        }
    }

    async getBalance(provider: ContractProvider) {
        const {stack} = await provider.get("balance", [])
        return stack.readBigNumber()
    }
}