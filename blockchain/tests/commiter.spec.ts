import { beginCell, Cell, toNano } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import {
  assert,
  expect,
  test,
  beforeAll,
  describe,
  beforeEach,
  it,
} from "vitest";

import { compile } from "@ton/blueprint";
import { CommiterContract } from "../wrappers/CommiterContract";
import { CommitmentContract } from "../wrappers/CommitmentContract";
import {
  generateRecipientsKeyList,
  generateRecipientsKeys,
} from "../wrappers/utils";
import {
  emptyTitle,
  notEnoughStake,
  recipientIds,
  tooEarlyDueDate,
  tooLateDueDate,
  tooLongDescription,
  tooLongTitle,
  tooManyStake,
  validDescription,
  validDueDate,
  validMaximumDate,
  validMinimumDate,
  validStake,
  validTitle,
} from "./mocks";
import {
  compareTransaction,
  flattenTransaction,
  prettifyTransaction,
} from "@ton/test-utils";
import { inspect } from "node-inspect-extracted";

//mark - this is minified implementation `toHaveTransaction` of @ton/test-utils for vitest
//todo - move to global setup
//todo - add more fullfil info about comparisions
expect.extend({
  toHaveTransaction(received, expect) {
    if (Array.isArray(received)) {
      const pass = received.some((tx) =>
        compareTransaction(flattenTransaction(tx), expect)
      );
      const message = received.map((tx) => inspect(prettifyTransaction(tx)));

      return {
        pass,
        message: () => `${pass ? "success" : "fail"}  ${message}`,
      };
    } else {
      const pass = compareTransaction(flattenTransaction(received), expect);
      const message = inspect(prettifyTransaction(received));

      return {
        pass,
        message: () => `${pass ? "success" : "fail"} ${message}`,
      };
    }
  },
});

