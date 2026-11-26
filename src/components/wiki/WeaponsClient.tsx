"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Crosshair, ArrowUpRight } from "lucide-react";
import { WEAPONS } from "@/data/weapons";
import { WEAPON_COPY_EN } from "@/data/en-copy";
import { WEAPON_CAT_EN } from "@/lib/i18n";
import { cn, formatMoney } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";
import type { WeaponEntity } from "@/types/gta";

const CATEGORIES: Array<"全部" | WeaponEntity["category"]> = [
  "全部",
  "突击步枪",
  "冲锋枪",
  "手枪",
  "霰弹枪",
  "狙击枪",
  "重武器",
];

export function WeaponsClient() {
  const { isEn, t } = useLocale();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("全部");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WEAPONS.filter((w) => {
      if (category !== "全部" && w.category !== category) return false;
      const enAtts = WEAPON_COPY_EN[w.slug]?.attachments ?? [];
      if (
        q &&
        !w.titleZh.toLowerCase().includes(q) &&
        !w.titleEn.toLowerCase().includes(q) &&
        !w.attachments.some((a) => a.toLowerCase().includes(q)) &&
        !enAtts.some((a) => a.toLowerCase().includes(q))
      ) {
        return false;
      }
      return true;
    });
  }, [category, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#A855F7]">
            GTA 6 WEAPONS & GEAR
          </span>
          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            {t("Weapons & Black Market Armory", "武器与黑市装备库")}
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {t(
              "Compare damage, fire rate, accuracy & range, plus Gun Van spawn locations and recommended mods.",
              "伤害、射速、精度、射程全维数值对比，附黑市军火车刷新坐标与推荐配件组合。"
            )}
          </p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Search weapon or mod (e.g. Suppressor)...", "搜索武器名或配件（如 消音器）...")}
            className="w-64 rounded-xl border border-white/10 bg-[#161922] py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-[#A855F7]"
          />
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
                ? "bg-[#A855F7] text-white shadow-[0_0_16px_rgba(168,85,247,0.4)]"
                : "border border-white/10 bg-[#161922] text-zinc-300 hover:border-white/25"
            )}
          >
            {c === "全部" ? t("All", "全部") : isEn ? WEAPON_CAT_EN[c] : c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((w) => {
          const atts = isEn ? WEAPON_COPY_EN[w.slug]?.attachments ?? w.attachments : w.attachments;
          return (
            <Link
              key={w.id}
              href={`/gta6/weapons/${w.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161922] p-5 transition hover:-translate-y-0.5 hover:border-[#A855F7]/60"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#A855F7]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#A855F7]">
                    <Crosshair className="h-3 w-3" /> {isEn ? w.categoryEn : w.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#00E5FF]">
                    {formatMoney(w.stats.price)}
                  </span>
                </div>

                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-extrabold text-white group-hover:text-[#00E5FF]">
                      {isEn ? w.titleEn : w.titleZh}
                    </h2>
                    <p className="font-mono text-xs text-zinc-400">
                      {isEn ? w.titleZh : w.titleEn}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-500 group-hover:text-[#FF2E93]" />
                </div>

                <div className="mt-4 space-y-2 text-[11px]">
                  {[
                    { label: t("DMG", "伤害"), val: w.stats.damage, color: "#FF2E93" },
                    { label: t("ROF", "射速"), val: w.stats.fireRate, color: "#00E5FF" },
                    { label: t("ACC", "精准"), val: w.stats.accuracy, color: "#A855F7" },
                    { label: t("RNG", "射程"), val: w.stats.range, color: "#FFB800" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex items-center gap-2">
                      <span className="w-8 text-zinc-400">{bar.label}</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${bar.val}%`, backgroundColor: bar.color }}
                        />
                      </div>
                      <span className="w-7 text-right font-mono text-zinc-300">{bar.val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {atts.slice(0, 3).map((att) => (
                    <span
                      key={att}
                      className="rounded border border-white/10 bg-[#0D0F14] px-2 py-0.5 text-[10px] text-zinc-300"
                    >
                      {att}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-zinc-400">
                <span>
                  {t(`Mag: ${w.stats.clipSize} rds`, `弹匣容量：${w.stats.clipSize} 发`)}
                </span>
                <span className="font-semibold text-[#A855F7]">
                  {t("Specs & Spawn Map →", "详情与获取坐标 →")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
