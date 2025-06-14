import React, {Suspense} from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import {
  backButton as telegramBackButton,
  init as initTelegramSdk, useLaunchParams,
} from "@telegram-apps/sdk-react";
import "./i18n"
import HomeSkeleton from "./home/homeSkeleton";
import {Container,ThemeToggle} from "~/components";

initTelegramSdk();
telegramBackButton.mount()

if (import.meta.env.DEV) {
  import("eruda").then((eruda) => {
    eruda.default.init();
  });
}

const Top = () => {
  const launchParams = useLaunchParams();
  if (!launchParams?.tgWebAppData?.user) return <HomeSkeleton />;

  return <div className="flex justify-between align-center">
    <img
      src={launchParams.tgWebAppData.user.photo_url}
      alt="User Avatar"
      className="w-12 h-12 avatar-ring"
    />
  </div>
}



ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <Suspense fallback={<HomeSkeleton />}>
      <Container>
        <Top />
        <HydratedRouter />
        <ThemeToggle />
      </Container>
    </Suspense>
  </React.StrictMode>
);
