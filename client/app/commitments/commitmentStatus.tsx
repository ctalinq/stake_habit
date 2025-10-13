import { useTranslation } from "react-i18next";
import Loading from "./icons/loading.svg?react";
import Treasure from "./icons/treasure.svg?react";
import { TonConnectButton } from "~/containers";
import useCommitmentStatus from "~/hooks/useCommitmentStatus";
import useWallet from "~/hooks/useWallet";
import CommitmentStatusBadge from "~/containers/CommitmentStatusBadge";

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
  const wallet = useWallet();

  const commitmentStatus = useCommitmentStatus({
    status,
    dueDate,
  });

  return (
    <div>
      <CommitmentStatusBadge
        size="md"
        additionalCardClassName="w-24"
        status={commitmentStatus}
      />
      {!wallet && commitmentStatus === "failed" && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-red-500 text-2xl">{t("connectWallet")}</p>
          <TonConnectButton onConnectStart={() => {}} />
        </div>
      )}
      {commitmentStatus === "failed" &&
        wallet &&
        (!alreadyRewardedKeys.includes(commitmentKey) ? (
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
        ))}
    </div>
  );
};

export default CommitmentStatus;
