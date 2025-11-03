import { useEffect, useRef, useState } from "react";
import { Modal } from "~/components";
import { shareMessage } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";

interface ShareKeysModalProps {
  messageIds?: string[];
  onReady: () => void;
  onError: (error: Error) => void;
}

interface ShareKeysModalContentProps {
  messageIds: string[];
  onReady: () => void;
  onError: (error: Error) => void;
}

function ShareKeysModalContent({
  messageIds,
  onReady,
  onError,
}: ShareKeysModalContentProps) {
  const { t } = useTranslation("create");
  const [keyNumber, setKeyNumber] = useState(0);
  const keyNumberRef = useRef(0);

  useEffect(() => {
    if (keyNumberRef.current === 0) {
      stepOn();
    }
  }, [keyNumberRef.current]);

  const stepOn = async () => {
    setKeyNumber(keyNumberRef.current + 1);
    keyNumberRef.current = keyNumberRef.current + 1;

    try {
      await shareMessage(messageIds[keyNumberRef.current - 1]);

      if (keyNumberRef.current >= messageIds.length) onReady();
      else setTimeout(stepOn, 3000);
    } catch (error) {
      console.error(error);
      onError(error as Error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-2xl mb-5 text-black dark:text-white text-center">
        {t("shareKeysModal.step_info", {
          keyNumber,
          keyCount: messageIds.length,
        })}
      </p>
      <div>todo loader</div>
    </div>
  );
}

export default function ShareKeysModal({
  messageIds,
  onReady,
  onError,
}: ShareKeysModalProps) {
  return (
    <Modal
      showCloseButton={false}
      modalClassName="w-90 space-y-4 flex flex-col items-center"
      isOpen={messageIds ? messageIds.length > 0 : false}
      onClose={() => {}}
    >
      {messageIds && (
        <ShareKeysModalContent
          onError={onError}
          onReady={onReady}
          messageIds={messageIds}
        />
      )}
    </Modal>
  );
}
