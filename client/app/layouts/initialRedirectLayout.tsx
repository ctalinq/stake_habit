import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { useLocation } from "react-router";
import HomeSkeleton from "~/home/homeSkeleton";

export default function InitialRedirectLayout() {
  const launchParams = useLaunchParams();
  const location = useLocation();
  const navigate = useNavigate();
  //shdev.devalchemy.online/commitments
  const [isInitialized, setIsInitialized] = useState(
    !launchParams.tgWebAppStartParam ||
      location.pathname.includes("commitments")
  );

  useEffect(() => {
    if (launchParams.tgWebAppStartParam) {
      const input = atob(launchParams.tgWebAppStartParam);
      const result: Record<string, string> = {};

      input.split(";").forEach((pair) => {
        const [key, value] = pair.split("=");
        result[key] = value;
      });

      navigate(`/commitments/${result.commitment}?key=${result.key}`, {
        replace: true,
      });

      setIsInitialized(true);
    }
  }, [location.pathname, navigate]);

  if (!isInitialized) return <HomeSkeleton />;

  return <Outlet />;
}
