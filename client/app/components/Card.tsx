import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-blue-500/10 p-6 border border-gray-200/50 dark:border-gray-600/50 ring-1 ring-white/20 dark:ring-gray-700/30 ${className}`}>
      {children}
    </div>
  );
}
