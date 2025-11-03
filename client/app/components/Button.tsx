import React from "react";
import Spinner from "./icons/spinner.svg?react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  isProcessing?: boolean;
}

export default function Button({
  children,
  disabled = false,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  isProcessing,
}: ButtonProps) {
  const baseStyles =
    "rounded-xl flex items-center font-medium transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-0";

  const sizeStyles = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-4",
    lg: "py-4 px-6 text-lg",
  };

  const variantStyles = {
    primary: disabled
      ? "bg-gray-200 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed backdrop-blur-sm"
      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-400 dark:to-blue-500 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white shadow-lg hover:shadow-xl dark:shadow-blue-500/25 hover:-translate-y-0.5",
    secondary: disabled
      ? "bg-gray-200 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed backdrop-blur-sm"
      : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 dark:from-gray-600 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    danger: disabled
      ? "bg-gray-200 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed backdrop-blur-sm"
      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-400 dark:to-red-500 dark:hover:from-red-500 dark:hover:to-red-600 text-white shadow-lg hover:shadow-xl dark:shadow-red-500/25 hover:-translate-y-0.5",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`,
        className
      )}
    >
      {isProcessing && (
        <div className="w-[24px] mr-2">
          <Spinner />
        </div>
      )}
      {children}
    </button>
  );
}
