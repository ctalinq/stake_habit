import { useQuery } from "@tanstack/react-query";
import { useRawInitData } from "@telegram-apps/sdk-react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useTranslation } from "react-i18next";

import { Card, Link } from "~/components";

export default function Home() {
  const { t } = useTranslation("home");
  const wallet = useTonWallet();
  const initData = useRawInitData();

  const { data: visitors } = useQuery({
    enabled: !!wallet?.account.address,
    queryKey: ["visitor", wallet?.account.address.toString()],
    queryFn: async () => {
      if (wallet?.account) {
        const response = await fetch(
          `/api/wallets/${btoa(wallet.account.address)}/visitors`,
          {
            headers: {
              Authorization: `tma ${initData}`,
            },
          }
        );
        const data = await response.json();
        return data;
      }

      return null;
    },
  });

  console.log(visitors);

  return (
    <Card>
      <div className="space-y-6">
        <Link
          to="/create"
          className="block w-full btn-base btn-primary text-center py-3 px-4"
        >
          {t("commit")}
        </Link>
      </div>
    </Card>
  );
}
