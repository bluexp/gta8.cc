"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Map,
  CheckSquare,
  Car,
  Crosshair,
  Sparkles,
  Gamepad2,
  BookOpen,
  Radio,
  Image as ImageIcon,
  Github,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProgressStore } from "@/store/useProgressStore";
import { useLocale } from "@/store/useLocaleStore";
import { MAP_MARKERS } from "@/data/markers";

const PRIMARY_LINKS = [
  { href: "/gta6/map", en: "Map", zh: "大地图", icon: Map, highlight: true },
  { href: "/gta6/wallpapers", en: "Wallpapers", zh: "壁纸", icon: ImageIcon },
  { href: "/gta6/intel", en: "Intel", zh: "情报", icon: Radio },
  { href: "/gta6/cheats", en: "Cheats", zh: "作弊码", icon: Gamepad2 },
  { href: "/gta6/guides", en: "Guides", zh: "攻略", icon: BookOpen },
];

const WIKI_LINKS = [
  {
    href: "/gta6/checklist",
    en: "100% Checklist",
    zh: "100% 完成度清单",
    descEn: "Two-way synced trophies & milestones",
    descZh: "与大地图双向联动的奖杯进度",
    icon: CheckSquare,
  },
  {
    href: "/gta6/vehicles",
    en: "Vehicles",
    zh: "载具图鉴",
    descEn: "Speed, handling & anti-theft tiers",
    descZh: "极速、操控与 1–5 级防盗参数",
    icon: Car,
  },
  {
    href: "/gta6/weapons",
    en: "Weapons",
    zh: "武器装备",
    descEn: "Damage stats, mods & Gun Van",
    descZh: "伤害面板、配件与军火车坐标",
    icon: Crosshair,
  },
  {
    href: "/gta6/collectibles",
    en: "Collectibles",
    zh: "全收集品",
    descEn: "WAiNK scans, stunts & packages",
    descZh: "WAiNK 扫描、特技飞跃与隐藏包裹",
    icon: Sparkles,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wikiOpen, setWikiOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { locale, setLocale, t } = useLocale();

  const completedCount = useProgressStore((s) => s.completedMarkers.length);
  const totalCount = MAP_MARKERS.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isWikiActive = WIKI_LINKS.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWikiOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0D0F14]/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand (compact single-line, never wraps) */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF2E93] to-[#00E5FF] font-black tracking-tighter text-[#0D0F14] shadow-[0_0_18px_rgba(255,46,147,0.45)] transition-transform group-hover:scale-105">
            G8
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-white">
              GTA8<span className="text-[#FF2E93]">.cc</span>
            </span>
            <span className="hidden rounded border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#00E5FF] sm:inline-block">
              GTA 6
            </span>
          </div>
        </Link>

        {/* Clean Desktop Navigation (5 top links + Wiki dropdown) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {PRIMARY_LINKS.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-[#FF2E93]/15 text-[#FF2E93] ring-1 ring-[#FF2E93]/40"
                    : item.highlight
                      ? "bg-white/5 text-white hover:bg-[#FF2E93]/20 hover:text-[#FF2E93]"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{t(item.en, item.zh)}</span>
              </Link>
            );
          })}

          {/* Wiki Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setWikiOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all",
                isWikiActive || wikiOpen
                  ? "bg-[#00E5FF]/15 text-[#00E5FF] ring-1 ring-[#00E5FF]/40"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Car className="h-4 w-4 shrink-0" />
              <span>{t("Wiki", "全图鉴")}</span>
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform", wikiOpen && "rotate-180")}
              />
            </button>

            {wikiOpen && (
              <div className="absolute left-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-white/15 bg-[#141822]/98 p-2 shadow-2xl backdrop-blur-xl">
                {WIKI_LINKS.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setWikiOpen(false)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl px-3 py-2.5 transition",
                        active
                          ? "bg-[#FF2E93]/15 text-[#FF2E93]"
                          : "text-zinc-200 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#00E5FF]" />
                      <div>
                        <div className="text-xs font-bold">{t(item.en, item.zh)}</div>
                        <div className="text-[11px] text-zinc-400">
                          {t(item.descEn, item.descZh)}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {PRIMARY_LINKS.slice(3).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-[#FF2E93]/15 text-[#FF2E93] ring-1 ring-[#FF2E93]/40"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{t(item.en, item.zh)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls (compact, single-line, zero wrap) */}
        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          {/* EN / 中文 Switcher */}
          <div
            className="flex shrink-0 items-center rounded-full border border-white/15 bg-[#161922] p-0.5 text-xs font-bold"
            role="group"
            aria-label="Language switcher"
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-1 transition",
                locale === "en"
                  ? "bg-[#00E5FF] text-[#0D0F14]"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("zh")}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-1 transition",
                locale === "zh"
                  ? "bg-[#FF2E93] text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              中文
            </button>
          </div>

          {/* Compact GitHub Icon Button */}
          <a
            href="https://github.com/bluexp/gta8.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#161922] text-zinc-200 transition hover:border-[#00E5FF]/60 hover:text-[#00E5FF]"
            title={t("Open Source on GitHub (MIT)", "GitHub 开源仓库 (MIT)")}
            aria-label="GitHub Repository"
          >
            <Github className="h-4 w-4" />
          </a>

          {/* Progress Pill */}
          <Link
            href="/gta6/checklist"
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-[#161922] px-3 py-1.5 text-xs transition hover:border-[#00E5FF]/50 xl:flex"
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
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#161922] text-zinc-200 lg:hidden"
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
            {[...PRIMARY_LINKS, ...WIKI_LINKS].map((item) => {
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
