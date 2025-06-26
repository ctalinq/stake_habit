import { useState } from "react";
import { useTranslation } from "react-i18next";
import TitleInput from "./TitleInput";
import { Card, Button, TextArea, DecimalInput } from "../components";

export default function Create() {
  const { t } = useTranslation("create");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stakeAmount, setStakeAmount] = useState<number | null>(null);

  return (
    <Card>
      <div className="space-y-6">
        <TitleInput value={title} onChange={setTitle} />

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

        <DecimalInput
          value={stakeAmount}
          onChange={setStakeAmount}
          min={10}
          max={100}
          label={t("stake.label")}
          placeholder={t("stake.placeholder")}
          naNError={t("stake.error.isNaN")}
          minError={t("stake.error.minError", { min: 10 })}
          maxError={t("stake.error.maxError", { max: 100 })}
          good={"stake.good"}
          // TON icon
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
            >
              <g id="surface1">
                <path
                  fill="#0098EA"
                  d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10m0 0"
                ></path>
                <path
                  fill="#FFF"
                  d="M13.414 5.582H6.586c-1.258 0-2.05 1.356-1.422 2.45l4.215 7.304a.718.718 0 0 0 1.242 0l4.215-7.305c.629-1.094-.164-2.449-1.422-2.449m-4.039 7.563-.918-1.778-2.215-3.96a.388.388 0 0 1 .344-.579h2.789Zm4.379-5.739-2.215 3.965-.918 1.774V6.828h2.793c.305 0 .484.324.34.578m0 0"
                ></path>
              </g>
            </svg>
          }
        />

        <Button
          disabled={
            !title.trim() ||
            !description.trim() ||
            stakeAmount === null ||
            stakeAmount < 10 ||
            stakeAmount > 100
          }
          className="w-full"
        >
          {t("create")}
        </Button>
      </div>
    </Card>
  );
}
