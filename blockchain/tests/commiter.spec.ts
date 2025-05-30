import {Cell} from "@ton/core"
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox"

import "@ton/test-utils"
import { compile } from "@ton/blueprint"
import { CommiterContract } from "../wrappers/CommiterContract"
import {CommitmentContract} from "../wrappers/CommitmentContract";
import {tooLongDescription, validDescription} from "./mocks";

describe("commiter.fc contract tests", () => {
    let blockchain: Blockchain
    let commiterContract: SandboxContract<CommiterContract>
    let ownerWallet: SandboxContract<TreasuryContract>
    let commiterCodeCell: Cell
    let commitmentCodeCell: Cell

    beforeAll(async () => {
        commiterCodeCell = await compile("CommiterContract")
        commitmentCodeCell = await compile("CommitmentContract")
    })


    beforeEach(async () => {
        blockchain = await Blockchain.create()
        ownerWallet = await blockchain.treasury("ownerAddress");

        commiterContract = blockchain.openContract(
            await CommiterContract.createFromConfig({
                owner_address: ownerWallet.address,
                commitment_code: commitmentCodeCell,
            }, commiterCodeCell)
        )

        await blockchain.setVerbosityForAddress(commiterContract.address, {
            print: true,
            vmLogs: 'none',
        })
    })

    it("should make commitment contract", async () => {
        const commitmentDescription = validDescription

        const sentMessageResult = await commiterContract.sendCommitment(
            ownerWallet.getSender(),
            commitmentDescription,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: ownerWallet.address,
            to: commiterContract.address,
            success: true,
            deploy: true
        })

        const commitmentContract = blockchain.openContract(
            await CommitmentContract.createFromConfig({
                description: commitmentDescription
            }, commitmentCodeCell)
        )

        const savedCommitmentDescription = await commitmentContract.getDescription()
        expect(savedCommitmentDescription).toEqual(commitmentDescription)
    });

    it("should not make commitment contract with too long description", async () => {
        const sentMessageResult = await commiterContract.sendCommitment(
            ownerWallet.getSender(),
            tooLongDescription,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: ownerWallet.address,
            to: commiterContract.address,
            success: false,
            //todo add exit code description
            exitCode: 75,
        })
    });
})