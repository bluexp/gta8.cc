"use client";

import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { MapMarker } from "@/types/gta";
import { buildLeonidaSvgDataUrl } from "./leonidaBasemap";
import { formatCoords } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";

interface MiniLocatorMapProps {
  markers: MapMarker[];
  accentColor?: string;
}

export function MiniLocatorMap({
  markers,
  accentColor = "#FF2E93",
}: MiniLocatorMapProps) {
  const { isEn, t } = useLocale();
  const primary = markers[0];
  const bgUrl = buildLeonidaSvgDataUrl("vector");

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161922]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <MapPin className="h-4 w-4 text-[#FF2E93]" />
          {t("Leonida Spawn Locator Map", "雷奥奈达刷新坐标定位图")}
        </div>
        {primary && (
          <Link
            href={`/gta6/map?x=${primary.x}&y=${primary.y}&marker=${encodeURIComponent(primary.id)}`}
            className="inline-flex items-center gap-1 rounded-lg bg-[#FF2E93]/15 px-2.5 py-1 text-[11px] font-bold text-[#FF2E93] transition hover:bg-[#FF2E93] hover:text-white"
          >
            {t("Open on Map", "在大地图打开")} <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#070A12]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgUrl}
          alt={t("Leonida mini locator map", "雷奥奈达迷你定位地图")}
          className="h-full w-full object-cover opacity-90"
        />

        {markers.map((m) => {
          const leftPct = ((m.x + 2000) / 4000) * 100;
          const topPct = ((2000 - m.y) / 4000) * 100;
          return (
            <Link
              key={m.id}
              href={`/gta6/map?x=${m.x}&y=${m.y}&marker=${encodeURIComponent(m.id)}`}
              title={`${isEn ? m.titleEn : m.titleZh} (${formatCoords(m.x, m.y)})`}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span
                className="absolute -inset-2.5 animate-ping rounded-full opacity-45"
                style={{ backgroundColor: accentColor }}
              />
              <span
                className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: accentColor }}
              />
            </Link>
          );
        })}
      </div>

      <div className="divide-y divide-white/5 px-4 py-2">
        {markers.length === 0 ? (
          <p className="py-2 text-xs text-zinc-400">
            {t(
              "No fixed wild spawn—available via in-game dealers or story progression.",
              "暂无固定野外刷新点，可通过商店或主线获取。"
            )}
          </p>
        ) : (
          markers.map((m) => (
            <Link
              key={m.id}
              href={`/gta6/map?x=${m.x}&y=${m.y}&marker=${encodeURIComponent(m.id)}`}
              className="flex items-center justify-between py-2.5 text-xs transition hover:text-[#00E5FF]"
            >
              <div>
                <div className="font-semibold text-zinc-100">
                  {isEn ? m.titleEn : m.titleZh}
                </div>
                <div className="text-[11px] text-zinc-400">
                  {isEn ? m.regionEn : m.region}
                </div>
              </div>
              <span className="rounded bg-[#0D0F14] px-2 py-1 font-mono text-[11px] text-[#00E5FF]">
                {formatCoords(m.x, m.y)}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
