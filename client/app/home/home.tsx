import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useRawInitData } from "@telegram-apps/sdk-react";
import { useTonWallet } from "@tonconnect/ui-react";
import { useTranslation } from "react-i18next";

import { Card, Link } from "~/components";
import CommitmentRow from "./commitmentRow";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CommitmentDTO, VisitorDTO } from "~/types";

export default function Home() {
  const { t } = useTranslation("home");
  const wallet = useTonWallet();
  const initData = useRawInitData();

  const {
    data: commitmentsData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<CommitmentDTO[]>({
    enabled: !!wallet?.account.address,
    queryKey: ["commitments", wallet?.account.address.toString()],
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage || lastPage?.length === 0) {
        return undefined;
      }
      return (lastPageParam as number) + 1;
    },
    queryFn: async ({ pageParam }) => {
      if (wallet?.account) {
        const response = await fetch(
          `/api/commitments?walletAddress=${btoa(
            wallet.account.address
          )}&page=${pageParam}`,
          {
            headers: {
              Authorization: `tma ${initData}`,
            },
          }
        );
        const data = await response.json();
        return data;
      }

      return [];
    },
  });

  const [visitorsMap, setVisitorsMap] = useState<Record<string, VisitorDTO[]>>(
    {}
  );

  const commitments = useMemo(() => {
    return commitmentsData?.pages.flat().filter((commitment) => !!commitment);
  }, [commitmentsData]);

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
    },
  });

  const scrollHandler = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= docHeight) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage]);

  useEffect(() => {
    window?.document.addEventListener("scroll", scrollHandler);

    return () => {
      window?.document.removeEventListener("scroll", scrollHandler);
    };
  }, [scrollHandler]);

  return (
    <>
      <Card className="mb-4">
        <div className="space-y-6">
          <Link
            to="/create"
            className="block w-full btn-base btn-primary text-center py-3 px-4"
            viewTransition
          >
            {t("commit")}
          </Link>
        </div>
      </Card>
      {commitments && commitments.length > 0 && (
        <Card className="space-y-16 pb-18">
          <h2 className="text-xl text-blue-400 dark:text-white font-bold mb-4">
            {t("yourCommitments.title")}
          </h2>
          {commitments.map((commitment) => (
            <CommitmentRow
              key={commitment.commitment_address}
              commitmentAddress={commitment.commitment_address}
              visitors={visitorsMap[commitment.commitment_address]}
            />
          ))}
        </Card>
      )}
    </>
  );
}
