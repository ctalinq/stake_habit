import React, { useLayoutEffect, useState } from "react";
import {
  useLaunchParams,
  backButton,
  viewport,
} from "@telegram-apps/sdk-react";
import { Container, ThemeToggle } from "~/components";
import { Outlet, useLocation, useNavigate } from "react-router";
import { TonConnectButton } from "~/containers";

const NavbarLayout = () => {
  const launchParams = useLaunchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const canGoBack = location.key !== "default";
  const [isFullscreen, setIsFullscreen] = useState(false);

  useLayoutEffect(() => {
    if (canGoBack) {
      if (!backButton.isMounted()) {
        backButton.mount();
        backButton.onClick(() => navigate(-1));
      }
      if (!backButton.isVisible()) {
        backButton.show();
      }
    } else {
      if (backButton.isMounted()) {
        backButton.hide();
      }
    }
  }, [canGoBack]);

  useLayoutEffect(() => {
    if (viewport.mount.isAvailable()) {
      viewport.mount().then(() => {
        if (viewport.requestFullscreen.isAvailable()) {
          viewport.requestFullscreen().then(() => {
            if (viewport.isFullscreen()) setIsFullscreen(true);
          });
        }
      });
    }
  }, []);

  if (!launchParams?.tgWebAppData?.user) return null;

  return (
    <Container>
      <div
        className={`flex justify-between align-center ${
          isFullscreen ? "mt-25" : "mt-4"
        } mb-4`}
      >
        <img
          src={launchParams.tgWebAppData.user.photo_url}
          alt="User Avatar"
          className="w-12 h-12 avatar-ring"
        />
        <TonConnectButton />
        <ThemeToggle />
      </div>
      <Outlet />
    </Container>
  );
};

export default NavbarLayout;
