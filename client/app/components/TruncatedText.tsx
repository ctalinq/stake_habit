import React from "react";

interface TruncatedTextProps {
  children: React.ReactNode;
  maxLength?: number;
  maxLines?: number;
  className?: string;
  tooltipClassName?: string;
  showTooltip?: boolean;
}

export default function TruncatedText({
  children,
  className = "",
}: TruncatedTextProps) {
  const baseStyles = "relative inline-block";

  return <div className={`${baseStyles} ${className}`}>{children}</div>;
}
