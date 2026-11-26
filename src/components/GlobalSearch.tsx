"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search, MapPin, Car, Crosshair, Gamepad2, BookOpen, CornerDownLeft } from "lucide-react";
import type { SearchIndexItem } from "@/types/gta";
import { MAP_MARKERS } from "@/data/markers";
import { VEHICLES } from "@/data/vehicles";
import { WEAPONS } from "@/data/weapons";
import { CHEAT_CODES } from "@/data/cheats";
import { GUIDE_ARTICLES } from "@/data/guides";
import { cn } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";

function buildFallbackIndex(): SearchIndexItem[] {
  return [
    ...MAP_MARKERS.map((m) => ({
      id: m.id,
      type: "marker" as const,
      titleZh: m.titleZh,
      titleEn: m.titleEn,
      pinyin: "",
      category: m.category,
      region: m.regionEn,
      href: `/gta6/map?x=${m.x}&y=${m.y}&marker=${encodeURIComponent(m.id)}`,
      coords: { x: m.x, y: m.y },
    })),
    ...VEHICLES.map((v) => ({
      id: v.id,
      type: "vehicle" as const,
      titleZh: v.titleZh,
      titleEn: v.titleEn,
      pinyin: "",
      category: v.categoryEn,
      href: `/gta6/vehicles/${v.slug}`,
    })),
    ...WEAPONS.map((w) => ({
      id: w.id,
      type: "weapon" as const,
      titleZh: w.titleZh,
      titleEn: w.titleEn,
      pinyin: "",
      category: w.categoryEn,
      href: `/gta6/weapons/${w.slug}`,
    })),
    ...CHEAT_CODES.map((c) => ({
      id: c.id,
      type: "cheat" as const,
      titleZh: c.titleZh,
      titleEn: c.titleEn,
      pinyin: "",
      category: c.category,
      href: `/gta6/cheats#${c.id}`,
    })),
    ...GUIDE_ARTICLES.map((g) => ({
      id: `guide-${g.slug}`,
      type: "guide" as const,
      titleZh: g.titleZh,
      titleEn: g.titleEn,
      pinyin: "",
      category: g.category,
      href: `/gta6/guides#${g.slug}`,
    })),
  ];
}

const TYPE_BADGE: Record<
  SearchIndexItem["type"],
  { en: string; zh: string; color: string; icon: typeof MapPin }
> = {
  marker: { en: "Marker", zh: "地图点位", color: "text-[#FF2E93] bg-[#FF2E93]/15", icon: MapPin },
  vehicle: { en: "Vehicle", zh: "载具图鉴", color: "text-[#00E5FF] bg-[#00E5FF]/15", icon: Car },
  weapon: { en: "Weapon", zh: "武器库", color: "text-[#A855F7] bg-[#A855F7]/15", icon: Crosshair },
  cheat: { en: "Cheat", zh: "作弊码", color: "text-[#FFB800] bg-[#FFB800]/15", icon: Gamepad2 },
  guide: { en: "Guide", zh: "攻略", color: "text-emerald-400 bg-emerald-500/15", icon: BookOpen },
};

const QUICK_TAGS_EN = ["WAiNK", "Cheetah", "Banshee", "Gun Van", "Invincibility", "Stunt Jump", "Alligator"];
const QUICK_TAGS_ZH = ["WAiNK", "猎豹", "Cheetah", "黑市军火", "无敌", "特技飞跃", "短吻鳄"];

export function GlobalSearch({ className }: { className?: string }) {
  const router = useRouter();
  const { isEn, t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [items, setItems] = useState<SearchIndexItem[]>(() => buildFallbackIndex());

  useEffect(() => {
    let mounted = true;
    fetch("/search-index.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SearchIndexItem[] | null) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "titleEn", weight: 0.45 },
          { name: "titleZh", weight: 0.35 },
          { name: "pinyin", weight: 0.1 },
          { name: "region", weight: 0.06 },
          { name: "category", weight: 0.04 },
        ],
        threshold: 0.36,
        ignoreLocation: true,
      }),
    [items]
  );

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return items.slice(0, 7);
    return fuse.search(trimmed, { limit: 9 }).map((r) => r.item);
  }, [fuse, items, query]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const quickTags = isEn ? QUICK_TAGS_EN : QUICK_TAGS_ZH;

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-center rounded-2xl border border-white/15 bg-[#161922]/95 px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition focus-within:border-[#00E5FF] focus-within:shadow-[0_0_24px_rgba(0,229,255,0.22)]">
        <Search className="mr-3 h-5 w-5 shrink-0 text-[#00E5FF]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(0);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIdx((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && results[activeIdx]) {
              e.preventDefault();
              navigate(results[activeIdx].href);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={t(
            "Search markers, vehicles, weapons, cheats (EN / 中文): Cheetah, WAiNK, Gun Van...",
            "搜索中文 / 英文 / 拼音首字母：猎豹、WAiNK、Cheetah、无敌、lbjdb..."
          )}
          className="w-full bg-transparent text-sm text-white placeholder-zinc-400 outline-none sm:text-base"
        />
        <kbd className="hidden rounded-md border border-white/15 bg-[#0D0F14] px-2 py-0.5 font-mono text-xs text-zinc-400 sm:inline-block">
          /
        </kbd>
      </div>

      {/* Quick search tags */}
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-zinc-500">{t("Trending:", "热门检索：")}</span>
        {quickTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              setQuery(tag);
              setOpen(true);
              inputRef.current?.focus();
            }}
            className="rounded-full border border-white/10 bg-[#161922] px-2.5 py-0.5 text-zinc-300 transition hover:border-[#FF2E93]/60 hover:text-[#FF2E93]"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Dropdown results */}
      {open && (
        <div className="absolute left-0 right-0 top-[62px] z-40 overflow-hidden rounded-2xl border border-white/15 bg-[#141822]/98 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] text-zinc-400">
            <span>
              {query.trim()
                ? t(
                    `${results.length} bilingual matches (instant Fuse.js index)`,
                    `匹配到 ${results.length} 条双语结果（本地零延迟 Fuse.js 引擎）`
                  )
                : t("Featured locations & wiki entries", "热门点位与图鉴推荐")}
            </span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <CornerDownLeft className="h-3 w-3" /> {t("Enter to open", "回车直达")}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-400">
              {t(
                `No results found for "${query}". You can submit new coordinates on the map.`,
                `未找到“${query}”相关词条，可前往大地图提交社区点位投稿。`
              )}
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-white/5">
              {results.map((item, idx) => {
                const badge = TYPE_BADGE[item.type];
                const Icon = badge.icon;
                return (
                  <li key={`${item.type}-${item.id}`}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        navigate(item.href);
                      }}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition",
                        idx === activeIdx ? "bg-white/10" : "hover:bg-white/5"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold",
                              badge.color
                            )}
                          >
                            <Icon className="h-3 w-3" />
                            {t(badge.en, badge.zh)}
                          </span>
                          <span className="truncate text-sm font-semibold text-white">
                            {isEn ? item.titleEn || item.titleZh : item.titleZh}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-zinc-400">
                          {isEn ? item.titleZh : item.titleEn}
                          {item.region ? ` · ${item.region}` : ""}
                        </p>
                      </div>
                      {item.coords && (
                        <span className="shrink-0 rounded bg-[#0D0F14] px-2 py-1 font-mono text-[11px] text-[#00E5FF]">
                          X {item.coords.x}, Y {item.coords.y}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
