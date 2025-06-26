import React, { useState, useEffect } from "react";

interface DecimalInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
  icon?: React.ReactNode;
  error?: string;
  naNError: string;
  minError: string;
  maxError: string;
  good?: string;
}

export default function DecimalInput({
  value,
  onChange,
  label = "Amount",
  placeholder = "15.00",
  min = 1,
  max = 100,
  className = "",
  error,
  naNError,
  icon,
  minError,
  maxError,
  good,
}: DecimalInputProps) {
  const [focused, setFocused] = useState(false);
  const [dirtyValue, setDirtyValue] = useState(value ? value.toString() : "");
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    const numValue = parseFloat(dirtyValue);

    if (isNaN(numValue)) {
      setValidationError(naNError);
    } else if (numValue < min) {
      setValidationError(minError);
    } else if (numValue > max) {
      setValidationError(maxError);
    } else {
      setValidationError("");
    }
  }, [dirtyValue, min, max]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    setDirtyValue(rawValue);
  };

  const handleBlur = () => {
    setFocused(false);
    if (!validationError) {
      const numValue = parseFloat(dirtyValue);
      onChange(numValue);
    }
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const isValid = !validationError && !isNaN(parseFloat(dirtyValue));
  const showError = error || validationError;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
            focused || dirtyValue
              ? "top-2 text-xs text-blue-400 dark:text-white"
              : "top-4 text-sm text-gray-400 dark:text-white"
          }`}
        >
          {label}
        </label>

        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={dirtyValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={focused ? placeholder : ""}
            className={`w-full px-3 pt-6 pb-2 pr-12 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 backdrop-blur-sm dark:backdrop-blur-md focus:outline-none focus:ring-0 font-mono text-lg ${
              focused
                ? "border-blue-400 dark:border-blue-400 shadow-lg shadow-blue-400/20 dark:shadow-blue-400/30 dark:bg-gray-800/80"
                : isValid || dirtyValue.trim() === ""
                  ? "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800/70"
                  : "border-red-400 dark:border-red-400"
            } ${
              showError && dirtyValue.trim() !== ""
                ? "border-red-400 dark:border-red-400"
                : ""
            }`}
          />

          {/* Decimal Icon */}
          <div className="absolute right-3 top-6">{icon}</div>
        </div>
      </div>

      {showError && dirtyValue.trim() !== "" && (
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

      {isValid && !showError && validationError && (
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
