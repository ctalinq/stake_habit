import React, { useState, useEffect } from "react";
import {useTranslation} from "react-i18next";

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export default function TitleInput({
  value,
  onChange,
  error,
  className = "",
}: TitleInputProps) {
  const { t } = useTranslation("create");

  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(value.length);
  const [validationError, setValidationError] = useState<string>("");

  const maxLength = 40;
  const minLength = 0;

  useEffect(() => {
    setCharCount(value.length);

    if (value.length > maxLength) {
      setValidationError(t("title.error.maxLength", { maxLength }));
    } else {
      setValidationError("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const isValid = !validationError && value.length >= minLength;
  const showError = error || validationError;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        <label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            focused || value
              ? "top-2 text-xs text-blue-400 dark:text-blue-300"
              : "top-4 text-sm text-gray-400 dark:text-gray-500"
          }`}
        >
          {t("title.label")}
        </label>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={focused ? t("title.placeholder") : ""}
          className={`w-full px-3 pt-6 pb-2 rounded-xl border-2 transition-all duration-200 bg-gray-50 dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 backdrop-blur-sm dark:backdrop-blur-md focus:outline-none focus:ring-0 ${
            focused
              ? "border-blue-400 dark:border-blue-400 shadow-lg shadow-blue-400/20 dark:shadow-blue-400/30 dark:bg-gray-800/80"
              : isValid
                ? "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-800/70"
                : "border-red-400 dark:border-red-400"
          } ${showError ? "border-red-400 dark:border-red-400" : ""}`}
          maxLength={maxLength}
        />

        <div
          className={`absolute right-3 top-6 text-xs font-medium transition-colors duration-200 ${
            charCount > maxLength * 0.9
              ? "text-orange-400 dark:text-orange-300"
              : charCount === maxLength
                ? "text-red-400 dark:text-red-300"
                : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {charCount}/{maxLength}
        </div>
      </div>

      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700/60 rounded-full h-1.5 overflow-hidden shadow-inner">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
            charCount > maxLength * 0.9
              ? "bg-gradient-to-r from-orange-400 to-orange-500 dark:from-orange-300 dark:to-orange-400"
              : charCount === maxLength
                ? "bg-gradient-to-r from-red-400 to-red-500 dark:from-red-300 dark:to-red-400"
                : "bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-400 dark:to-blue-300"
          }`}
          style={{ width: `${(charCount / maxLength) * 100}%` }}
        />
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

      {isValid && value.length > 0 && !showError && (
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
          {t("title.good")}
        </div>
      )}
    </div>
  );
}
