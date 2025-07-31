import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import HomeSkeleton from "~/home/homeSkeleton";

export default function InitialRedirectLayout() {
  const launchParams = useLaunchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNeedToRedirect =
    !location.pathname.startsWith("/commitments") &&
    launchParams.tgWebAppStartParam;

  useEffect(() => {
    if (isNeedToRedirect) {
      const input = atob(launchParams.tgWebAppStartParam!);
      const result: Record<string, string> = {};

      input.split(";").forEach((pair) => {
        const [key, value] = pair.split("=");
        result[key] = value;
      });

      navigate(`/commitments/${result.commitment}?key=${result.key}`, {
        replace: true,
      });
    }
  }, []);

  return isNeedToRedirect ? <HomeSkeleton /> : <Outlet />;
}
