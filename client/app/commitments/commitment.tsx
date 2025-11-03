import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Address, fromNano, type OpenedContract } from "@ton/core";
import { CommitmentContract } from "blockchain/commitmentContract";
import Ton from "~/components/icons/ton.svg?react";
import { useCommitmentContract } from "~/hooks/useCommitmentContract";
import useWallet from "~/hooks/useWallet";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { useRawInitData } from "@telegram-apps/sdk-react";
import { formatDate } from "~/util";
import { useTonSender } from "~/hooks/useTonSender";
import { useCommitmentUserData } from "~/hooks/useCommitmentUserData";
import CommitementSekeleton from "./commitmentSkeleton";
import { Button, Container } from "~/components";
import CommitmentStatusBadge from "~/containers/CommitmentStatusBadge";
import useCommitmentStatus from "~/hooks/useCommitmentStatus";
import { TonConnectButton } from "~/containers";

function Commitment({
  commitmentContract,
  commitmentKey,
}: {
  commitmentContract: OpenedContract<CommitmentContract>;
  commitmentKey: string;
}) {
  const { t } = useTranslation("commitments");
  const initData = useRawInitData();
  const wallet = useWallet();
  const { sender } = useTonSender();
  const [isGettingRewards, setIsGettingRewards] = useState(false);
  const queryClient = useQueryClient();

  //todo Implement logic for handling successfull rewards
  //maybe - congrats popup and invintation to home page

  const { data: commitmentData } = useQuery({
    queryKey: ["commitment", commitmentContract?.address?.toString()],
    queryFn: () => {
      return commitmentContract.getInfo();
    },
  });

  useQuery({
    queryKey: ["commitment_rewards_polling"],
    enabled:
      isGettingRewards &&
      !commitmentData?.awardedKeyList.includes(commitmentKey),
    queryFn: async () => {
      const info = await commitmentContract.getInfo();
      if (info?.awardedKeyList.includes(commitmentKey)) {
        queryClient.setQueryData(
          ["commitment", commitmentContract?.address?.toString()],
          info
        );
        setIsGettingRewards(false);
      }
      return null;
    },
    refetchInterval: 5000,
  });

  const { data: userData } = useCommitmentUserData(commitmentContract);

  useQuery({
    queryKey: ["commitment_visit"],
    queryFn: () => {
      return fetch(
        `/api/commitments/${commitmentContract?.address?.toString()}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `tma ${initData}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visited: true,
          }),
        }
      );
    },
  });

  const commitmentStatus = useCommitmentStatus(commitmentData);

  return commitmentData ? (
    <>
      <div className="flex gap-1 align-center">
        <img
          src={userData?.tg_user_photo_link}
          alt="User Avatar"
          className="w-12 h-12 avatar-ring mr-3 mb-6 shrink-0"
        />
        <p className="text-xl mb-2 text-black dark:text-white">
          {commitmentData.title}
        </p>
      </div>
      <p className="mb-4 text-black dark:text-white">
        {commitmentData.description}
      </p>
      <p className="mb-5 text-black dark:text-white">
        {t("due", { date: formatDate(commitmentData.dueDate) })}
      </p>
      <div className="mb-5 flex items-center">
        <span className="text-lg text-black dark:text-white mr-2">
          {t("reward")}
        </span>
        <span className="text-lg mr-2">
          {Number(fromNano(commitmentData.balance)).toFixed(2)}
        </span>
        <Ton />
      </div>
      <CommitmentStatusBadge
        size="md"
        additionalCardClassName="w-24 mb-4"
        status={commitmentStatus}
      />
      {!wallet && commitmentStatus === "failed" && (
        <>
          <p className="text-red-500 text-l mb-2">{t("connectWallet")}</p>
          <TonConnectButton onConnectStart={() => {}} />
        </>
      )}
      {commitmentStatus === "failed" &&
        wallet &&
        (!commitmentData.awardedKeyList.includes(commitmentKey) ? (
          <Button
            disabled={isGettingRewards}
            isProcessing={isGettingRewards}
            className="mt-6"
            onClick={() => {
              commitmentContract.sendRecipientWithdrawal(sender, commitmentKey);
              setIsGettingRewards(true);
            }}
          >
            {t("getRewards")}
          </Button>
        ) : (
          <p className="text-gray-600 text-2xl">{t("alreadyRewarded")}</p>
        ))}
    </>
  ) : (
    <CommitementSekeleton />
  );
}

export default function CommitmentPage({
  params,
}: {
  params: { commitmentAddress: string };
}) {
  const { commitmentAddress } = params;

  const key: string = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("key") as string;
  }, []);

  const commitmentContract = useCommitmentContract(
    Address.parse(commitmentAddress)
  );

  return (
    <Container>
      {commitmentContract ? (
        <Commitment
          commitmentKey={key}
          commitmentContract={commitmentContract}
        />
      ) : (
        <CommitementSekeleton />
      )}
    </Container>
  );
}
