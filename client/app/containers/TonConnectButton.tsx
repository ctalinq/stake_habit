import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components";

interface TonConnectButtonProps {
  onConnectStart: () => void;
}

export default function TonConnectButton({
  onConnectStart,
}: TonConnectButtonProps) {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const { t } = useTranslation("common");

  const handleClick = useCallback(() => {
    if (wallet) {
      tonConnectUI.disconnect();
    } else {
      tonConnectUI.openModal();
      onConnectStart();
    }
  }, [wallet]);

  return (
    <Button onClick={handleClick}>
      {wallet ? t("disconnectTON") : t("connectTON")}
    </Button>
  );
}
