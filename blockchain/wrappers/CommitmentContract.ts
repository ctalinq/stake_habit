import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider, Sender, SendMode, toNano,
} from "@ton/core"

export type CommiterContractConfig = {
    description: string
}

export function commitmentContractConfigToCell(config: CommiterContractConfig): Cell {
    return beginCell()
        .storeRef(beginCell().storeStringTail(config.description).endCell())
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

    async sendTest(
        provider: ContractProvider,
        sender: Sender,
    ) {
        const msg_body = beginCell()
            .storeUint(1, 32)
            .endCell();

        await provider.internal(sender, {
            value: toNano("1"),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg_body,
        });
    }

    async getDescription(provider: ContractProvider) {
        const {stack} = await provider.get('get_description', [])
        return stack.readString()
    }
}