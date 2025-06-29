import "~/i18n";
import { init, isTMA } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import mockEnv from "./mockEnv";
import { Outlet } from "react-router";
import HomeSkeleton from "~/home/homeSkeleton";

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

  return <Outlet />;
}
