import { useMemo } from "react";
import type { CommitmentStatus } from "~/types";

export const useCommitmentStatus = ({
  status,
  dueDate,
}: {
  status: number;
  dueDate: number;
}): CommitmentStatus => {
  return useMemo((): CommitmentStatus => {
    if (status === 0 && dueDate * 1000 > Date.now()) return "inProcess";
    if (status === 1) return "success";
    if (status === 2 || (status === 0 && dueDate * 1000 < Date.now()))
      return "failed";
    return "unknown";
  }, [status, dueDate]);
};