//todo move commitment related tests to separate tests
describe("commiter.fc contract tests", () => {
  let blockchain: Blockchain;
  let commiterContract: SandboxContract<CommiterContract>;
  let ownerWallet: SandboxContract<TreasuryContract>;
  let stakerWallet: SandboxContract<TreasuryContract>;
  let recipientsKeys: string[];
  let recipientsKeyList: Cell;
  let commiterCodeCell: Cell;
  let commitmentCodeCell: Cell;

  beforeAll(async () => {
    commiterCodeCell = await compile("CommiterContract");
    commitmentCodeCell = await compile("CommitmentContract");
    recipientsKeys = await generateRecipientsKeys(recipientIds);
    recipientsKeyList = generateRecipientsKeyList(recipientsKeys);
  });

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    ownerWallet = await blockchain.treasury("ownerAddress");
    stakerWallet = await blockchain.treasury("stakerAddress");

    commiterContract = blockchain.openContract(
      await CommiterContract.createFromConfig(
        {
          owner_address: ownerWallet.address,
          commitment_code: commitmentCodeCell,
        },
        commiterCodeCell
      )
    );

    await blockchain.setVerbosityForAddress(commiterContract.address, {
      print: true,
      vmLogs: "none",
    });
  });

  it.each([validMinimumDate, validDueDate, validMaximumDate])(
    `should make commitment contract, due date: %i`,
    async (dueDate) => {
      const commitmentDescription = validDescription;
      const commitmentTitle = validTitle;
      const stake = validStake;

      const sentMessageResult = await commiterContract.sendCommitment(
        stakerWallet.getSender(),
        commitmentTitle,
        commitmentDescription,
        dueDate,
        recipientsKeyList,
        recipientsKeys.length,
        stake
      );

      expect(sentMessageResult.transactions).toHaveTransaction({
        from: stakerWallet.address,
        to: commiterContract.address,
        success: true,
        deploy: true,
      });

      const commitmentContract = blockchain.openContract(
        await CommitmentContract.createFromConfig(
          {
            stakerAddress: stakerWallet.address,
            title: commitmentTitle,
            description: commitmentDescription,
            dueDate,
            recipientsList: recipientsKeyList,
            recipientsCount: recipientsKeys.length,
          },
          commitmentCodeCell
        )
      );

      await blockchain.setVerbosityForAddress(commitmentContract.address, {
        print: true,
        vmLogs: "none",
      });

      const savedCommitmentInfo = await commitmentContract.getInfo();
      const savedStake = await commitmentContract.getBalance();

      expect(savedCommitmentInfo.stakerAddress.toString()).toEqual(
        stakerWallet.address.toString()
      );
      expect(savedCommitmentInfo.title).toEqual(commitmentTitle);
      expect(savedCommitmentInfo.description).toEqual(commitmentDescription);
      expect(savedCommitmentInfo.dueDate).toEqual(dueDate);
      expect(savedStake).toBeGreaterThan(stake);
    }
  );

  it("should not make commitment contract without title", async () => {
    const sentMessageResult = await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      emptyTitle,
      validDescription,
      validDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      validStake
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: stakerWallet.address,
      to: commiterContract.address,
      success: false,
      //todo add exit code description
      exitCode: 75,
    });
  });

  it("should not make commitment contract with too long title", async () => {
    const sentMessageResult = await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      tooLongTitle,
      validDescription,
      validDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      validStake
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: stakerWallet.address,
      to: commiterContract.address,
      success: false,
      //todo add exit code description
      exitCode: 75,
    });
  });

  it("should not make commitment contract with too long description", async () => {
    const sentMessageResult = await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      validTitle,
      tooLongDescription,
      validDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      validStake
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: stakerWallet.address,
      to: commiterContract.address,
      success: false,
      //todo add exit code description
      exitCode: 75,
    });
  });

  it("should not make commitment contract with too early due date", async () => {
    const sentMessageResult = await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      validTitle,
      validDescription,
      tooEarlyDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      validStake
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: stakerWallet.address,
      to: commiterContract.address,
      success: false,
      //todo add exit code description
      exitCode: 75,
    });
  });

  it("should not make commitment contract with too late due date", async () => {
    const sentMessageResult = await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      validTitle,
      validDescription,
      tooLateDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      validStake
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: stakerWallet.address,
      to: commiterContract.address,
      success: false,
      //todo add exit code description
      exitCode: 75,
    });
  });

  it("should not make commitment contract with stake value bellow minimum", async () => {
    const sentMessageResult = await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      validTitle,
      validDescription,
      tooLateDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      notEnoughStake
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: stakerWallet.address,
      to: commiterContract.address,
      success: false,
      //todo add exit code description
      exitCode: 74,
    });
  });

  it("should not make commitment contract with stake value greater than maximum", async () => {
    const sentMessageResult = await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      validTitle,
      validDescription,
      tooLateDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      tooManyStake
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: stakerWallet.address,
      to: commiterContract.address,
      success: false,
      //todo add exit code description
      exitCode: 74,
    });
  });

  it("should not make commitment contract with recipients count greater than maximum", async () => {
    const invalidRecipientsCountKeys = [...recipientsKeys, "x"];
    const invalidRecipientsCountKeyList = generateRecipientsKeyList(
      invalidRecipientsCountKeys
    );

    const sentMessageResult = await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      validTitle,
      validDescription,
      tooLateDueDate,
      invalidRecipientsCountKeyList,
      invalidRecipientsCountKeys.length,
      tooManyStake
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: stakerWallet.address,
      to: commiterContract.address,
      success: false,
      //todo add exit code description
      exitCode: 74,
    });
  });

  it(`should pay recipient reward if commitment ready`, async () => {
    const commitmentDescription = validDescription;
    const commitmentTitle = validTitle;
    const stake = validStake;

    await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      commitmentTitle,
      commitmentDescription,
      validDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      stake
    );

    const commitmentContract = blockchain.openContract(
      await CommitmentContract.createFromConfig(
        {
          stakerAddress: stakerWallet.address,
          title: commitmentTitle,
          description: commitmentDescription,
          dueDate: validDueDate,
          recipientsList: recipientsKeyList,
          recipientsCount: recipientsKeys.length,
        },
        commitmentCodeCell
      )
    );

    const recipientWallet = await blockchain.treasury("recipientAddress");
    const sentMessageResult = await commitmentContract.sendRecipientWithdrawal(
      recipientWallet.getSender(),
      recipientsKeys[0]
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: commitmentContract.address,
      to: recipientWallet.address,
      success: true,
    });
  });

  it(`should not pay already rewarded recipient if commitment ready`, async () => {
    const commitmentDescription = validDescription;
    const commitmentTitle = validTitle;
    const stake = validStake;

    await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      commitmentTitle,
      commitmentDescription,
      validDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      stake
    );

    //three days passed...
    //set blockchain 3 days after today to be able to withdraw
    blockchain.now = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60;

    const commitmentContract = blockchain.openContract(
      await CommitmentContract.createFromConfig(
        {
          stakerAddress: stakerWallet.address,
          title: commitmentTitle,
          description: commitmentDescription,
          dueDate: validDueDate,
          recipientsList: recipientsKeyList,
          recipientsCount: recipientsKeys.length,
        },
        commitmentCodeCell
      )
    );

    const recipientWallet = await blockchain.treasury("recipientAddress");
    await recipientWallet.send({
      value: toNano("0.05"),
      to: commitmentContract.address,
      body: beginCell()
        //todo to module with op codes
        .storeUint(0x1, 32)
        .storeRef(beginCell().storeStringTail(recipientsKeys[0]).endCell())
        .endCell(),
    });

    const sentMessageResult = await recipientWallet.send({
      value: toNano("0.05"),
      to: commitmentContract.address,
      body: beginCell()
        //todo to module with op codes
        .storeUint(0x1, 32)
        .storeRef(beginCell().storeStringTail(recipientsKeys[0]).endCell())
        .endCell(),
    });

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: recipientWallet.address,
      to: commitmentContract.address,
      success: false,
      //todo add exit table
      exitCode: 77,
    });

    blockchain.now = Math.floor(Date.now() / 1000);
  });

  it(`should not pay recipient with invalid key if commitment ready`, async () => {
    const commitmentDescription = validDescription;
    const commitmentTitle = validTitle;
    const stake = validStake;

    await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      commitmentTitle,
      commitmentDescription,
      validDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      stake
    );

    //three days passed...
    //set blockchain 3 days after today to be able to withdraw
    blockchain.now = Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60;

    const commitmentContract = blockchain.openContract(
      await CommitmentContract.createFromConfig(
        {
          stakerAddress: stakerWallet.address,
          title: commitmentTitle,
          description: commitmentDescription,
          dueDate: validDueDate,
          recipientsList: recipientsKeyList,
          recipientsCount: recipientsKeys.length,
        },
        commitmentCodeCell
      )
    );

    const recipientWallet = await blockchain.treasury("recipientAddress");

    const sentMessageResult = await recipientWallet.send({
      value: toNano("0.05"),
      to: commitmentContract.address,
      body: beginCell()
        //todo to module with op codes
        .storeUint(0x1, 32)
        .storeRef(beginCell().storeStringTail("some_wrong_key").endCell())
        .endCell(),
    });

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: recipientWallet.address,
      to: commitmentContract.address,
      success: false,
      //todo add exit table
      exitCode: 76,
    });

    blockchain.now = Math.floor(Date.now() / 1000);
  });

  it(`should not pay recipient if commitment succeeded`, async () => {
    const commitmentDescription = validDescription;
    const commitmentTitle = validTitle;
    const stake = validStake;

    await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      commitmentTitle,
      commitmentDescription,
      validDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      stake
    );

    const commitmentContract = blockchain.openContract(
      await CommitmentContract.createFromConfig(
        {
          stakerAddress: stakerWallet.address,
          title: commitmentTitle,
          description: commitmentDescription,
          dueDate: validDueDate,
          recipientsList: recipientsKeyList,
          recipientsCount: recipientsKeys.length,
        },
        commitmentCodeCell
      )
    );

    await stakerWallet.send({
      value: toNano("0.05"),
      to: commitmentContract.address,
      body: beginCell()
        //todo to module with op codes
        .storeUint(0x2, 32)
        .endCell(),
    });

    const recipientWallet = await blockchain.treasury("recipientAddress");

    const sentMessageResult = await recipientWallet.send({
      value: toNano("0.05"),
      to: commitmentContract.address,
      body: beginCell()
        //todo to module with op codes
        .storeUint(0x1, 32)
        .storeRef(beginCell().storeStringTail(recipientsKeys[0]).endCell())
        .endCell(),
    });

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: recipientWallet.address,
      to: commitmentContract.address,
      success: false,
      exitCode: 78,
    });
  });

  it(`should pay staker back if commitment ready`, async () => {
    const commitmentDescription = validDescription;
    const commitmentTitle = validTitle;
    const stake = validStake;

    await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      commitmentTitle,
      commitmentDescription,
      validDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      stake
    );

    const commitmentContract = blockchain.openContract(
      await CommitmentContract.createFromConfig(
        {
          stakerAddress: stakerWallet.address,
          title: commitmentTitle,
          description: commitmentDescription,
          dueDate: validDueDate,
          recipientsList: recipientsKeyList,
          recipientsCount: recipientsKeys.length,
        },
        commitmentCodeCell
      )
    );

    const sentMessageResult = await commitmentContract.sendStakerWithdrawal(
      stakerWallet.getSender()
    );

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: commitmentContract.address,
      to: stakerWallet.address,
      success: true,
    });
  });

  it(`should not pay staker back if commitment already withdrawn`, async () => {
    const commitmentDescription = validDescription;
    const commitmentTitle = validTitle;
    const stake = validStake;

    await commiterContract.sendCommitment(
      stakerWallet.getSender(),
      commitmentTitle,
      commitmentDescription,
      validDueDate,
      recipientsKeyList,
      recipientsKeys.length,
      stake
    );

    const commitmentContract = blockchain.openContract(
      await CommitmentContract.createFromConfig(
        {
          stakerAddress: stakerWallet.address,
          title: commitmentTitle,
          description: commitmentDescription,
          dueDate: validDueDate,
          recipientsList: recipientsKeyList,
          recipientsCount: recipientsKeys.length,
        },
        commitmentCodeCell
      )
    );

    await stakerWallet.send({
      value: toNano("0.05"),
      to: commitmentContract.address,
      body: beginCell()
        //todo to module with op codes
        .storeUint(0x2, 32)
        .endCell(),
    });

    const sentMessageResult = await stakerWallet.send({
      value: toNano("0.05"),
      to: commitmentContract.address,
      body: beginCell()
        //todo to module with op codes
        .storeUint(0x2, 32)
        .endCell(),
    });

    expect(sentMessageResult.transactions).toHaveTransaction({
      from: stakerWallet.address,
      to: commitmentContract.address,
      success: false,
      //todo add exit table
      exitCode: 78,
    });
  });
});
