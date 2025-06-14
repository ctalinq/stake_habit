import { useState } from "react";
import { useTranslation } from "react-i18next";
import TitleInput from "./TitleInput";
import { Card, Button } from "../components";
import Navigation from "~/containers/Navigation";
import {Container} from "~/components";

export default function Create() {
  const { t } = useTranslation("create");
  const [title, setTitle] = useState("");

  return (
    <Container>
      <Navigation/>
      <Card>
        <div className="space-y-6">
          <TitleInput value={title} onChange={setTitle} />

          <Button disabled={!title.trim()} className="w-full">
            {t("create")}
          </Button>
        </div>
      </Card>
    </Container>
  );
}
