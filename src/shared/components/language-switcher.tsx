"use client";

import { changeLanguage, useLocale } from "@/shared";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value as "en" | "ko");
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      className={`px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
      <option value="en">🇺🇸 English</option>
      <option value="ko">🇰🇷 한국어</option>
    </select>
  );
}
