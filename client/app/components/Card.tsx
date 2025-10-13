import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={twMerge(
        "bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow dark:shadow-blue-500/10 p-6 border border-gray-200/50 dark:border-gray-600/50 ring-1 ring-white/20 dark:ring-gray-700/30",
        className
      )}
    >
      {children}
    </div>
  );
}
