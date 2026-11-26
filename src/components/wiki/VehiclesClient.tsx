"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Gauge, ShieldAlert, ArrowUpRight } from "lucide-react";
import { VEHICLES } from "@/data/vehicles";
import { VEHICLE_COPY_EN } from "@/data/en-copy";
import { VEHICLE_CAT_EN } from "@/lib/i18n";
import { cn, formatMoney } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";
import type { VehicleEntity } from "@/types/gta";

const CATEGORIES: Array<"全部" | VehicleEntity["category"]> = [
  "全部",
  "超级跑车",
  "经典跑车",
  "肌肉车",
  "摩托车",
  "越野车",
  "船艇",
  "航空器",
];

type SortKey = "speed" | "price" | "antiTheft";

export function VehiclesClient() {
  const { isEn, t } = useLocale();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("全部");
  const [sortBy, setSortBy] = useState<SortKey>("speed");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VEHICLES.filter((v) => {
      if (category !== "全部" && v.category !== category) return false;
      if (
        q &&
        !v.titleZh.toLowerCase().includes(q) &&
        !v.titleEn.toLowerCase().includes(q) &&
        !v.manufacturer.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "speed") return b.stats.topSpeedKmh - a.stats.topSpeedKmh;
      if (sortBy === "price") return b.stats.price - a.stats.price;
      return b.stats.antiTheft - a.stats.antiTheft;
    });
  }, [category, sortBy, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
            GTA 6 VEHICLES DATABASE
          </span>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            {t("Leonida Vehicles Encyclopedia", "雷奥奈达全载具图鉴库")}
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {t(
              "Filter by class, top speed, or anti-theft tier. Open any vehicle for radar stats & spawn map.",
              "按车型、实测极速与防盗等级筛选，点击任意载具进入详情页查看雷达属性与刷新点地图。"
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search vehicle / brand...", "搜索中英车型 / 品牌...")}
              className="w-56 rounded-xl border border-white/10 bg-[#161922] py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-[#00E5FF]"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="rounded-xl border border-white/10 bg-[#161922] px-3 py-2 text-xs text-zinc-200 outline-none focus:border-[#00E5FF]"
          >
            <option value="speed">{t("Sort: Top Speed", "按极速降序")}</option>
            <option value="antiTheft">{t("Sort: Anti-Theft Tier", "按防盗等级降序")}</option>
            <option value="price">{t("Sort: Price", "按价格降序")}</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition",
              category === c
                ? "bg-[#FF2E93] text-white shadow-[0_0_16px_rgba(255,46,147,0.35)]"
                : "border border-white/10 bg-[#161922] text-zinc-300 hover:border-white/25"
            )}
          >
            {c === "全部" ? t("All", "全部") : isEn ? VEHICLE_CAT_EN[c] : c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <Link
            key={v.id}
            href={`/gta6/vehicles/${v.slug}`}
            className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161922] p-5 transition hover:-translate-y-0.5 hover:border-[#00E5FF]/50"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-[#0D0F14] px-2.5 py-0.5 text-[11px] font-semibold text-zinc-300">
                  {isEn ? v.categoryEn : v.category} · {v.stats.drivetrain}
                </span>
                <span className="font-mono text-xs font-bold text-[#00E5FF]">
                  {formatMoney(v.stats.price)}
                </span>
              </div>

              <div
                className="mt-4 flex h-28 items-end justify-between rounded-xl border border-white/5 p-3.5"
                style={{
                  background: `linear-gradient(135deg, ${v.accentColor}26 0%, #0D0F14 75%)`,
                }}
              >
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                    {v.manufacturer}
                  </div>
                  <h2 className="text-lg font-extrabold text-white group-hover:text-[#00E5FF]">
                    {isEn ? v.titleEn : v.titleZh}
                  </h2>
                  <p className="text-xs text-zinc-400">{isEn ? v.titleZh : v.titleEn}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-zinc-400 transition group-hover:text-[#FF2E93]" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl bg-[#0D0F14] p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Gauge className="h-3.5 w-3.5 text-[#00E5FF]" /> {t("Top Speed", "实测极速")}
                  </div>
                  <div className="mt-1 font-mono text-base font-bold text-white">
                    {v.stats.topSpeedKmh} <span className="text-xs text-zinc-400">km/h</span>
                  </div>
                </div>
                <div className="rounded-xl bg-[#0D0F14] p-2.5">
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <ShieldAlert className="h-3.5 w-3.5 text-[#FF2E93]" />{" "}
                    {t("Anti-Theft", "防盗等级")}
                  </div>
                  <div className="mt-1 font-mono text-base font-bold text-[#FF2E93]">
                    Lv.{v.stats.antiTheft}
                    <span className="ml-1 text-[11px] text-zinc-500">/ 5</span>
                  </div>
                </div>
              </div>

              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                {isEn ? VEHICLE_COPY_EN[v.slug]?.summary ?? v.summary : v.summary}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-zinc-400">
              <span>
                {t(`Spawn pins: ${v.spawnMarkerIds.length}`, `刷新坐标点：${v.spawnMarkerIds.length} 处`)}
              </span>
              <span className="font-semibold text-[#00E5FF]">
                {t("Specs & Spawn Map →", "查看参数与定位 →")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
