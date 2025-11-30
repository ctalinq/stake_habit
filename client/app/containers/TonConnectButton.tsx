import { useTonConnectUI } from "@tonconnect/ui-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import useWallet from "~/hooks/useWallet";
import { Button } from "~/components";

interface TonConnectButtonProps {
  className?: string;
  onConnectStart: () => void;
}

export default function TonConnectButton({
  className,
  onConnectStart,
}: TonConnectButtonProps) {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useWallet();
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
    <Button className={className} onClick={handleClick}>
      {wallet ? t("disconnectTON") : t("connectTON")}
    </Button>
  );
}
