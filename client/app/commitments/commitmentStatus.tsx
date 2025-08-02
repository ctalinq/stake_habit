import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import InProcess from "./icons/inProcess.svg?react";
import Succeded from "./icons/succeeded.svg?react";
import Failed from "./icons/failed.svg?react";
import Loading from "./icons/loading.svg?react";
import Treasure from "./icons/treasure.svg?react";
import { useTonWallet } from "@tonconnect/ui-react";
import { TonConnectButton } from "~/containers";

const CommitmentStatus = ({
  status,
  dueDate,
  commitmentKey,
  alreadyRewardedKeys,
  isGettingRewards,
  onGetReward,
}: {
  status: number;
  dueDate: number;
  commitmentKey: string;
  isGettingRewards: boolean;
  alreadyRewardedKeys: string[];
  onGetReward: () => void;
}) => {
  const { t } = useTranslation("commitments");
  const wallet = useTonWallet();

  const isCommitmentInProcess = useMemo(() => {
    return status === 0 && dueDate * 1000 > Date.now();
  }, [status, dueDate]);

  const isCommitmentSucceded = useMemo(() => {
    return status === 1;
  }, [status]);

  const isCommitmentFailed = useMemo(() => {
    return status === 2 || (status === 0 && dueDate * 1000 < Date.now());
  }, [status]);

  return (
    <div>
      {isCommitmentInProcess && (
        <>
          <InProcess width={50} height={50} className="fill-indigo-700 mb-4" />
          <p className="text-indigo-700 text-2xl fontfont-bold">
            {t("inProcess")}
          </p>
        </>
      )}
      {isCommitmentSucceded && (
        <>
          <Succeded width={70} height={70} className="fill-emerald-700 mb-4" />
          <p className="text-emerald-700 text-2xl fontfont-bold">
            {t("succeeded")}
          </p>
        </>
      )}
      {!wallet && isCommitmentFailed && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-red-500 text-2xl">{t("connectWallet")}</p>
          <TonConnectButton onConnectStart={() => {}} />
        </div>
      )}
      {isCommitmentFailed && wallet && (
        <>
          <Failed width={50} height={50} className="fill-amber-500  mb-4" />
          <p className="text-amber-500 text-2xl fontfont-bold mb-5">
            {t("failed")}
          </p>
          {!alreadyRewardedKeys.includes(commitmentKey) ? (
            <button
              disabled={isGettingRewards}
              className="fixed bottom-15 left-1/2 transform -translate-x-1/2
            rounded-full w-32 h-32 bg-green-700 text-white font-bold
            animate-bounce flex flex-col items-center justify-center gap-2 disabled:opacity-40"
              onClick={onGetReward}
            >
              {!isGettingRewards ? (
                <>
                  {t("getRewards")}
                  <Treasure width={30} height={30} className="fill-white" />
                </>
              ) : (
                <Loading width={70} height={70} className="fill-white" />
              )}
            </button>
          ) : (
            <p className="text-gray-600 text-2xl">{t("alreadyRewarded")}</p>
          )}
        </>
      )}
    </div>
  );
};

export default CommitmentStatus;
