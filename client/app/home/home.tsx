import { useTranslation } from "react-i18next";

import { Card, GradientText, Link } from "../components";

export default function Home() {
  const { t } = useTranslation("home");

  return (
    <Card>
      <div className="space-y-6">
        <div className="text-center">
          <GradientText as="h1" size="2xl" className="mb-4">
            Welcome to Stake Habit
          </GradientText>
        </div>

        <Link
          to="/create"
          className="block w-full btn-base btn-primary text-center py-3 px-4"
        >
          {t("commit")}
        </Link>
      </div>
    </Card>
  );
}
