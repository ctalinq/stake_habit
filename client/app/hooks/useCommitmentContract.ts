import { Address, type OpenedContract } from "@ton/core";
import { CommitmentContract } from "blockchain/commitmentContract";
import { useEffect, useState } from "react";
import { useTonClient } from "~/hooks/useTonClient";

export const useCommitmentContract = (address: Address | null) => {
  const tonClient = useTonClient();
  const [commitmentContract, setCommitmentContract] =
    useState<OpenedContract<CommitmentContract> | null>(null);

  useEffect(() => {
    if (tonClient && address && !commitmentContract) {
      const contract = new CommitmentContract(address);

      setCommitmentContract(
        tonClient.open(contract) as OpenedContract<CommitmentContract>
      );
    }
  }, [tonClient, address]);

  return commitmentContract;
};

export default useCommitmentContract;
