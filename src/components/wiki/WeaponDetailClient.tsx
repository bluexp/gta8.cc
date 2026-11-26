"use client";

import Link from "next/link";
import { ArrowLeft, Crosshair, Layers } from "lucide-react";
import { WEAPON_COPY_EN } from "@/data/en-copy";
import { StatRadarChart, StatBar } from "@/components/wiki/StatRadarChart";
import { MiniLocatorMap } from "@/components/map/MiniLocatorMap";
import { formatMoney } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";
import type { MapMarker, WeaponEntity } from "@/types/gta";

export function WeaponDetailClient({
  weapon,
  spawnMarkers,
}: {
  weapon: WeaponEntity;
  spawnMarkers: MapMarker[];
}) {
  const { isEn, t } = useLocale();
  const enCopy = WEAPON_COPY_EN[weapon.slug];
  const attachments = isEn ? enCopy?.attachments ?? weapon.attachments : weapon.attachments;

  const radarAxes = [
    { label: t("Damage", "伤害"), value: weapon.stats.damage },
    { label: t("Fire Rate", "射速"), value: weapon.stats.fireRate },
    { label: t("Accuracy", "精准"), value: weapon.stats.accuracy },
    { label: t("Range", "射程"), value: weapon.stats.range },
    { label: t("Mobility", "机动"), value: weapon.stats.mobility },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href="/gta6/weapons"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#A855F7]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {t("Back to Weapons", "返回武器与装备库")}
      </Link>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[#161922] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#A855F7]/15 px-3 py-0.5 text-xs font-bold text-[#A855F7]">
              <Crosshair className="h-3.5 w-3.5" />
              {isEn ? weapon.categoryEn : `${weapon.category} · ${weapon.categoryEn}`}
            </span>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-4xl">
              {isEn ? weapon.titleEn : weapon.titleZh}
            </h1>
            <p className="mt-1 font-mono text-sm text-zinc-400">
              {isEn ? weapon.titleZh : weapon.titleEn}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0D0F14] px-4 py-3 text-right">
            <div className="text-[11px] text-zinc-400">
              {t("Gun Van / Shop Price", "黑市 / 枪店售价")}
            </div>
            <div className="font-mono text-2xl font-black text-[#00E5FF]">
              {formatMoney(weapon.stats.price)}
            </div>
            <div className="text-[11px] text-zinc-500">
              {t(`Mag Capacity: ${weapon.stats.clipSize} rds`, `标准弹匣：${weapon.stats.clipSize} 发`)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="grid items-center gap-6 rounded-2xl border border-white/10 bg-[#161922] p-5 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-bold text-white">
                {t("Combat Radar", "实战五维雷达图")}
              </h2>
              <StatRadarChart axes={radarAxes} accentColor="#A855F7" />
            </div>
            <div className="space-y-3">
              <StatBar label={t("Damage", "单发伤害 Damage")} value={weapon.stats.damage} accentColor="#FF2E93" />
              <StatBar label={t("Fire Rate", "射速 Fire Rate")} value={weapon.stats.fireRate} accentColor="#00E5FF" />
              <StatBar label={t("Accuracy", "精准度 Accuracy")} value={weapon.stats.accuracy} accentColor="#A855F7" />
              <StatBar label={t("Range", "有效射程 Range")} value={weapon.stats.range} accentColor="#FFB800" />
              <StatBar label={t("Mobility", "机动性 Mobility")} value={weapon.stats.mobility} accentColor="#22C55E" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161922] p-5">
            <h2 className="text-base font-bold text-white">
              {t("Overview & Acquisition", "武器特性与获取攻略")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {isEn ? enCopy?.summary ?? weapon.summary : weapon.summary}
            </p>
            <div className="mt-4 rounded-xl border border-[#A855F7]/25 bg-[#0D0F14] p-4">
              <div className="text-xs font-bold text-[#A855F7]">
                {t("How to Obtain", "获取方式")}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                {isEn ? enCopy?.acquisition ?? weapon.acquisition : weapon.acquisition}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
                <Layers className="h-3.5 w-3.5 text-[#00E5FF]" />{" "}
                {t("Recommended Attachments", "推荐改装配件方案")}
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <span
                    key={att}
                    className="rounded-xl border border-white/10 bg-[#0D0F14] px-3 py-1.5 text-xs font-medium text-zinc-200"
                  >
                    {att}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <MiniLocatorMap markers={spawnMarkers} accentColor="#A855F7" />
        </div>
      </div>
    </div>
  );
}
