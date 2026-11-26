"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Cloud, HardDrive } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";
import { useLocale } from "@/store/useLocaleStore";
import { MAP_MARKERS } from "@/data/markers";
import { CHECKLIST_ITEMS } from "@/data/checklists";
import { CATEGORY_META } from "@/lib/categories";
import type { MarkerCategory } from "@/types/gta";

const CATEGORIES: MarkerCategory[] = [
  "collectible",
  "vehicle",
  "heist",
  "service",
  "wildlife",
];

export function HomeProgressOverview() {
  const { t } = useLocale();
  const completedMarkers = useProgressStore((s) => s.completedMarkers);
  const completedChecklist = useProgressStore((s) => s.completedChecklist);
  const cloudSyncEnabled = useProgressStore((s) => s.cloudSyncEnabled);

  const markerPct = Math.round((completedMarkers.length / MAP_MARKERS.length) * 100);

  const checklistDoneWeight = CHECKLIST_ITEMS.reduce((acc, item) => {
    const done = item.linkedMarkerId
      ? completedMarkers.includes(item.linkedMarkerId)
      : completedChecklist.includes(item.id);
    return acc + (done ? item.weight : 0);
  }, 0);
  const checklistTotalWeight = CHECKLIST_ITEMS.reduce((acc, i) => acc + i.weight, 0);
  const checklistPct = Math.round((checklistDoneWeight / checklistTotalWeight) * 100);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#161922] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">
              {t("Your Leonida Exploration Progress", "个人雷奥奈达探索进度")}
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#0D0F14] px-2.5 py-0.5 text-[11px] text-zinc-300">
              {cloudSyncEnabled ? (
                <>
                  <Cloud className="h-3 w-3 text-[#00E5FF]" /> {t("Cloud Synced", "云端已同步")}
                </>
              ) : (
                <>
                  <HardDrive className="h-3 w-3 text-[#FF2E93]" />{" "}
                  {t("Zero-Login Local Save", "免登录本地持久化")}
                </>
              )}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            {t(
              "Map markers and the 100% completion checklist stay synced in real time—saved locally with no account required.",
              "大地图标点与 100% 完成度清单双向实时联动，无需注册即可自动保存至本地浏览器。"
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[11px] text-zinc-400">{t("Map Markers", "地图标点完成率")}</div>
            <div className="font-mono text-2xl font-black text-[#00E5FF]">{markerPct}%</div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-right">
            <div className="text-[11px] text-zinc-400">{t("100% Trophies", "100% 奖杯总进度")}</div>
            <div className="font-mono text-2xl font-black text-[#FF2E93]">{checklistPct}%</div>
          </div>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const allInCat = MAP_MARKERS.filter((m) => m.category === cat);
          const doneInCat = allInCat.filter((m) => completedMarkers.includes(m.id)).length;
          const pct = allInCat.length > 0 ? Math.round((doneInCat / allInCat.length) * 100) : 0;

          return (
            <Link
              key={cat}
              href={`/gta6/map?category=${cat}`}
              className="group rounded-xl border border-white/5 bg-[#0D0F14] p-3.5 transition hover:border-white/20"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200 group-hover:text-white">
                  {t(meta.labelEn, meta.labelZh)}
                </span>
                <span className="font-mono text-zinc-400">
                  {doneInCat}/{allInCat.length}
                </span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${pct}%`, backgroundColor: meta.color }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-4 text-xs">
        <span className="inline-flex items-center gap-1.5 text-zinc-400">
          <CheckCircle2 className="h-4 w-4 text-[#00E5FF]" />
          {t(
            `${completedMarkers.length} / ${MAP_MARKERS.length} markers checked · JSON backup export supported`,
            `已打卡 ${completedMarkers.length} / ${MAP_MARKERS.length} 个地图点位 · 支持 JSON 存档导出备份`
          )}
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/gta6/checklist"
            className="inline-flex items-center gap-1 font-medium text-zinc-300 hover:text-[#00E5FF]"
          >
            {t("Open 100% Checklist", "打开 100% 清单")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/gta6/map"
            className="inline-flex items-center gap-1 font-semibold text-[#FF2E93] hover:underline"
          >
            {t("Continue Exploring", "继续探索地图")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
