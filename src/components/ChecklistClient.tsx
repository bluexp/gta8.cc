"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Trophy,
  MapPin,
  Download,
  Upload,
  RotateCcw,
} from "lucide-react";
import { CHECKLIST_ITEMS } from "@/data/checklists";
import { CHECKLIST_DESC_EN } from "@/data/en-copy";
import { getMarkerById } from "@/data/markers";
import { CHECKLIST_SEC_EN } from "@/lib/i18n";
import { useProgressStore } from "@/store/useProgressStore";
import { useLocale } from "@/store/useLocaleStore";
import { cn } from "@/lib/utils";
import type { ChecklistItem } from "@/types/gta";

const SECTIONS: Array<"全部" | ChecklistItem["section"]> = [
  "全部",
  "主线剧情",
  "全收集品",
  "特技与挑战",
  "载具与武器",
  "奖杯成就",
];

const TROPHY_BADGE: Record<NonNullable<ChecklistItem["trophyTier"]>, string> = {
  Platinum: "border-[#00E5FF]/50 bg-[#00E5FF]/15 text-[#00E5FF]",
  Gold: "border-amber-400/50 bg-amber-400/15 text-amber-300",
  Silver: "border-zinc-300/40 bg-zinc-300/15 text-zinc-200",
  Bronze: "border-orange-400/40 bg-orange-500/15 text-orange-300",
};

