"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Map,
  CheckSquare,
  Car,
  Crosshair,
  Sparkles,
  Gamepad2,
  BookOpen,
  Radio,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/store/useProgressStore";
import { useLocale } from "@/store/useLocaleStore";
import { MAP_MARKERS } from "@/data/markers";

const NAV_LINKS = [
  { href: "/gta6/map", en: "Map", zh: "大地图", icon: Map, highlight: true },
  { href: "/gta6/intel", en: "Intel", zh: "实时情报", icon: Radio },
  { href: "/gta6/checklist", en: "100%", zh: "100% 清单", icon: CheckSquare },
  { href: "/gta6/vehicles", en: "Vehicles", zh: "载具", icon: Car },
  { href: "/gta6/weapons", en: "Weapons", zh: "武器", icon: Crosshair },
  { href: "/gta6/collectibles", en: "Collectibles", zh: "收集品", icon: Sparkles },
  { href: "/gta6/cheats", en: "Cheats", zh: "作弊码", icon: Gamepad2 },
  { href: "/gta6/guides", en: "Guides", zh: "攻略/计算器", icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { locale, setLocale, t } = useLocale();
  const completedCount = useProgressStore((s) => s.completedMarkers.length);
  const totalCount = MAP_MARKERS.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0F14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF2E93] to-[#00E5FF] font-black tracking-tighter text-[#0D0F14] shadow-[0_0_18px_rgba(255,46,147,0.45)] transition-transform group-hover:scale-105">
            G8
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white">
                GTA8<span className="text-[#FF2E93]">.cc</span>
              </span>
              <span className="hidden rounded border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#00E5FF] sm:inline-block">
                GTA 6
              </span>
            </div>
            <p className="hidden text-[11px] text-zinc-400 xl:block">
              {t("Leonida Interactive Map & Wiki", "GTA 吧 · 雷奥奈达交互地图与全图鉴")}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all xl:px-3 xl:text-sm",
                  active
                    ? "bg-[#FF2E93]/15 text-[#FF2E93] ring-1 ring-[#FF2E93]/40"
                    : item.highlight
                      ? "bg-white/5 text-white hover:bg-[#FF2E93]/20 hover:text-[#FF2E93]"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5 xl:h-4 xl:w-4" />
                <span>{t(item.en, item.zh)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Language Toggle + Progress Pill + Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* EN / 中文 Switcher */}
          <div
            className="flex items-center rounded-full border border-white/15 bg-[#161922] p-0.5 text-[11px] font-bold"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 transition",
                locale === "en"
                  ? "bg-[#00E5FF] text-[#0D0F14]"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              <Globe className="h-3 w-3" />
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("zh")}
              className={cn(
                "rounded-full px-2.5 py-1 transition",
                locale === "zh"
                  ? "bg-[#FF2E93] text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              中文
            </button>
          </div>

          <Link
            href="/gta6/checklist"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-[#161922] px-3 py-1.5 text-xs transition hover:border-[#00E5FF]/50 sm:flex"
            title={t("View your exploration progress", "查看个人探索进度")}
          >
            <span className="h-2 w-2 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
            <span className="font-mono font-bold text-[#00E5FF]">
              {completedCount}/{totalCount}
            </span>
            <span className="text-zinc-500">({pct}%)</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#161922] text-zinc-200 lg:hidden"
            aria-label={t("Toggle navigation menu", "切换导航菜单")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#12151E] px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium",
                    active
                      ? "border-[#FF2E93]/50 bg-[#FF2E93]/15 text-[#FF2E93]"
                      : "border-white/5 bg-[#161922] text-zinc-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(item.en, item.zh)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
