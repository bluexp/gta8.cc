"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "en" | "zh";

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
      toggleLocale: () =>
        set((state) => ({ locale: state.locale === "en" ? "zh" : "en" })),
    }),
    {
      name: "gta8-cc-locale-v1",
    }
  )
);

/**
 * Hydration-safe hook: always returns "en" during SSR & initial client pass,
 * then reflects persisted user choice ("en" or "zh") without React mismatch warnings.
 */
export function useLocale(): {
  locale: Locale;
  isEn: boolean;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  t: <T>(en: T, zh: T) => T;
} {
  const storeLocale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const locale: Locale = mounted ? storeLocale : "en";

  useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
    }
  }, [locale, mounted]);

  return {
    locale,
    isEn: locale === "en",
    setLocale,
    toggleLocale,
    t: (en, zh) => (locale === "en" ? en : zh),
  };
}
