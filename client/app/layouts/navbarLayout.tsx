import React, { useLayoutEffect, useState, useRef } from "react";
import {
  useLaunchParams,
  backButton,
  viewport,
  swipeBehavior,
} from "@telegram-apps/sdk-react";
import { Container, Modal, ThemeToggle } from "~/components";
import Info from "~/layouts/icons/info.svg?react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { TonConnectButton } from "~/containers";

export const NavbarHeader = ({
  isFullscreen,
  photoUrl,
}: {
  isFullscreen: boolean;
  photoUrl?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

  return (
    <div
      className={`flex align-center ${isFullscreen ? "mt-25" : "mt-4"} mb-4`}
    >
      <img src={photoUrl} alt="User Avatar" className="w-12 h-12 avatar-ring" />
      <ThemeToggle />
      <button
        className="
          w-12 h-12 ml-2 flex items-center justify-center rounded-full
         bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/50 dark:border-gray-600/50 shadow-lg
         hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        onClick={() => setIsTutorialModalOpen(true)}
      >
        <Info className="w-7 h-7 dark:fill-blue-400" />
      </button>
      <TonConnectButton className="ml-auto" onConnectStart={() => {}} />
      <Modal
        showCloseButton={true}
        modalClassName="w-[90%]"
        isOpen={isTutorialModalOpen}
        onClose={() => setIsTutorialModalOpen(false)}
      >
        <video
          className="mt-4"
          ref={videoRef}
          src="/sh_intro.mp4"
          controls
          muted
        />
      </Modal>
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
