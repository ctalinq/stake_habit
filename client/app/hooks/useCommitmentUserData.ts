import { useQuery } from "@tanstack/react-query";
import { useRawInitData } from "@telegram-apps/sdk-react";
import type { OpenedContract } from "@ton/core";
import type { CommitmentContract } from "blockchain/commitmentContract";

export const useCommitmentUserData = (
  contract: OpenedContract<CommitmentContract> | null
) => {
  const initData = useRawInitData();

  const { data } = useQuery({
    queryKey: ["commitment_user_data"],
    queryFn: async () => {
      const response = await fetch(
        `/api/commitments/${contract?.address?.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `tma ${initData}`,
          },
        }
      );

      return await response.json();
    },
  });

  return { data };
};
