import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  Button,
  TextArea,
  DecimalInput,
  DatePicker,
  TextInput,
  Modal,
} from "../components";
import { startOfDay } from "~/util";
import { TonConnectButton } from "~/containers";
import { useTonWallet } from "@tonconnect/ui-react";
import { CommiterContract } from "blockchain";
import { Address, beginCell } from "@ton/core";

export default function Create() {
  const wallet = useTonWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { t } = useTranslation("create");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stakeAmount, setStakeAmount] = useState<number | null>(null);
  const [recepientsCount, setRecepientsCount] = useState<number | null>(null);

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

  const handleCreateClicked = useCallback(() => {
    if (!wallet) {
      openWalletModal();
      return;
    } else {
      console.log(
        CommiterContract.createFromConfig(
          {
            owner_address: Address.parse("test"),
            commitment_code: beginCell().endCell(),
          },
          beginCell().endCell()
        )
      );
    }
  }, [wallet]);

  return (
    <Card>
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
          min={10}
          max={100}
          round={2}
          label={t("stake.label")}
          placeholder={t("stake.placeholder")}
          naNError={t("stake.error.isNaN")}
          minError={t("stake.error.minError", { min: 10 })}
          maxError={t("stake.error.maxError", { max: 100 })}
          good={t("stake.good")}
          // TON icon
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <g id="surface1">
                <path
                  fill="#0098EA"
                  d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10m0 0"
                ></path>
                <path
                  fill="#FFF"
                  d="M13.414 5.582H6.586c-1.258 0-2.05 1.356-1.422 2.45l4.215 7.304a.718.718 0 0 0 1.242 0l4.215-7.305c.629-1.094-.164-2.449-1.422-2.449m-4.039 7.563-.918-1.778-2.215-3.96a.388.388 0 0 1 .344-.579h2.789Zm4.379-5.739-2.215 3.965-.918 1.774V6.828h2.793c.305 0 .484.324.34.578m0 0"
                ></path>
              </g>
            </svg>
          }
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
            stakeAmount < 10 ||
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
    </Card>
  );
}
