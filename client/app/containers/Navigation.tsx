import React from "react";
import {useLaunchParams} from "@telegram-apps/sdk-react";
import {ThemeToggle} from "~/components";

const Navigation = () => {
  const launchParams = useLaunchParams();
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