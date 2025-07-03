import "~/i18n";
import { init, isTMA } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import mockEnv from "./mockEnv";
import { Outlet } from "react-router";
import HomeSkeleton from "~/home/homeSkeleton";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { ThemeProvider } from "~/contexts/useTheme";

//todo - to env
const manifestUrl = "https://sh.devalchemy.online/manifest.json";

export default function ClientLayout() {
  const [isInitialized, setIsInitialized] = useState(false);

  const initialize = async () => {
    if (!(await isTMA("complete"))) {
      mockEnv();
    }

    if (import.meta.env.DEV) {
      const eruda = await import("eruda");
      eruda.default.init();
    }

    init();
    setIsInitialized(true);
  };

  useEffect(() => {
    initialize();
  }, []);

  if (!isInitialized) return <HomeSkeleton />;

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </TonConnectUIProvider>
  );
}