export function ChecklistClient() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { isEn, t } = useLocale();
  const [section, setSection] = useState<(typeof SECTIONS)[number]>("全部");
  const [onlyPending, setOnlyPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const completedMarkers = useProgressStore((s) => s.completedMarkers);
  const completedChecklist = useProgressStore((s) => s.completedChecklist);
  const toggleChecklistItem = useProgressStore((s) => s.toggleChecklistItem);
  const exportSnapshot = useProgressStore((s) => s.exportSnapshot);
  const importSnapshot = useProgressStore((s) => s.importSnapshot);
  const resetAll = useProgressStore((s) => s.resetAll);

  const isDone = (item: ChecklistItem) =>
    item.linkedMarkerId
      ? completedMarkers.includes(item.linkedMarkerId)
      : completedChecklist.includes(item.id);

  const totalWeight = CHECKLIST_ITEMS.reduce((s, i) => s + i.weight, 0);
  const doneWeight = CHECKLIST_ITEMS.reduce((s, i) => s + (isDone(i) ? i.weight : 0), 0);
  const pct = Math.round((doneWeight / totalWeight) * 100);
  const doneCount = CHECKLIST_ITEMS.filter(isDone).length;

  const filtered = useMemo(() => {
    return CHECKLIST_ITEMS.filter((item) => {
      if (section !== "全部" && item.section !== section) return false;
      if (onlyPending && isDone(item)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, onlyPending, completedMarkers, completedChecklist]);

  const handleExport = () => {
    const blob = new Blob([exportSnapshot()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gta8-checklist-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotice(t("Exported progress backup JSON", "进度存档已导出为 JSON 文件"));
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importSnapshot(String(reader.result ?? ""));
      setNotice(
        res.ok
          ? t(`Merged ${res.count} saved items`, `已成功合并 ${res.count} 条记录`)
          : res.error ?? t("Import failed", "导入失败")
      );
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-white/10 bg-[#161922] p-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 py-1 text-xs font-semibold text-[#00E5FF]">
              <Trophy className="h-3.5 w-3.5" />
              {t("100% Completion & Trophy Tracker", "100% 完成度与全奖杯追踪清单")}
            </span>
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              {t("Leonida 100% Legend Checklist", "雷奥奈达 100% 传奇进度台")}
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              {t(
                "Items tagged Map Sync stay bidirectionally linked with /gta6/map markers in real time.",
                "凡带“大地图联动”标记的条目，勾选后将与 /gta6/map 标点状态实时双向同步。"
              )}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <div className="text-xs text-zinc-400">{t("Overall Progress", "综合完成度")}</div>
              <div className="font-mono text-4xl font-black text-[#00E5FF]">{pct}%</div>
              <div className="text-xs text-zinc-500">
                {t(
                  `${doneCount} / ${CHECKLIST_ITEMS.length} completed`,
                  `已完成 ${doneCount} / ${CHECKLIST_ITEMS.length} 项`
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF2E93] to-[#00E5FF] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {SECTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSection(s)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                  section === s
                    ? "bg-[#FF2E93] text-white"
                    : "border border-white/10 bg-[#0D0F14] text-zinc-300 hover:border-white/25"
                )}
              >
                {s === "全部" ? t("All", "全部") : isEn ? CHECKLIST_SEC_EN[s] : s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setOnlyPending((v) => !v)}
              className={cn(
                "rounded-lg border px-3 py-1.5 font-medium",
                onlyPending
                  ? "border-[#00E5FF] bg-[#00E5FF]/15 text-[#00E5FF]"
                  : "border-white/10 bg-[#0D0F14] text-zinc-300"
              )}
            >
              {t("Pending Only", "仅看未完成")}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#0D0F14] px-3 py-1.5 text-zinc-200 hover:border-[#00E5FF]/50"
            >
              <Download className="h-3.5 w-3.5 text-[#00E5FF]" /> {t("Export", "导出")}
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#0D0F14] px-3 py-1.5 text-zinc-200 hover:border-[#FF2E93]/50"
            >
              <Upload className="h-3.5 w-3.5 text-[#FF2E93]" /> {t("Import", "导入")}
            </button>
            <input ref={fileRef} type="file" accept="application/json" onChange={handleImport} className="hidden" />
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    t(
                      "Reset all local map & checklist progress?",
                      "确认清空本地所有地图与清单打卡进度？"
                    )
                  )
                ) {
                  resetAll();
                  setNotice(t("All local progress cleared", "已重置全部本地进度"));
                }
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-[#0D0F14] px-3 py-1.5 text-zinc-400 hover:text-rose-400"
            >
              <RotateCcw className="h-3.5 w-3.5" /> {t("Reset", "重置")}
            </button>
          </div>
        </div>

        {notice && <p className="mt-3 text-xs font-medium text-[#00E5FF]">{notice}</p>}
      </div>

      <div className="mt-6 space-y-2.5">
        {filtered.map((item) => {
          const checked = isDone(item);
          const linkedMarker = item.linkedMarkerId ? getMarkerById(item.linkedMarkerId) : undefined;
          return (
            <div
              key={item.id}
              className={cn(
                "flex flex-col justify-between gap-3 rounded-2xl border p-4 transition sm:flex-row sm:items-center",
                checked
                  ? "border-[#00E5FF]/30 bg-[#121822]/75 opacity-75"
                  : "border-white/10 bg-[#161922] hover:border-white/20"
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleChecklistItem(item.id, item.linkedMarkerId)}
                  className="mt-0.5 shrink-0 text-zinc-400 transition hover:scale-105"
                  aria-label={checked ? t("Uncheck", "取消完成") : t("Mark complete", "标记完成")}
                >
                  {checked ? (
                    <CheckCircle2 className="h-6 w-6 text-[#00E5FF]" />
                  ) : (
                    <Circle className="h-6 w-6 hover:text-[#FF2E93]" />
                  )}
                </button>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                      {isEn ? CHECKLIST_SEC_EN[item.section] : item.section}
                    </span>
                    {item.trophyTier && (
                      <span
                        className={cn(
                          "rounded border px-2 py-0.5 text-[10px] font-bold",
                          TROPHY_BADGE[item.trophyTier]
                        )}
                      >
                        {item.trophyTier} Trophy
                      </span>
                    )}
                    {linkedMarker && (
                      <span className="rounded bg-[#FF2E93]/15 px-2 py-0.5 text-[10px] font-semibold text-[#FF2E93]">
                        {t("Map Sync", "大地图双向联动")}
                      </span>
                    )}
                  </div>
                  <h2
                    className={cn(
                      "mt-1.5 text-sm font-bold sm:text-base",
                      checked ? "text-zinc-400 line-through" : "text-white"
                    )}
                  >
                    {isEn ? item.titleEn : item.titleZh}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {isEn
                      ? `${item.titleZh} · ${CHECKLIST_DESC_EN[item.id] ?? item.description}`
                      : `${item.titleEn} · ${item.description}`}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 pl-9 sm:pl-0">
                <span className="rounded-lg bg-[#0D0F14] px-2.5 py-1 font-mono text-xs text-zinc-400">
                  +{item.weight}%
                </span>
                {linkedMarker && (
                  <Link
                    href={`/gta6/map?x=${linkedMarker.x}&y=${linkedMarker.y}&marker=${encodeURIComponent(linkedMarker.id)}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 py-1.5 text-xs font-semibold text-[#00E5FF] transition hover:bg-[#00E5FF] hover:text-[#0D0F14]"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    {t("Locate on Map", "大地图定位")}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
