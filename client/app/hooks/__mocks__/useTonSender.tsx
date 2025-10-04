import type { Sender, SenderArguments } from "@ton/core";

export function useTonSender(): { sender: Sender } {
  return {
    sender: {
      send: async (args: SenderArguments) => {
        new Promise((res) => res(args));
      },
    },
  };
}
