import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Address, fromNano } from "@ton/core";
import Ton from "~/components/icons/ton.svg?react";
import useCommitmentStatus from "~/hooks/useCommitmentStatus";
import { useCommitmentContract } from "~/hooks/useCommitmentContract";
import { useTonSender } from "~/hooks/useTonSender";
import Loading from "~/home/icons/loading.svg?react";
import Complete from "~/home/icons/complete.svg?react";
import Fail from "~/home/icons/fail.svg?react";
import Arrow from "~/home/icons/arrow.svg?react";
import type { VisitorDTO } from "~/types";
import { Card } from "~/components";
import { twMerge } from "tailwind-merge";
import CommitmentStatusBadge from "~/containers/CommitmentStatusBadge";
import { formatDate } from "~/util";

const CommitmentInfo = ({
  title,
  status,
  dueDate,
  onCollapse,
  isPolling,
  isCollapsed,
}: {
  title: string;
  status: number;
  dueDate: number;
  onCollapse: () => void;
  isPolling: boolean;
  isCollapsed: boolean;
}) => {
  const commitmentStatus = useCommitmentStatus({
    dueDate,
    status,
  });

  return (
    <button
      onClick={onCollapse}
      className={twMerge("flex items-center w-full", !isCollapsed && "mb-2")}
    >
      <div className="flex flew-nowrap grow-1 items-center pr-2 overflow-hidden">
        {isPolling ? (
          <div className="flex basis-22 mr-6 shrink-0 items-center">
            <Loading className="w-7 h-7" />
          </div>
        ) : (
          <CommitmentStatusBadge
            additionalCardClassName="basis-22 shrink-0 mr-6"
            status={commitmentStatus}
          />
        )}
        <div className="grow shrink min-w-0">
          <p className="text-black dark:text-white text-start truncate">
            {title}
          </p>
        </div>
      </div>
      <div
        className={twMerge(
          "w-12 flex items-center shrink-0 justify-center rounded",
          isCollapsed ? "rotate-0" : "rotate-180"
        )}
      >
        <Arrow className="w-5 h-5 dark:fill-white" />
      </div>
    </button>
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
  const { t: tCommon } = useTranslation("common");
  const [isCollapsed, setIsCollapsed] = useState(true);

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

  const commitmentStatus = useCommitmentStatus(commitmentData);

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
    <Card
      className={twMerge(
        "p-3",
        "transition-[max-height] duration-300 overflow-hidden",
        isCollapsed ? "max-h-[50px]" : "max-h-[600px]"
      )}
    >
      {commitmentData ? (
        <CommitmentInfo
          title={commitmentData.title}
          status={commitmentData.status}
          dueDate={commitmentData.dueDate}
          isCollapsed={isCollapsed}
          onCollapse={() => setIsCollapsed(!isCollapsed)}
          isPolling={isPolling}
        />
      ) : (
        <div className="w-54 h-6 skeleton" />
      )}
      {!isCollapsed && visitors && visitors.length > 0 && (
        <div className="flex my-2 items-center">
          <p className="text-sm text-gray-500 dark:text-white w-[35%]">
            {t("viewers", { count: visitors.length })}
          </p>
          {visitors.slice(0, 7).map((visitor) => (
            <div
              className="shrink-0"
              key={visitor.tg_user_id}
              style={{ marginLeft: "-5px" }}
            >
              {visitor.tg_user_photo_link && (
                <img
                  src={visitor.tg_user_photo_link}
                  alt={visitor.tg_user_full_name}
                  className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-700 bg-white"
                />
              )}
            </div>
          ))}
          {visitors.length > 7 && (
            <div className="shrink-0 ml-2">
              <span className="text-sm text-gray-500 dark:text-white">
                {tCommon("moreDots")}
              </span>
            </div>
          )}
        </div>
      )}
      {!isCollapsed && commitmentData?.dueDate && (
        <div className="flex mb-2">
          <span className="text-sm text-gray-500 dark:text-white pb-1 w-[35%]">
            {t("dueDate")}
          </span>
          <span className="text-sm dark:text-white">
            {formatDate(commitmentData.dueDate)}
          </span>
        </div>
      )}
      {!isCollapsed && commitmentData && (
        <div className="flex mb-2">
          <span className="text-sm text-gray-500 dark:text-white pb-1 w-[35%]">
            {t("balance")}
          </span>
          <span className="text-sm dark:text-white mr-2">
            {Number(fromNano(commitmentData.balance)).toFixed(2)}
          </span>
          <Ton />
        </div>
      )}
      {!isCollapsed && commitmentData?.description && (
        <div>
          <p className="text-sm text-gray-500 dark:text-white pb-1">
            {t("description")}
          </p>
          <p className="text-sm dark:text-white whitespace-pre-wrap">
            {commitmentData?.description}
          </p>
        </div>
      )}
      {!isCollapsed && !isPolling && commitmentStatus === "inProcess" && (
        <div className="h-12 flex mt-5 space-x-2">
          <button
            className="p-2 bg-emerald-700 flex items-center rounded-sm"
            onClick={() => {
              if (commitmentContract) {
                commitmentContract.sendStakerWithdrawal(sender);
                setIsPollingSuccess(true);
              }
            }}
          >
            <span className="mr-2 shrink-0 text-white">{t("complete")}</span>
            <Complete className="w-9 h-9 text-white" />
          </button>
          <button
            className="p-2 bg-red-700 flex items-center rounded-sm"
            onClick={() => {
              if (commitmentContract) {
                commitmentContract.sendStakerFail(sender);
                setIsPollingFail(true);
              }
            }}
          >
            <span className="shrink-0 text-white">{t("fail")}</span>
            <Fail className="w-9 h-9 text-white" />
          </button>
        </div>
      )}
    </Card>
  );
}

export default CommitmentRow;
