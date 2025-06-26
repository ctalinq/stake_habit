import React, { useState } from "react";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  error?: string;
  good?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export default function DatePicker({
  value,
  onChange,
  label = "Date",
  className = "",
  error,
  good,
  minDate,
  maxDate,
  disabled = false,
}: DatePickerProps) {
  const [focused, setFocused] = useState(false);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const parseDateFromInput = (dateString: string): Date=> {
    return new Date(dateString);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    const date = parseDateFromInput(dateString);
    onChange(date);
  };

  const showError = error;
  const showGood = good && value && !showError;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <label
          className={
            "absolute left-3 top-2 text-sm transition-all duration-200 pointer-events-none z-10 text-gray-400 dark:text-white"
          }
        >
          {label}
        </label>

        <div
          className={`relative w-full min-h-12 px-3 pt-6 pb-2 pr-12 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 backdrop-blur-sm dark:backdrop-blur-md focus:outline-none focus:ring-0 ${
            disabled
              ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500"
              : focused
                ? "border-blue-400 dark:border-blue-400 shadow-lg shadow-blue-400/20 dark:shadow-blue-400/30 dark:bg-gray-800/80"
                : showError
                  ? "border-red-400 dark:border-red-400"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800/70"
          }`}
        >
          <input
            type="date"
            value={formatDateForInput(value)}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            min={minDate ? formatDateForInput(minDate) : undefined}
            max={maxDate ? formatDateForInput(maxDate) : undefined}
            className="w-full h-full"
          />
        </div>
      </div>

      {showError && (
        <div className="mt-2 text-sm text-red-400 dark:text-red-300 flex items-center gap-1 animate-pulse">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {showError}
        </div>
      )}

      {showGood && (
        <div className="mt-2 text-sm text-green-400 dark:text-green-300 flex items-center gap-1">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {good}
        </div>
      )}
    </div>
  );
}
