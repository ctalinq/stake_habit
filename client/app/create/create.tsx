import { useState } from "react";
import { useTranslation } from "react-i18next";
import TitleInput from "./TitleInput";
import { Card, Button, TextArea } from "../components";

export default function Create() {
  const { t } = useTranslation("create");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (<Card>
    <div className="space-y-6">
      <TitleInput
        value={title}
        onChange={setTitle}
      />

      <TextArea
        value={description}
        onChange={setDescription}
        label={t("description.label")}
        placeholder={t("description.placeholder")}
        good={t("description.good")}
        maxLengthError={t("description.error.maxLength", { maxLength: 1000 })}
        minLengthError={t("description.error.minLength", { maxLength: 1 })}
        minLength={1}
        maxLength={1000}
        rows={5}
      />

      <Button
        disabled={!title.trim() || !description.trim()}
        className="w-full"
      >
        {t("create")}
      </Button>
    </div>
  </Card>);
}
