"use client";

import Link from "next/link";
import { ArrowLeft, Gauge, ShieldAlert, Users, Wrench } from "lucide-react";
import { VEHICLE_COPY_EN } from "@/data/en-copy";
import { StatRadarChart, StatBar } from "@/components/wiki/StatRadarChart";
import { MiniLocatorMap } from "@/components/map/MiniLocatorMap";
import { formatMoney } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";
import type { MapMarker, VehicleEntity } from "@/types/gta";

export function VehicleDetailClient({
  vehicle,
  spawnMarkers,
  similar,
}: {
  vehicle: VehicleEntity;
  spawnMarkers: MapMarker[];
  similar: VehicleEntity[];
}) {
  const { isEn, t } = useLocale();
  const enCopy = VEHICLE_COPY_EN[vehicle.slug];

  const radarAxes = [
    { label: t("Speed", "极速"), value: vehicle.stats.topSpeed },
    { label: t("Accel", "加速"), value: vehicle.stats.acceleration },
    { label: t("Handling", "操控"), value: vehicle.stats.handling },
    { label: t("Braking", "制动"), value: vehicle.stats.braking },
    { label: t("Security", "防盗"), value: vehicle.stats.antiTheft * 20 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href="/gta6/vehicles"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#00E5FF]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {t("Back to Vehicles", "返回全载具图鉴")}
      </Link>

      <div className="mt-4 rounded-2xl border border-white/10 bg-[#161922] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-[#FF2E93]/15 px-2.5 py-0.5 font-bold text-[#FF2E93]">
                {isEn ? vehicle.categoryEn : vehicle.category}
              </span>
              <span className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-zinc-300">
                {vehicle.manufacturer}
              </span>
              <span className="rounded-full bg-[#00E5FF]/10 px-2.5 py-0.5 font-mono text-[#00E5FF]">
                {vehicle.stats.drivetrain}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-white sm:text-4xl">
              {isEn ? vehicle.titleEn : vehicle.titleZh}
            </h1>
            <p className="mt-1 font-mono text-sm text-zinc-400">
              {isEn ? vehicle.titleZh : vehicle.titleEn}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0D0F14] px-4 py-3 text-right">
            <div className="text-[11px] text-zinc-400">{t("Reference Price", "官方参考售价")}</div>
            <div className="font-mono text-2xl font-black text-[#00E5FF]">
              {formatMoney(vehicle.stats.price)}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-[#0D0F14] p-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Gauge className="h-3.5 w-3.5 text-[#00E5FF]" /> {t("Top Speed", "实测极速")}
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-white">
              {vehicle.stats.topSpeedKmh} km/h
            </div>
          </div>
          <div className="rounded-xl bg-[#0D0F14] p-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <ShieldAlert className="h-3.5 w-3.5 text-[#FF2E93]" /> {t("Anti-Theft", "防盗等级")}
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-[#FF2E93]">
              Lv.{vehicle.stats.antiTheft} / 5
            </div>
          </div>
          <div className="rounded-xl bg-[#0D0F14] p-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Users className="h-3.5 w-3.5 text-zinc-400" /> {t("Seats", "乘员座位")}
            </div>
            <div className="mt-1 font-mono text-lg font-bold text-white">
              {vehicle.stats.seats} {t("Seats", "座")}
            </div>
          </div>
          <div className="rounded-xl bg-[#0D0F14] p-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Wrench className="h-3.5 w-3.5 text-zinc-400" /> {t("Verified By", "社区校验")}
            </div>
            <div className="mt-1 text-sm font-bold text-emerald-400">
              {vehicle.contributor ?? "GTA8 Team"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="grid items-center gap-6 rounded-2xl border border-white/10 bg-[#161922] p-5 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-bold text-white">
                {t("Performance Radar", "性能五维雷达图")}
              </h2>
              <StatRadarChart axes={radarAxes} accentColor={vehicle.accentColor} />
            </div>
            <div className="space-y-3.5">
              <StatBar label={t("Top Speed", "极速 Top Speed")} value={vehicle.stats.topSpeed} accentColor="#00E5FF" />
              <StatBar label={t("Acceleration", "加速 Acceleration")} value={vehicle.stats.acceleration} accentColor="#FF2E93" />
              <StatBar label={t("Handling", "操控 Handling")} value={vehicle.stats.handling} accentColor="#A855F7" />
              <StatBar label={t("Braking", "制动 Braking")} value={vehicle.stats.braking} accentColor="#FFB800" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161922] p-5">
            <h2 className="text-base font-bold text-white">
              {t("Overview & How to Get", "载具评测与获取方式")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {isEn ? enCopy?.summary ?? vehicle.summary : vehicle.summary}
            </p>
            <div className="mt-4 rounded-xl border border-[#00E5FF]/20 bg-[#0D0F14] p-4">
              <div className="text-xs font-bold text-[#00E5FF]">
                {t("Spawn & Acquisition Guide", "免费刷新与入手指南")}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                {isEn ? enCopy?.acquisition ?? vehicle.acquisition : vehicle.acquisition}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {t("Related Missions", "关联剧情与支线任务")}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {vehicle.relatedMissions.map((m) => (
                  <span
                    key={m}
                    className="rounded-lg border border-white/10 bg-[#0D0F14] px-3 py-1 text-xs text-zinc-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <MiniLocatorMap markers={spawnMarkers} accentColor={vehicle.accentColor} />

          <div className="rounded-2xl border border-white/10 bg-[#161922] p-5">
            <h2 className="text-sm font-bold text-white">{t("Similar Vehicles", "同类载具推荐")}</h2>
            <div className="mt-3 space-y-2.5">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  href={`/gta6/vehicles/${item.slug}`}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0D0F14] px-3.5 py-2.5 text-xs transition hover:border-[#00E5FF]/50"
                >
                  <div>
                    <div className="font-bold text-white">
                      {isEn ? item.titleEn : item.titleZh}
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {isEn ? item.categoryEn : item.category}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#00E5FF]">
                    {item.stats.topSpeedKmh} km/h
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
