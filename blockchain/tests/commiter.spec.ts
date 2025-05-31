import {Cell} from "@ton/core"
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox"

import "@ton/test-utils"
import { compile } from "@ton/blueprint"
import { CommiterContract } from "../wrappers/CommiterContract"
import {CommitmentContract} from "../wrappers/CommitmentContract";
import {
    emptyTitle, notEnoughStake,
    tooEarlyDueDate, tooLateDueDate,
    tooLongDescription,
    tooLongTitle, tooManyStake,
    validDescription,
    validDueDate, validMaximumDate, validMinimumDate, validStake,
    validTitle
} from "./mocks";

describe("commiter.fc contract tests", () => {
    let blockchain: Blockchain
    let commiterContract: SandboxContract<CommiterContract>
    let ownerWallet: SandboxContract<TreasuryContract>
    let stakerWallet: SandboxContract<TreasuryContract>
    let commiterCodeCell: Cell
    let commitmentCodeCell: Cell

    beforeAll(async () => {
        commiterCodeCell = await compile("CommiterContract")
        commitmentCodeCell = await compile("CommitmentContract")
    })


    beforeEach(async () => {
        blockchain = await Blockchain.create()
        ownerWallet = await blockchain.treasury("ownerAddress");
        stakerWallet = await blockchain.treasury("stakerAddress");

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

    it.each([validMinimumDate, validDueDate, validMaximumDate])(`should make commitment contract, due date: %i`, async (dueDate) => {
        const commitmentDescription = validDescription
        const commitmentTitle = validTitle
        const stake = validStake

        const sentMessageResult = await commiterContract.sendCommitment(
            stakerWallet.getSender(),
            commitmentTitle,
            commitmentDescription,
            dueDate,
            stake,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: stakerWallet.address,
            to: commiterContract.address,
            success: true,
            deploy: true
        })

        const commitmentContract = blockchain.openContract(
            await CommitmentContract.createFromConfig({
                stakerAddress: stakerWallet.address,
                title: commitmentTitle,
                description: commitmentDescription,
                dueDate
            }, commitmentCodeCell)
        )

        const savedCommitmentInfo = await commitmentContract.getInfo()
        const savedStake = await commitmentContract.getBalance()

        expect(savedCommitmentInfo.stakerAddress.toString()).toEqual(stakerWallet.address.toString())
        expect(savedCommitmentInfo.title).toEqual(commitmentTitle)
        expect(savedCommitmentInfo.description).toEqual(commitmentDescription)
        expect(savedCommitmentInfo.dueDate).toEqual(dueDate)
        expect(savedStake).toBeGreaterThan(stake)
    });

    it("should not make commitment contract without title", async () => {
        const sentMessageResult = await commiterContract.sendCommitment(
            stakerWallet.getSender(),
            emptyTitle,
            validDescription,
            validDueDate,
            validStake,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: stakerWallet.address,
            to: commiterContract.address,
            success: false,
            //todo add exit code description
            exitCode: 75,
        })
    })

    it("should not make commitment contract with too long title", async () => {
        const sentMessageResult = await commiterContract.sendCommitment(
            stakerWallet.getSender(),
            tooLongTitle,
            validDescription,
            validDueDate,
            validStake,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: stakerWallet.address,
            to: commiterContract.address,
            success: false,
            //todo add exit code description
            exitCode: 75,
        })
    })

    it("should not make commitment contract with too long description", async () => {
        const sentMessageResult = await commiterContract.sendCommitment(
            stakerWallet.getSender(),
            validTitle,
            tooLongDescription,
            validDueDate,
            validStake,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: stakerWallet.address,
            to: commiterContract.address,
            success: false,
            //todo add exit code description
            exitCode: 75,
        })
    });

    it("should not make commitment contract with too early due date", async () => {
        const sentMessageResult = await commiterContract.sendCommitment(
            stakerWallet.getSender(),
            validTitle,
            validDescription,
            tooEarlyDueDate,
            validStake,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: stakerWallet.address,
            to: commiterContract.address,
            success: false,
            //todo add exit code description
            exitCode: 75,
        })
    });

    it("should not make commitment contract with too late due date", async () => {
        const sentMessageResult = await commiterContract.sendCommitment(
            stakerWallet.getSender(),
            validTitle,
            validDescription,
            tooLateDueDate,
            validStake,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: stakerWallet.address,
            to: commiterContract.address,
            success: false,
            //todo add exit code description
            exitCode: 75,
        })
    });

    it("should not make commitment contract with stake value bellow minimum", async () => {
        const sentMessageResult = await commiterContract.sendCommitment(
            stakerWallet.getSender(),
            validTitle,
            validDescription,
            tooLateDueDate,
            notEnoughStake,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: stakerWallet.address,
            to: commiterContract.address,
            success: false,
            //todo add exit code description
            exitCode: 74,
        })
    });

    it("should not make commitment contract with stake value greater than maximum", async () => {
        const sentMessageResult = await commiterContract.sendCommitment(
            stakerWallet.getSender(),
            validTitle,
            validDescription,
            tooLateDueDate,
            tooManyStake,
        )

        expect(sentMessageResult.transactions).toHaveTransaction({
            from: stakerWallet.address,
            to: commiterContract.address,
            success: false,
            //todo add exit code description
            exitCode: 74,
        })
    });
})