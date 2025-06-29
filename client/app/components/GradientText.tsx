import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export default function GradientText({
  children,
  className = "",
  variant = "primary",
  size = "md",
  as: Component = "span",
}: GradientTextProps) {
  const baseStyles = "bg-clip-text text-transparent font-bold";

  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };

  const variantStyles = {
    primary: "bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100",
    danger: "bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-300",
    success: "bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-300",
  };

  return (
    <Component className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {children}
    </Component>
  );
}
