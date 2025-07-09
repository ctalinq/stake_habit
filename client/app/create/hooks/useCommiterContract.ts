import { Address, type OpenedContract } from "@ton/core";
import { CommiterContract } from "blockchain";
import { useCallback, useEffect, useState } from "react";
import { useTonClient } from "~/contexts/useTonClient";

export const useCommiterContract = () => {
  const tonClient = useTonClient();

  const [commiterContract, setCommiterContract] =
    useState<OpenedContract<CommiterContract> | null>(null);

  const initContract = useCallback(() => {
    if (tonClient) {
      const contract = new CommiterContract(
        Address.parse(import.meta.env.VITE_COMMITER_CONTRACT_ADDRESS)
      );

      setCommiterContract(
        tonClient.open(contract) as OpenedContract<CommiterContract>
      );
    }
  }, [tonClient]);

  useEffect(() => {
    if (!tonClient) return;

    initContract();
  }, [tonClient]);

  return commiterContract;
};
