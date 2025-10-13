import { useMemo } from "react";
import type { CommitmentStatus } from "~/types";

const useCommitmentStatus = (
  commitmentData:
    | {
        status: number;
        dueDate: number;
      }
    | null
    | undefined
): CommitmentStatus => {
  return useMemo((): CommitmentStatus => {
    if (!commitmentData) return "unknown";
    const { status, dueDate } = commitmentData;

    if (status === 0 && dueDate * 1000 > Date.now()) return "inProcess";
    if (status === 1) return "success";
    if (status === 2 || (status === 0 && dueDate * 1000 < Date.now()))
      return "failed";
    return "unknown";
  }, [commitmentData?.dueDate, commitmentData?.status]);
};

export default useCommitmentStatus;
