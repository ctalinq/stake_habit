import type { Sender, SenderArguments } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";

export function useTonSender(): { sender: Sender } {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000,
        });
      },
    },
  };
}
