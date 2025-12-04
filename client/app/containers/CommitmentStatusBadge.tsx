import type { CommitmentStatus } from "~/types";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

const statusToLocalizationKey: Record<CommitmentStatus, string> = {
  success: "commitment.status.success",
  failed: "commitment.status.failed",
  inProcess: "commitment.status.inProcess",
  unknown: "",
};

const CommitmentStatusBadge = ({
  status,
  additionalCardClassName,
  size = "sm",
}: {
  status: CommitmentStatus;
  additionalCardClassName?: string;
  size?: "md" | "sm";
}) => {
  const { t } = useTranslation("common");

  const cardClassName = twMerge(
    "flex items-center rounded",
    status === "success" && "bg-green-200/90",
    status === "failed" && "bg-red-200/90",
    status === "inProcess" && "bg-yellow-200/90",
    size === "sm" && "px-2 py-1",
    size === "md" && "px-4 py-2",
    additionalCardClassName
  );

  const rectangleClassName = twMerge(
    "shrink-0 mr-2",
    status === "success" && "bg-green-600",
    status === "failed" && "bg-red-600",
    status === "inProcess" && "bg-yellow-600",
    size === "sm" && "w-2 h-2",
    size === "md" && "w-4 h-4 rounded"
  );

  const textClassName = twMerge(
    "whitespace-nowrap",
    status === "success" && "text-green-600",
    status === "failed" && "text-red-600",
    status === "inProcess" && "text-yellow-600",
    size === "sm" && "text-xs",
    size === "md" && "text-sm"
  );

  console.log(size);

  return (
    <div className={cardClassName}>
      <span className={rectangleClassName} />
      <span className={textClassName}>
        {t(statusToLocalizationKey[status])}
      </span>
    </div>
  );
};

export default CommitmentStatusBadge;
