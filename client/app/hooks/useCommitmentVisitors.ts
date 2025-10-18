import { useQuery, type InfiniteData } from "@tanstack/react-query";
import { useRawInitData } from "@telegram-apps/sdk-react";
import { useState } from "react";
import type { CommitmentDTO, VisitorDTO } from "~/types";

const useCommitmentVisitors = ({
  commitments,
  commitmentsData,
}: {
  commitments: CommitmentDTO[] | undefined;
  commitmentsData: InfiniteData<CommitmentDTO[]> | undefined;
}) => {
  const initData = useRawInitData();

  const [visitorsMap, setVisitorsMap] = useState<Record<string, VisitorDTO[]>>(
    {}
  );

  useQuery({
    enabled: !!commitments?.length,
    queryKey: ["visitors", commitments?.length],
    queryFn: async () => {
      if (!commitmentsData) return [];
      const page = commitmentsData.pages[commitmentsData.pages.length - 1];

      const response = await fetch(
        `/api/visitors?commitmentAddresses=${page
          .map((commitment) => commitment.commitment_address)
          .join(",")}`,
        {
          headers: {
            Authorization: `tma ${initData}`,
          },
        }
      );

      const result: VisitorDTO[] = await response.json();
      const grouped = result.reduce<Record<string, VisitorDTO[]>>(
        (acc, visitor) => {
          if (!acc[visitor.commitment_address])
            acc[visitor.commitment_address] = [];
          acc[visitor.commitment_address].push(visitor);
          return acc;
        },
        {}
      );

      setVisitorsMap({
        ...visitorsMap,
        ...grouped,
      });

      return 1;
    },
  });

  return {
    visitorsMap,
  };
};

export default useCommitmentVisitors;
