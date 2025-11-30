import React, { useLayoutEffect, useState } from "react";
import {
  useLaunchParams,
  backButton,
  viewport,
  swipeBehavior,
} from "@telegram-apps/sdk-react";
import { Container, ThemeToggle } from "~/components";
import { Outlet, useLocation, useNavigate } from "react-router";
import { TonConnectButton } from "~/containers";

export const NavbarHeader = ({
  isFullscreen,
  photoUrl,
}: {
  isFullscreen: boolean;
  photoUrl?: string;
}) => {
  return (
    <div
      className={`flex align-center ${isFullscreen ? "mt-25" : "mt-4"} mb-4`}
    >
      <img src={photoUrl} alt="User Avatar" className="w-12 h-12 avatar-ring" />
      <ThemeToggle />
      <TonConnectButton className="ml-auto" onConnectStart={() => {}} />
    </div>
  );
};

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
    if (swipeBehavior.enableVertical.isAvailable()) {
      swipeBehavior.disableVertical();
    }
  }, []);

  if (!launchParams?.tgWebAppData?.user) return null;

  return (
    <Container>
      <NavbarHeader
        isFullscreen={isFullscreen}
        photoUrl={launchParams.tgWebAppData.user.photo_url}
      />
      <Outlet />
    </Container>
  );
};

export default NavbarLayout;
