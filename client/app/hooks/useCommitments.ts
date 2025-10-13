import { useInfiniteQuery } from "@tanstack/react-query";
import { useRawInitData } from "@telegram-apps/sdk-react";
import {
  useCallback,
  useEffect,
  useMemo,
} from "storybook/internal/preview-api";
import useWallet from "~/hooks/useWallet";
import type { CommitmentDTO } from "~/types";

const useCommitments = () => {
  const wallet = useWallet();
  const initData = useRawInitData();

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery<CommitmentDTO[]>({
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

  const commitments = useMemo(() => {
    return data?.pages.flat().filter((commitment) => !!commitment);
  }, [data]);

  return {
    data,
    commitments,
  };
};

export default useCommitments;
