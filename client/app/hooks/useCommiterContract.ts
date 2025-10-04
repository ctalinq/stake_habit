import { Address, type OpenedContract } from "@ton/core";
import { CommiterContract } from "blockchain/commiterContract";
import { useEffect, useState } from "react";
import { useTonClient } from "~/hooks/useTonClient";

export const useCommiterContract = () => {
  const tonClient = useTonClient();

  const [commiterContract, setCommiterContract] =
    useState<OpenedContract<CommiterContract> | null>(null);

  useEffect(() => {
    if (tonClient) {
      const contract = new CommiterContract(
        Address.parse(import.meta.env.VITE_COMMITER_CONTRACT_ADDRESS)
      );

      setCommiterContract(
        tonClient.open(contract) as OpenedContract<CommiterContract>
      );
    }
  }, [tonClient]);

  return commiterContract;
};
