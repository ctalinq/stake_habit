import { useQuery } from "@tanstack/react-query";
import { Address, type OpenedContract } from "@ton/core";
import { CommitmentContract } from "blockchain/commitmentContract";
import { useCommitmentContract } from "~/hooks/useCommitmentContract";
import Spinner from "~/components/icons/spinner.svg?react";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { TruncatedText } from "~/components";
import { useRawInitData } from "@telegram-apps/sdk-react";

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
}: {
  commitmentContract: OpenedContract<CommitmentContract>;
}) {
  const { t } = useTranslation("commitments");
  const initData = useRawInitData();

  const { data } = useQuery({
    queryKey: ["commitment"],
    queryFn: () => {
      return commitmentContract.getInfo();
    },
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

  const formatDate = useCallback((timeMs: number) => {
    const date = new Date(timeMs * 1000);

    return date.toDateString();
  }, []);

  return (
    <div>
      {data ? (
        <div className="pt-8">
          <div className="flex gap-1 align-center">
            <img
              src={userData?.tg_user_photo_link}
              alt="User Avatar"
              className="w-12 h-12 avatar-ring mr-3 mb-6"
            />
            <TruncatedText maxLength={15} className="text-4xl mb-2">
              {data.title}
            </TruncatedText>
          </div>
          <p className="mb-4">{data.description}</p>
          <p>{t("due", { date: formatDate(data.dueDate) })}</p>
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

  const commitmentContract = useCommitmentContract(
    Address.parse(commitmentAddress)
  );

  return (
    <div>
      {commitmentContract ? (
        <Commitment commitmentContract={commitmentContract} />
      ) : (
        <LoadingPlaceholder />
      )}
    </div>
  );
}
