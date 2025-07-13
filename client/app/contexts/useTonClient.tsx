import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const TonClientContext = createContext<{ client: TonClient | null }>({
  client: null,
});

export const TonClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  console.log(import.meta.env.VITE_TON_NETWORK);
  const [tonClient, setTonClient] = useState<{ client: TonClient | null }>({
    client: null,
  });

  const initClient = useCallback(async () => {
    const endpoint = await getHttpEndpoint({
      network: import.meta.env.VITE_TON_NETWORK,
    });
    const client = new TonClient({
      endpoint,
    });

    setTonClient({ client });
  }, []);

  useEffect(() => {
    void initClient();
  }, []);

  return (
    <TonClientContext.Provider value={tonClient}>
      {children}
    </TonClientContext.Provider>
  );
};

export const useTonClient = (): TonClient | null => {
  const context = useContext(TonClientContext);
  if (!context) {
    throw new Error("useTonClient must be used within a TonClientProvider");
  }
  return context.client;
};
