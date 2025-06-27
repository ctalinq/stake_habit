import React, { useState, useEffect } from "react";

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  maxLengthError?: string;
  minLengthError?: string;
  error?: string;
  good?: string;
  className?: string;
  minLength?: number;
  maxLength?: number;
  showCharCounter?: boolean;
  rows?: number;
}

export default function TextArea({
  value,
  onChange,
  placeholder,
  label,
  error,
  maxLengthError,
  minLengthError,
  good,
  className = "",
  minLength = 1,
  maxLength = 1000,
  showCharCounter = true,
  rows = 4,
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(value.length);
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    setCharCount(value.length);

    if (value.length > maxLength && maxLengthError) {
      setValidationError(maxLengthError);
    } else if (value.length < minLength && value.length > 0 && minLengthError) {
      setValidationError(minLengthError);
    } else {
      setValidationError("");
    }
  }, [value, minLength, maxLength]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const isValid = !validationError;
  const showError = error || validationError;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <label
          className={`absolute dark:bg-gray-900/60 left-3 transition-all duration-200 pointer-events-none z-1 ${
            focused || value
              ? "top-1 pt-1 text-xs text-blue-400 dark:text-white"
              : "top-1 pt-3 text-sm text-gray-400 dark:text-white"
          }`}
        >
          {label}
        </label>

        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? placeholder : ""}
          rows={rows}
          className={`w-full px-3 pt-6 pb-2 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 backdrop-blur-sm dark:backdrop-blur-md focus:outline-none focus:ring-0 resize-none ${
            focused
              ? "border-blue-400 dark:border-blue-400 shadow-lg shadow-blue-400/20 dark:shadow-blue-400/30 dark:bg-gray-800/80"
              : isValid
                ? "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800/70"
                : "border-red-400 dark:border-red-400"
          } ${showError ? "border-red-400 dark:border-red-400" : ""}`}
          maxLength={maxLength}
        />

        {showCharCounter && (
          <div
            className={`absolute right-3 top-3 text-xs font-medium transition-colors duration-200 ${
              charCount > maxLength * 0.9
                ? "text-orange-400 dark:text-orange-300"
                : charCount === maxLength
                  ? "text-red-400 dark:text-red-300"
                  : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>

      <div className="mt-2 min-h-5">
        {showError && (
          <div className="text-sm text-red-400 dark:text-red-300 flex items-center gap-1 animate-pulse">
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

        {isValid && value.length > 0 && !showError && (
          <div className="text-sm text-green-400 dark:text-green-300 flex items-center gap-1">
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
    </div>
  );
}
