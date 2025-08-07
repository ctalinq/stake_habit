import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Address, type OpenedContract } from "@ton/core";
import { CommitmentContract } from "blockchain/commitmentContract";
import { useCommitmentContract } from "~/hooks/useCommitmentContract";
import Spinner from "~/components/icons/spinner.svg?react";
import CommitmentStatus from "./commitmentStatus";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import { TruncatedText } from "~/components";
import { useRawInitData } from "@telegram-apps/sdk-react";
import { formatDateToString } from "~/util";
import { useTonSender } from "~/hooks/useTonSender";

function LoadingPlaceholder() {
  const { t } = useTranslation("commitments");

  return (
    <div className="pt-10 flex flex-col items-center">
      <p className="text-3xl mb-8">{t("loading")}</p>
      <Spinner width={80} height={80} />
    </div>
  );
}

function Commitment({
  commitmentContract,
  commitmentKey,
}: {
  commitmentContract: OpenedContract<CommitmentContract>;
  commitmentKey: string;
}) {
  const { t } = useTranslation("commitments");
  const initData = useRawInitData();
  const { sender } = useTonSender();
  const [isGettingRewards, setIsGettingRewards] = useState(false);
  const queryClient = useQueryClient();

  //todo Implement logic for handling successfull rewards
  //maybe - congrats popup and invintation to home page

  const { data: commitmentData } = useQuery({
    queryKey: ["commitment"],
    queryFn: () => {
      return commitmentContract.getInfo();
    },
  });

  useQuery({
    queryKey: ["commitment_rewards_polling"],
    enabled: isGettingRewards,
    queryFn: async () => {
      const info = await commitmentContract.getInfo();
      if (info?.awardedKeyList.includes(commitmentKey)) {
        queryClient.setQueryData(["commitment"], info);
        setIsGettingRewards(false);
      }
      return null;
    },
    refetchInterval: 5000,
  });

  const { data: userData } = useQuery({
    queryKey: ["commitment_user_data"],
    queryFn: () => {
      return fetch(
        `/api/commitments/${commitmentContract?.address?.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `tma ${initData}`,
          },
        }
      ).then((response) => response.json());
    },
  });

  useQuery({
    queryKey: ["commitment_visit"],
    queryFn: () => {
      return fetch(
        `/api/commitments/${commitmentContract?.address?.toString()}/visits`,
        {
          method: "POST",
          headers: {
            Authorization: `tma ${initData}`,
          },
        }
      );
    },
  });

  const formatDate = useCallback((timeMs: number) => {
    const date = new Date(timeMs * 1000);

    return formatDateToString(date);
  }, []);

  return (
    <div>
      {commitmentData ? (
        <div className="pt-8">
          <div className="flex gap-1 align-center">
            <img
              src={userData?.tg_user_photo_link}
              alt="User Avatar"
              className="w-12 h-12 avatar-ring mr-3 mb-6"
            />
            <TruncatedText maxLength={15} className="text-4xl mb-2">
              {commitmentData.title}
            </TruncatedText>
          </div>
          <p className="mb-4">{commitmentData.description}</p>
          <p className="mb-5">
            {t("due", { date: formatDate(commitmentData.dueDate) })}
          </p>
          <CommitmentStatus
            isGettingRewards={isGettingRewards}
            onGetReward={() => {
              if (sender) {
                commitmentContract.sendRecipientWithdrawal(
                  sender,
                  commitmentKey
                );
                setIsGettingRewards(true);
              }
            }}
            commitmentKey={commitmentKey}
            alreadyRewardedKeys={commitmentData.awardedKeyList}
            status={commitmentData.status}
            dueDate={commitmentData.dueDate}
          />
        </div>
      ) : (
        <LoadingPlaceholder />
      )}
    </div>
  );
}

export default function Commitments({
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
    <div>
      {commitmentContract ? (
        <Commitment
          commitmentKey={key}
          commitmentContract={commitmentContract}
        />
      ) : (
        <LoadingPlaceholder />
      )}
    </div>
  );
}
