import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  centerContent?: boolean;
}

export default function Container({
  children,
  className = "",
  maxWidth = "md",
  centerContent = true,
}: ContainerProps) {
  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const baseStyles = "min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 p-4";
  const contentStyles = centerContent ? "mx-auto pt-2" : "";

  return (
    <div className={`${baseStyles} ${className}`}>
      <div className={`${maxWidthStyles[maxWidth]} ${contentStyles}`}>
        {children}
      </div>
    </div>
  );
}
