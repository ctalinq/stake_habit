import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Button,
  TextArea,
  DecimalInput,
  DatePicker,
  TextInput,
  Modal,
} from "~/components";
import { startOfDay } from "~/util";
import { TonConnectButton } from "~/containers";
import { useTonWallet } from "@tonconnect/ui-react";
import { useCommiterContract } from "../hooks/useCommiterContract";
import { useTonSender } from "../hooks/useTonSender";
import { CommitmentContract } from "blockchain/commitmentContract";
import {
  generateRecipientsKeyList,
  generateRecipientsKeys,
} from "blockchain/utils";
import { hex as commitmentContractHex } from "blockchain/commitment";
import { Address, Cell, toNano } from "@ton/core";
import { useMutation } from "@tanstack/react-query";
import { useRawInitData } from "@telegram-apps/sdk-react";
import ShareKeysModal from "./shareKeysModal";
import { useCommitmentContract } from "../hooks/useCommitmentContract";
import { useNavigate } from "react-router";
import Ton from "~/components/icons/ton.svg?react";

export default function Create() {
  const wallet = useTonWallet();
  const initData = useRawInitData();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { t } = useTranslation("create");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stakeAmount, setStakeAmount] = useState<number | null>(null);
  const [recepientsCount, setRecepientsCount] = useState<number | null>(null);
  const [recepientKeys, setRecepientKeys] = useState<string[] | null>(null);
  const [messagesWereSent, setMessagesWereSent] = useState(false);
  const navigate = useNavigate();

  const { sender } = useTonSender();
  const commiterContract = useCommiterContract();

  const [createdCommitmentAddress, setCreatedCommitmentAddress] =
    useState<Address | null>(null);
  const commitmentContract = useCommitmentContract(createdCommitmentAddress);
  const [commitmentInfo, setCommitmentInfo] = useState<{
    title: string;
  } | null>(null);

  const {
    data: messageIds,
    mutateAsync: saveCommitment,
    reset: resetSaveCommitment,
  } = useMutation({
    mutationFn: async ({
      recepientKeys,
      address,
    }: {
      recepientKeys: string[];
      address: string;
    }) => {
      if (wallet?.account) {
        const response = await fetch(
          `/api/commitments?walletAddress=${btoa(wallet.account.address)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `tma ${initData}`,
            },
            body: JSON.stringify({
              commitment_address: address,
              recipient_keys: recepientKeys,
            }),
          }
        );
        return response.json();
      }

      return null;
    },
  });

  const { mutateAsync: setCommitmentIsActive } = useMutation({
    mutationFn: async () => {
      if (commitmentContract?.address) {
        await fetch(
          `/api/commitments/${commitmentContract?.address.toString()}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `tma ${initData}`,
            },
            body: JSON.stringify({
              active: true,
            }),
          }
        );
      }
    },
  });

  const checkCommitmenIdDeployed = async () => {
    if (commitmentContract && createdCommitmentAddress) {
      try {
        const info = await commitmentContract.getInfo();
        await setCommitmentIsActive();
        setCommitmentInfo(info);
      } catch (error) {
        console.error(error);
        setTimeout(checkCommitmenIdDeployed, 4000);
      }
    }
  };

  useEffect(() => {
    if (commitmentContract) setTimeout(checkCommitmenIdDeployed, 4000);
  }, [commitmentContract]);

  const today = useMemo(() => {
    return startOfDay(new Date());
  }, []);

  const tomorrow = useMemo(() => {
    const now = new Date(today);
    now.setDate(today.getDate() + 1);
    return startOfDay(now);
  }, [today]);

  const maxEndDate = useMemo(() => {
    const now = new Date(today);
    now.setDate(today.getDate() + 90);
    return startOfDay(now);
  }, [today]);

  const defaultDate = useMemo(() => {
    const now = new Date(today);
    now.setDate(today.getDate() + 7);
    return startOfDay(now);
  }, [today]);

  const [dueDate, setDueDate] = useState<Date>(defaultDate);

  const closeWalletModal = useCallback(() => {
    setIsWalletModalOpen(false);
  }, []);

  const openWalletModal = useCallback(() => {
    setIsWalletModalOpen(true);
  }, []);

  const handleMessagesSent = async () => {
    setMessagesWereSent(true);

    if (!wallet) {
      openWalletModal();
    } else if (commiterContract && recepientKeys && stakeAmount) {
      const dueDateSeconds = Math.floor(dueDate.getTime() / 1000);
      const recipientsKeyList = generateRecipientsKeyList(recepientKeys);

      await commiterContract.sendCommitment(
        sender,
        title,
        description,
        dueDateSeconds,
        recipientsKeyList,
        recepientKeys.length,
        toNano(stakeAmount.toString())
      );

      //todo - remove duplication
      const commitmentCodeCell = Cell.fromBoc(
        Buffer.from(commitmentContractHex, "hex")
      )[0];

      const commitmentContract = await CommitmentContract.createFromConfig(
        {
          stakerAddress: Address.parse(wallet.account.address),
          title: title,
          description: description,
          dueDate: dueDateSeconds,
          recipientsList: recipientsKeyList,
          recipientsCount: recepientKeys.length,
        },
        commitmentCodeCell
      );

      setCreatedCommitmentAddress(commitmentContract.address);
    }
  };

  useEffect(() => {
    return () => {
      resetSaveCommitment();
    };
  }, []);

  const isDeployModalOpen = !commitmentInfo && !!createdCommitmentAddress;

  const handleCreateClicked = async () => {
    if (!wallet) {
      openWalletModal();
    } else if (commiterContract && recepientsCount && stakeAmount) {
      const dueDateSeconds = Math.floor(dueDate.getTime() / 1000);
      const recipientNumbers = Array.from({ length: recepientsCount }, (_, i) =>
        (i + 1).toString()
      );
      const recipientsKeys = await generateRecipientsKeys(recipientNumbers);
      const recipientsKeyList = generateRecipientsKeyList(recipientsKeys);

      const commitmentCodeCell = Cell.fromBoc(
        Buffer.from(commitmentContractHex, "hex")
      )[0];

      const commitmentContract = await CommitmentContract.createFromConfig(
        {
          stakerAddress: Address.parse(wallet.account.address),
          title: title,
          description: description,
          dueDate: dueDateSeconds,
          recipientsList: recipientsKeyList,
          recipientsCount: recipientsKeys.length,
        },
        commitmentCodeCell
      );

      setRecepientKeys(recipientsKeys);

      await saveCommitment({
        recepientKeys: recipientsKeys,
        address: commitmentContract.address.toString(),
      });
    }
  };

  return (
    <Card className="page-transition">
      <div className="space-y-2">
        <TextInput
          value={title}
          onChange={setTitle}
          label={t("title.label")}
          placeholder={t("title.placeholder")}
          good={t("title.good")}
          maxLengthError={t("title.error.maxLength", { maxLength: 40 })}
          maxLength={40}
        />

        <TextArea
          value={description}
          onChange={setDescription}
          label={t("description.label")}
          placeholder={t("description.placeholder")}
          good={t("description.good")}
          maxLengthError={t("description.error.maxLength", { maxLength: 1000 })}
          minLengthError={t("description.error.minLength", { maxLength: 1 })}
          minLength={1}
          maxLength={1000}
          rows={5}
        />

        <DecimalInput
          value={stakeAmount}
          onChange={setStakeAmount}
          min={1}
          max={100}
          round={2}
          label={t("stake.label")}
          placeholder={t("stake.placeholder")}
          naNError={t("stake.error.isNaN")}
          minError={t("stake.error.minError", { min: 1 })}
          maxError={t("stake.error.maxError", { max: 100 })}
          good={t("stake.good")}
          icon={<Ton />}
        />

        <DecimalInput
          value={recepientsCount}
          onChange={setRecepientsCount}
          min={1}
          max={10}
          round={0}
          label={t("recepientsCount.label")}
          placeholder={t("recepientsCount.placeholder")}
          naNError={t("recepientsCount.error.isNaN")}
          minError={t("recepientsCount.error.minError", { min: 1 })}
          maxError={t("recepientsCount.error.maxError", { max: 10 })}
          good={t("recepientsCount.good")}
        />

        <DatePicker
          value={dueDate}
          onChange={setDueDate}
          label={t("dueDate.label")}
          minDate={tomorrow}
          maxDate={maxEndDate}
          error={
            dueDate && dueDate >= tomorrow && dueDate <= maxEndDate
              ? undefined
              : t("dueDate.error")
          }
          good={t("dueDate.good")}
        />

        <Button
          onClick={handleCreateClicked}
          disabled={
            !title.trim() ||
            !description.trim() ||
            stakeAmount === null ||
            stakeAmount < 1 ||
            stakeAmount > 100 ||
            recepientsCount === null ||
            recepientsCount < 1 ||
            recepientsCount > 10 ||
            !dueDate ||
            !(dueDate >= tomorrow && dueDate <= maxEndDate)
          }
          className="w-full"
        >
          {t("create")}
        </Button>
      </div>
      <Modal
        modalClassName="w-90 space-y-4 flex flex-col items-center"
        isOpen={isWalletModalOpen}
        onClose={closeWalletModal}
      >
        <h3 className="text-xl font-bold">{t("walletModal.title")}</h3>
        <div className="text-center">{t("walletModal.description")}</div>
        <TonConnectButton onConnectStart={closeWalletModal} />
      </Modal>
      <Modal
        showCloseButton={false}
        modalClassName="w-90 space-y-4 flex flex-col items-center"
        isOpen={isDeployModalOpen}
        onClose={() => {}}
      >
        <p className="text-center mb-9 text-black dark:text-white">
          {t("commitmentDeploymentModal.text")}
        </p>
        <div>todo loader</div>
      </Modal>

      <Modal
        showCloseButton={false}
        modalClassName="w-90 space-y-4 flex flex-col items-center"
        isOpen={!!commitmentInfo}
        onClose={() => {}}
      >
        <div className="flex flex-col">
          <p className="text-2xl mb-5 text-center text-black dark:text-white">
            {t("success.congrats")}
          </p>
          <p className="text-9xl text-center mb-9">{t("success.emoji")}</p>
          <Button
            onClick={() => {
              navigate("/");
            }}
          >
            {t("success.ok")}
          </Button>
        </div>
      </Modal>
      <ShareKeysModal
        onReady={handleMessagesSent}
        onError={() => {
          setMessagesWereSent(false);
          resetSaveCommitment();
        }}
        messageIds={messagesWereSent ? undefined : messageIds}
      />
    </Card>
  );
}
