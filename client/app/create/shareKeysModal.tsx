import React, { useRef, useState } from "react";
import { Button, Modal } from "~/components";
import { shareMessage } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";
import Spinner from "~/components/icons/spinner.svg?react";

interface ShareKeysModalProps {
  messageIds?: string[];
  onReady: () => void;
}

interface ShareKeysModalContentProps {
  messageIds: string[];
  onReady: () => void;
}

function ShareKeysModalContent({
  messageIds,
  onReady,
}: ShareKeysModalContentProps) {
  const { t } = useTranslation("create");
  const [keyNumber, setKeyNumber] = useState(0);
  const keyNumberRef = useRef(0);

  const stepOn = async () => {
    setKeyNumber(keyNumberRef.current + 1);
    keyNumberRef.current = keyNumberRef.current + 1;

    try {
      await shareMessage(messageIds[keyNumberRef.current - 1]);
    } catch (error) {
      console.error(error);
    } finally {
      if (keyNumberRef.current >= messageIds.length) onReady();
      else setTimeout(stepOn, 3000);
    }
  };

  if (keyNumber === 0)
    return (
      <div className="flex flex-col">
        <p className="text-2xl mb-5">{t("shareKeysModal.congrats.p_1")}</p>
        <p className="text-9xl text-center mb-9">
          {t("shareKeysModal.congrats.p_2")}
        </p>
        <p className="text-amber-600 font-bold mb-4">
          {t("shareKeysModal.congrats.p_3")}
        </p>
        <Button
          onClick={() => {
            stepOn();
          }}
        >
          {t("shareKeysModal.congrats.button")}
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl mb-5 text-center">
        {t("shareKeysModal.step_info", {
          keyNumber,
          keyCount: messageIds.length,
        })}
      </p>
      <Spinner />
    </div>
  );
}

export default function ShareKeysModal({
  messageIds,
  onReady,
}: ShareKeysModalProps) {
  return (
    <Modal
      showCloseButton={false}
      modalClassName="w-90 space-y-4 flex flex-col items-center"
      isOpen={messageIds ? messageIds.length > 0 : false}
      onClose={() => {}}
    >
      {messageIds && (
        <ShareKeysModalContent onReady={onReady} messageIds={messageIds} />
      )}
    </Modal>
  );
}
