"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Circle, MapPin, Sparkles } from "lucide-react";
import { MAP_MARKERS } from "@/data/markers";
import { MARKER_DESC_EN } from "@/data/en-copy";
import { SUBTYPE_META } from "@/lib/categories";
import { useProgressStore } from "@/store/useProgressStore";
import { useLocale } from "@/store/useLocaleStore";
import { cn, formatCoords } from "@/lib/utils";
import type { MarkerSubType } from "@/types/gta";

const COLLECTIBLE_TYPES: MarkerSubType[] = [
  "waink_scan",
  "stunt_jump",
  "hidden_package",
  "neon_magazine",
];

export function CollectiblesClient() {
  const { isEn, t } = useLocale();
  const [activeType, setActiveType] = useState<"all" | MarkerSubType>("all");
  const completedMarkers = useProgressStore((s) => s.completedMarkers);
  const toggleMarker = useProgressStore((s) => s.toggleMarker);

  const collectibleMarkers = MAP_MARKERS.filter((m) => m.category === "collectible");
  const filtered =
    activeType === "all"
      ? collectibleMarkers
      : collectibleMarkers.filter((m) => m.subType === activeType);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#FF2E93]">
            <Sparkles className="h-3.5 w-3.5" /> GTA 6 COLLECTIBLES GUIDE
          </span>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            {t("Leonida Collectibles & Coordinates", "雷奥奈达全收集品图文坐标库")}
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {t(
              "Track WAiNK Scans, Stunt Jumps, Hidden Packages, and Neon Magazines—synced with the interactive map.",
              "涵盖 WAiNK 扫描点、特技飞跃、水下隐藏包裹与霓虹杂志，勾选状态与交互大地图完全同步。"
            )}
          </p>
        </div>

        <Link
          href="/gta6/map?category=collectible"
          className="neon-pink-glow inline-flex items-center gap-1.5 rounded-xl bg-[#FF2E93] px-4 py-2.5 text-xs font-bold text-white"
        >
          <MapPin className="h-4 w-4" />{" "}
          {t("View All Collectibles on Map", "在大地图查看全部收集点")}
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {COLLECTIBLE_TYPES.map((st) => {
          const meta = SUBTYPE_META[st];
          const all = collectibleMarkers.filter((m) => m.subType === st);
          const done = all.filter((m) => completedMarkers.includes(m.id)).length;
          const pct = all.length > 0 ? Math.round((done / all.length) * 100) : 0;
          const selected = activeType === st;

          return (
            <button
              key={st}
              type="button"
              onClick={() => setActiveType(selected ? "all" : st)}
              className={cn(
                "rounded-2xl border p-4 text-left transition",
                selected
                  ? "border-[#FF2E93] bg-[#FF2E93]/15"
                  : "border-white/10 bg-[#161922] hover:border-white/25"
              )}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">
                  {isEn ? meta.labelEn : meta.labelZh}
                </span>
                <span className="font-mono text-[#00E5FF]">
                  {done}/{all.length}
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-zinc-400">
                {isEn ? meta.labelZh : meta.labelEn}
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FF2E93] to-[#00E5FF]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((m) => {
          const done = completedMarkers.includes(m.id);
          return (
            <div
              key={m.id}
              className={cn(
                "flex flex-col justify-between rounded-2xl border p-5 transition",
                done
                  ? "border-[#00E5FF]/30 bg-[#121822]/80 opacity-75"
                  : "border-white/10 bg-[#161922]"
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-[#FF2E93]/15 px-2 py-0.5 text-[10px] font-bold text-[#FF2E93]">
                        {isEn ? SUBTYPE_META[m.subType].labelEn : SUBTYPE_META[m.subType].labelZh}
                      </span>
                      <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-zinc-300">
                        {isEn ? m.regionEn : m.region}
                      </span>
                    </div>
                    <h2
                      className={cn(
                        "mt-2 text-base font-bold",
                        done ? "text-zinc-400 line-through" : "text-white"
                      )}
                    >
                      {isEn ? m.titleEn : m.titleZh}
                    </h2>
                    <p className="font-mono text-[11px] text-zinc-500">
                      {isEn ? m.titleZh : m.titleEn}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleMarker(m.id)}
                    className="shrink-0 text-zinc-400 hover:text-[#00E5FF]"
                    aria-label={done ? t("Unmark", "取消打卡") : t("Mark collected", "标记为已收集")}
                  >
                    {done ? (
                      <CheckCircle2 className="h-6 w-6 text-[#00E5FF]" />
                    ) : (
                      <Circle className="h-6 w-6 hover:text-[#FF2E93]" />
                    )}
                  </button>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-zinc-300">
                  {isEn ? MARKER_DESC_EN[m.id] ?? m.descriptionMd : m.descriptionMd}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
                <span className="font-mono text-[11px] text-zinc-400">
                  {formatCoords(m.x, m.y)}
                </span>
                <Link
                  href={`/gta6/map?x=${m.x}&y=${m.y}&marker=${encodeURIComponent(m.id)}`}
                  className="inline-flex items-center gap-1 font-semibold text-[#00E5FF] hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" /> {t("Fly to Map Pin", "飞往大地图坐标")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
