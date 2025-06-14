import React, {useEffect} from "react";
import {useLaunchParams, backButton} from "@telegram-apps/sdk-react";
import {ThemeToggle} from "~/components";
import {useLocation, useNavigate} from "react-router";

const Navigation = () => {
  const launchParams = useLaunchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const canGoBack = location.key !== "default"

  useEffect(() => {
    if (canGoBack) {
      if (!backButton.isMounted()) {
        backButton.mount();
        backButton.onClick(() => navigate(-1))
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

  if (!launchParams?.tgWebAppData?.user) return null;

  return <div className="flex justify-between align-center">
    <img
      src={launchParams.tgWebAppData.user.photo_url}
      alt="User Avatar"
      className="w-12 h-12 avatar-ring"
    />
    <ThemeToggle />
  </div>
}

export default Navigation;