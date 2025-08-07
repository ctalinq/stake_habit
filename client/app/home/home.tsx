import { useQuery } from "@tanstack/react-query";
import { useRawInitData } from "@telegram-apps/sdk-react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useTranslation } from "react-i18next";

import type { VisitorsDTO } from "~/types";
import { Card, Link } from "~/components";
import CommitmentRow from "./commitmentRow";

export default function Home() {
  const { t } = useTranslation("home");
  const wallet = useTonWallet();
  const initData = useRawInitData();

  const { data: commitements } = useQuery<VisitorsDTO>({
    enabled: !!wallet?.account.address,
    queryKey: ["commitments", wallet?.account.address.toString()],
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

  return (
    <>
      <Card className="mb-4">
        <div className="space-y-6">
          <Link
            to="/create"
            className="block w-full btn-base btn-primary text-center py-3 px-4"
          >
            {t("commit")}
          </Link>
        </div>
      </Card>
      {commitements && Object.keys(commitements).length > 0 && (
        <Card className="space-y-16 pb-18">
          <h2 className="text-xl font-bold mb-4">
            {t("yourCommitments.title")}
          </h2>
          {Object.entries(commitements)
            .slice(0, 7)
            .map(([commitmentAddress, commitment]) => (
              <CommitmentRow
                key={commitmentAddress}
                commitmentAddress={commitmentAddress}
                commitment={commitment}
              />
            ))}
        </Card>
      )}
    </>
  );
}
