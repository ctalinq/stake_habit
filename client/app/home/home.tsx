import { useTranslation } from "react-i18next";

import { Card, Link } from "~/components";

export default function Home() {
  const { t } = useTranslation("home");

  return (
    <Card>
      <div className="space-y-6">
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
