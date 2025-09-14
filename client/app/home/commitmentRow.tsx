import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Address } from "@ton/core";
import { useCommitmentStatus } from "~/hooks/useCommitmentStatus";
import { useCommitmentContract } from "~/hooks/useCommitmentContract";
import { useTonSender } from "~/hooks/useTonSender";
import InProcess from "~/commitments/icons/inProcess.svg?react";
import Succeded from "~/commitments/icons/succeeded.svg?react";
import Failed from "~/commitments/icons/failed.svg?react";
import LoadingSvg from "~/home/icons/loading.svg?react";
import type { VisitorDTO } from "~/types";

const CommitmentInfo = ({
  title,
  status,
  dueDate,
  onSuccess,
  onFail,
  isPolling,
}: {
  title: string;
  status: number;
  dueDate: number;
  onSuccess: () => void;
  onFail: () => void;
  isPolling: boolean;
}) => {
  const { t } = useTranslation("home");
  const commitmentStatus = useCommitmentStatus({
    dueDate,
    status,
  });

  return (
    <div className="flex items-center">
      <div className="mr-1">
        {commitmentStatus === "inProcess" && (
          <InProcess className="w-7 h-7 mr-2 fill-indigo-700" />
        )}
        {commitmentStatus === "success" && (
          <Succeded className="w-7 h-7 mr-2 fill-emerald-700" />
        )}
        {commitmentStatus === "failed" && (
          <Failed className="w-7 h-7 mr-2 fill-amber-500" />
        )}
      </div>
      <div>
        <p className="truncate text text-lg text-black dark:text-white">
          {title}
        </p>
        {commitmentStatus === "inProcess" && !isPolling && (
          <div className="flex gap-4 text-sm">
            <button onClick={onSuccess} className="text-emerald-700 underline">
              {t("commitment.success")}
            </button>
            <button onClick={onFail} className="text-red-600 underline">
              {t("commitment.fail")}
            </button>
          </div>
        )}
        {isPolling && <LoadingSvg className="w-7 h-7" />}
      </div>
    </div>
  );
};

function CommitmentRow({
  commitmentAddress,
  visitors,
}: {
  commitmentAddress: string;
  visitors?: VisitorDTO[];
}) {
  const { t } = useTranslation("home");

  const [isPollingSucccess, setIsPollingSuccess] = useState(false);
  const [isPollingFail, setIsPollingFail] = useState(false);
  const isPolling = isPollingSucccess || isPollingFail;

  const { sender } = useTonSender();
  const queryClient = useQueryClient();

  const commitmentContract = useCommitmentContract(
    Address.parse(commitmentAddress)
  );

  const { data: commitmentData } = useQuery({
    enabled: !!commitmentContract,
    queryKey: ["commitment", commitmentAddress],
    queryFn: () => {
      if (commitmentContract) {
        return commitmentContract.getInfo();
      }
      return null;
    },
  });

  useQuery({
    queryKey: ["commitment_withdrawal_polling", commitmentAddress],
    enabled: isPollingSucccess,
    queryFn: async () => {
      if (commitmentContract) {
        const info = await commitmentContract.getInfo();

        if (info?.status === 1) {
          queryClient.setQueryData(["commitment", commitmentAddress], info);
          setIsPollingSuccess(false);
        }

        return null;
      }
    },
    refetchInterval: 5000,
  });

  useQuery({
    queryKey: ["commitment_fail_polling", commitmentAddress],
    enabled: isPollingFail,
    queryFn: async () => {
      if (commitmentContract) {
        const info = await commitmentContract.getInfo();

        if (info?.status === 2) {
          queryClient.setQueryData(["commitment", commitmentAddress], info);
          setIsPollingFail(false);
        }

        return null;
      }
    },
    refetchInterval: 5000,
  });

  return (
    <div className="relative h-10">
      {commitmentData ? (
        <CommitmentInfo
          title={commitmentData.title}
          status={commitmentData.status}
          dueDate={commitmentData.dueDate}
          onSuccess={() => {
            if (commitmentContract) {
              commitmentContract.sendStakerWithdrawal(sender);
              setIsPollingSuccess(true);
            }
          }}
          onFail={() => {
            if (commitmentContract) {
              commitmentContract.sendStakerFail(sender);
              setIsPollingFail(true);
            }
          }}
          isPolling={isPolling}
        />
      ) : (
        <div className="w-54 h-6 skeleton" />
      )}
      {visitors && visitors.length > 0 && (
        <div className="absolute right-0 top-14 flex items-center">
          <p className="text-sm text-gray-500 dark:text-white mr-4">
            {t("viewers")}
          </p>
          {visitors.map((visitor) => (
            <div key={visitor.tg_user_id} style={{ marginLeft: "-10px" }}>
              {visitor.tg_user_photo_link && (
                <img
                  src={visitor.tg_user_photo_link}
                  alt={visitor.tg_user_full_name}
                  className="w-7 h-7 rounded-full"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommitmentRow;
