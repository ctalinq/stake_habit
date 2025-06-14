import { useTranslation } from "react-i18next";

import {Container, Card, Link} from "~/components";
import Navigation from "~/containers/Navigation";

export default function Home() {
  const { t } = useTranslation("home");

  return (
    <Container>
      <Navigation/>
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
    </Container>
  );
}
