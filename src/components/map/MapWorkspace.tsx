"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import {
  Layers,
  Search,
  CheckCircle2,
  Circle,
  Download,
  Upload,
  Cloud,
  Share2,
  Flag,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  EyeOff,
  Eye,
  ExternalLink,
  Compass,
  Plus,
} from "lucide-react";
import { MAP_MARKERS } from "@/data/markers";
import { MARKER_DESC_EN } from "@/data/en-copy";
import { CATEGORY_META, LEONIDA_REGIONS, SUBTYPE_META } from "@/lib/categories";
import { cn, formatCoords } from "@/lib/utils";
import { useProgressStore } from "@/store/useProgressStore";
import { useLocale } from "@/store/useLocaleStore";
import type { MapMarker, MarkerCategory } from "@/types/gta";
import type { BasemapStyle } from "./leonidaBasemap";
import { SubmissionModal } from "./SubmissionModal";

const LeonidaMapEngine = dynamic(
  () => import("./LeonidaMapEngine").then((m) => m.LeonidaMapEngine),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#070A12] text-sm text-zinc-400">
        Loading Leonida Interactive Map Engine...
      </div>
    ),
  }
);

const ALL_CATEGORIES: MarkerCategory[] = [
  "collectible",
  "vehicle",
  "heist",
  "service",
  "wildlife",
];

export function MapWorkspace() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { locale, isEn, t } = useLocale();

  const completedMarkers = useProgressStore((s) => s.completedMarkers);
  const toggleMarker = useProgressStore((s) => s.toggleMarker);
  const exportSnapshot = useProgressStore((s) => s.exportSnapshot);
  const importSnapshot = useProgressStore((s) => s.importSnapshot);
  const cloudSyncEnabled = useProgressStore((s) => s.cloudSyncEnabled);
  const cloudUserId = useProgressStore((s) => s.cloudUserId);
  const syncStatus = useProgressStore((s) => s.syncStatus);
  const setCloudSync = useProgressStore((s) => s.setCloudSync);

  const [leftOpen, setLeftOpen] = useState(true);
  const [markers, setMarkers] = useState<MapMarker[]>(MAP_MARKERS);
  const [basemap, setBasemap] = useState<BasemapStyle>("satellite");
  const [activeCategories, setActiveCategories] = useState<MarkerCategory[]>(ALL_CATEGORIES);
  const [hideCollected, setHideCollected] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number }>({ x: 1240, y: -850 });
  const [flyTarget, setFlyTarget] = useState<{ x: number; y: number; zoom?: number; seq: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [cloudInput, setCloudInput] = useState(cloudUserId ?? "");
  const [submissionState, setSubmissionState] = useState<{
    open: boolean;
    marker?: MapMarker | null;
    presetCoords?: { x: number; y: number } | null;
  }>({ open: false });

  useEffect(() => {
    let active = true;
    fetch("/api/markers")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ok?: boolean; markers?: MapMarker[] } | null) => {
        if (active && data?.ok && Array.isArray(data.markers) && data.markers.length > 0) {
          setMarkers(data.markers);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  useEffect(() => {
    const paramCat = searchParams.get("category") as MarkerCategory | null;
    if (paramCat && ALL_CATEGORIES.includes(paramCat)) {
      setActiveCategories([paramCat]);
    }
    const paramMarker = searchParams.get("marker");
    const paramX = searchParams.get("x");
    const paramY = searchParams.get("y");

    if (paramMarker) {
      const found = markers.find((m) => m.id === paramMarker);
      if (found) {
        setSelectedMarker(found);
        setFlyTarget({ x: found.x, y: found.y, zoom: 1, seq: Date.now() });
        return;
      }
    }
    if (paramX !== null && paramY !== null) {
      const nx = Number(paramX);
      const ny = Number(paramY);
      if (!Number.isNaN(nx) && !Number.isNaN(ny)) {
        setFlyTarget({ x: nx, y: ny, zoom: 1, seq: Date.now() });
      }
    }
  }, [searchParams, markers]);

  const fuse = useMemo(
    () =>
      new Fuse(markers, {
        keys: ["titleEn", "titleZh", "regionEn", "region", "subType"],
        threshold: 0.35,
      }),
    [markers]
  );

  const filteredMarkers = useMemo(() => {
    let base = query.trim()
      ? fuse.search(query.trim()).map((r) => r.item)
      : markers;
    base = base.filter((m) => activeCategories.includes(m.category));
    if (hideCollected) {
      base = base.filter((m) => !completedMarkers.includes(m.id));
    }
    return base;
  }, [query, fuse, markers, activeCategories, hideCollected, completedMarkers]);

  const toggleCategory = (cat: MarkerCategory) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleCopyLink = (x: number, y: number, markerId?: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://gta8.cc";
    const url = `${origin}/gta6/map?x=${Math.round(x)}&y=${Math.round(y)}${
      markerId ? `&marker=${encodeURIComponent(markerId)}` : ""
    }`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    showToast(
      t(
        `Copied coordinate link: X ${Math.round(x)}, Y ${Math.round(y)}`,
        `已复制坐标链接：X ${Math.round(x)}, Y ${Math.round(y)}`
      )
    );
  };

  const handleExportJson = () => {
    const blob = new Blob([exportSnapshot()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gta8-leonida-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t("Exported local progress JSON backup", "已导出本地进度 JSON 存档"));
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importSnapshot(String(reader.result ?? ""));
      showToast(
        res.ok
          ? t(`Imported & merged ${res.count} items`, `成功导入并合并 ${res.count} 条打卡记录`)
          : res.error ?? t("Import failed", "导入失败")
      );
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const isSelectedDone = selectedMarker
    ? completedMarkers.includes(selectedMarker.id)
    : false;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#070A12]">
      {/* LEFT DRAWER */}
      <aside
        className={cn(
          "z-[500] flex h-full shrink-0 flex-col border-r border-white/10 bg-[#12151F]/95 backdrop-blur-xl transition-all duration-200",
          leftOpen ? "w-80" : "w-0 overflow-hidden border-r-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <h1 className="text-sm font-extrabold text-white">
              {t("Leonida Interactive Map", "雷奥奈达交互大地图")}
            </h1>
            <p className="text-[11px] font-mono text-zinc-400">
              {t(
                `Showing ${filteredMarkers.length} / ${markers.length} pins`,
                `已显示 ${filteredMarkers.length} / ${markers.length} 点位`
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLeftOpen(false)}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
            title={t("Collapse sidebar", "收起左侧抽屉")}
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search pins or regions (EN / 中文)...", "搜索中英点位名或区域...")}
              className="w-full rounded-xl border border-white/10 bg-[#0D0F14] py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#00E5FF]"
            />
          </div>

          {/* Basemap Switcher */}
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              <Layers className="h-3.5 w-3.5 text-[#00E5FF]" />
              {t("Map Layer", "底图图层切换")}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "satellite", en: "Satellite", zh: "卫星实景", sub: "Terrain" },
                  { id: "vector", en: "Vector Roads", zh: "矢量路网", sub: "Neon Grid" },
                ] as const
              ).map((layer) => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setBasemap(layer.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-left transition",
                    basemap === layer.id
                      ? "border-[#00E5FF] bg-[#00E5FF]/15 text-white"
                      : "border-white/10 bg-[#0D0F14] text-zinc-400 hover:border-white/25"
                  )}
                >
                  <div className="text-xs font-bold">{t(layer.en, layer.zh)}</div>
                  <div className="font-mono text-[10px] opacity-75">{layer.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <div className="mb-2 flex items-center justify-between text-[11px]">
              <span className="font-semibold uppercase tracking-wider text-zinc-400">
                {t("Categories (Done / Total)", "分类过滤（已打卡 / 总数）")}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveCategories(
                    activeCategories.length === ALL_CATEGORIES.length ? [] : ALL_CATEGORIES
                  )
                }
                className="text-[#00E5FF] hover:underline"
              >
                {activeCategories.length === ALL_CATEGORIES.length
                  ? t("Clear", "清空")
                  : t("Select All", "全选")}
              </button>
            </div>

            <div className="space-y-1.5">
              {ALL_CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat];
                const total = markers.filter((m) => m.category === cat).length;
                const done = markers.filter(
                  (m) => m.category === cat && completedMarkers.includes(m.id)
                ).length;
                const active = activeCategories.includes(cat);

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs transition",
                      active
                        ? "border-white/20 bg-[#161922] text-white"
                        : "border-white/5 bg-[#0D0F14]/70 text-zinc-500 opacity-65"
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: meta.color,
                          boxShadow: active ? `0 0 8px ${meta.color}` : "none",
                        }}
                      />
                      <span className="font-semibold">{t(meta.labelEn, meta.labelZh)}</span>
                    </span>
                    <span className="font-mono text-[11px]">
                      <span style={{ color: meta.color }}>{done}</span> / {total}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setHideCollected((v) => !v)}
              className="mt-2.5 flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0D0F14] px-3 py-2 text-xs text-zinc-300 hover:border-white/25"
            >
              <span className="flex items-center gap-2">
                {hideCollected ? (
                  <EyeOff className="h-3.5 w-3.5 text-[#FF2E93]" />
                ) : (
                  <Eye className="h-3.5 w-3.5 text-zinc-400" />
                )}
                {t("Hide Collected Pins", "隐藏已打卡标点")}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold",
                  hideCollected ? "bg-[#FF2E93]/20 text-[#FF2E93]" : "bg-white/10 text-zinc-400"
                )}
              >
                {hideCollected ? t("Hidden", "已开启") : t("Dimmed", "半透明显示")}
              </span>
            </button>
          </div>

          {/* Save Export/Import */}
          <div className="rounded-xl border border-white/10 bg-[#0D0F14] p-3">
            <div className="text-[11px] font-semibold text-zinc-300">
              {t("Local Save Backup (No Login)", "本地进度备份（免登录即用）")}
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#161922] px-2.5 py-2 text-xs font-medium text-zinc-200 hover:border-[#00E5FF]/50"
              >
                <Download className="h-3.5 w-3.5 text-[#00E5FF]" />
                {t("Export JSON", "导出 JSON")}
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#161922] px-2.5 py-2 text-xs font-medium text-zinc-200 hover:border-[#FF2E93]/50"
              >
                <Upload className="h-3.5 w-3.5 text-[#FF2E93]" />
                {t("Import Merge", "导入合并")}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={handleImportJson}
                className="hidden"
              />
            </div>
          </div>

          {/* Cloud Sync Toggle */}
          <div className="rounded-xl border border-white/10 bg-[#0D0F14] p-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
                <Cloud className="h-3.5 w-3.5 text-[#00E5FF]" />
                {t("Cloud Progress Sync (D1)", "云端进度同步（D1）")}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                {syncStatus === "synced"
                  ? t("Synced", "已同步")
                  : syncStatus === "syncing"
                    ? t("Syncing...", "同步中...")
                    : cloudSyncEnabled
                      ? t("On", "已启用")
                      : t("Off", "未开启")}
              </span>
            </div>
            <div className="mt-2 flex gap-1.5">
              <input
                value={cloudInput}
                onChange={(e) => setCloudInput(e.target.value)}
                placeholder={t("Enter Sync ID or email", "输入同步码 / 邮箱")}
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#161922] px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#00E5FF]"
              />
              <button
                type="button"
                onClick={() => {
                  const id = cloudInput.trim();
                  if (!id) {
                    showToast(t("Enter a Sync ID or email first", "请先输入云端同步码或邮箱"));
                    return;
                  }
                  void setCloudSync(!cloudSyncEnabled || cloudUserId !== id, id).then(() =>
                    showToast(t("Local & cloud progress merged", "本地打卡数组已与云端合并去重"))
                  );
                }}
                className="shrink-0 rounded-lg bg-[#00E5FF]/20 px-2.5 py-1.5 text-xs font-bold text-[#00E5FF] hover:bg-[#00E5FF]/30"
              >
                {cloudSyncEnabled ? t("Sync Now", "立即合并") : t("Enable", "开启")}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER CANVAS */}
      <div className="relative flex-1">
        <div className="pointer-events-none absolute left-3 right-3 top-3 z-[450] flex flex-wrap items-center justify-between gap-2">
          <div className="pointer-events-auto flex items-center gap-2">
            {!leftOpen && (
              <button
                type="button"
                onClick={() => setLeftOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-[#161922]/95 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur hover:border-[#00E5FF]"
              >
                <PanelLeftOpen className="h-4 w-4 text-[#00E5FF]" />
                {t("Layers & Filters", "图层与筛选")}
              </button>
            )}

            <div className="hidden items-center gap-1 rounded-xl border border-white/10 bg-[#161922]/90 p-1 backdrop-blur xl:flex">
              {LEONIDA_REGIONS.map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() =>
                    setFlyTarget({
                      x: reg.center.x,
                      y: reg.center.y,
                      zoom: 0,
                      seq: Date.now(),
                    })
                  }
                  className="rounded-lg px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition hover:bg-white/10 hover:text-[#00E5FF]"
                >
                  {isEn ? reg.en : reg.zh}
                </button>
              ))}
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSubmissionState({
                  open: true,
                  marker: null,
                  presetCoords: cursor,
                })
              }
              className="flex items-center gap-1.5 rounded-xl border border-[#FF2E93]/40 bg-[#161922]/95 px-3 py-2 text-xs font-bold text-[#FF2E93] shadow-lg backdrop-blur hover:bg-[#FF2E93] hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              {t("Submit Pin", "投稿新坐标")}
            </button>
          </div>
        </div>

        {/* Bottom-left Coordinate HUD */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-[450] flex items-center gap-2 rounded-xl border border-white/10 bg-[#12151F]/90 px-3 py-1.5 font-mono text-xs text-zinc-300 backdrop-blur">
          <Compass className="h-3.5 w-3.5 text-[#00E5FF]" />
          <span>{formatCoords(cursor.x, cursor.y)}</span>
          <span className="hidden text-[11px] text-zinc-500 sm:inline">
            · {t("Right-click map to copy share link", "右键地图复制精确坐标链接")}
          </span>
        </div>

        {toast && (
          <div className="absolute bottom-14 left-1/2 z-[600] -translate-x-1/2 rounded-full border border-[#00E5FF]/50 bg-[#161922]/95 px-4 py-2 text-xs font-semibold text-[#00E5FF] shadow-xl backdrop-blur">
            {toast}
          </div>
        )}

        <LeonidaMapEngine
          markers={filteredMarkers}
          completedIds={completedMarkers}
          selectedMarkerId={selectedMarker?.id ?? null}
          basemap={basemap}
          locale={locale}
          flyTarget={flyTarget}
          onSelectMarker={(m) => setSelectedMarker(m)}
          onCursorMove={setCursor}
          onCopyShareLink={(x, y) => handleCopyLink(x, y)}
          onSubmitAtCoords={(x, y) =>
            setSubmissionState({ open: true, marker: null, presetCoords: { x, y } })
          }
        />
      </div>

      {/* RIGHT DRAWER */}
      {selectedMarker && (
        <aside className="z-[500] flex h-full w-80 shrink-0 flex-col border-l border-white/10 bg-[#12151F]/98 shadow-2xl backdrop-blur-xl sm:w-96">
          <div className="flex items-start justify-between gap-2 border-b border-white/10 p-4">
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-bold",
                    CATEGORY_META[selectedMarker.category].bgClass,
                    CATEGORY_META[selectedMarker.category].textClass
                  )}
                >
                  {isEn
                    ? SUBTYPE_META[selectedMarker.subType]?.labelEn ?? selectedMarker.subType
                    : SUBTYPE_META[selectedMarker.subType]?.labelZh ?? selectedMarker.subType}
                </span>
                <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-zinc-300">
                  {isEn
                    ? `${selectedMarker.regionEn} · ${selectedMarker.region}`
                    : `${selectedMarker.region} · ${selectedMarker.regionEn}`}
                </span>
              </div>
              <h2 className="mt-2 text-base font-extrabold text-white">
                {isEn ? selectedMarker.titleEn : selectedMarker.titleZh}
              </h2>
              <p className="text-xs text-zinc-400">
                {isEn ? selectedMarker.titleZh : selectedMarker.titleEn}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedMarker(null)}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
              aria-label={t("Close details drawer", "关闭详情抽屉")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#1C2133] via-[#121622] to-[#0B0E16] p-4">
              <div className="flex items-center justify-between font-mono text-[11px] text-[#00E5FF]">
                <span>TACTICAL COORDS</span>
                <span>{formatCoords(selectedMarker.x, selectedMarker.y)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                <span>
                  {t("Region:", "所属大区：")} {isEn ? selectedMarker.regionEn : selectedMarker.region}
                </span>
                <span>
                  {selectedMarker.isVerified
                    ? t("Verified Pin", "已核实点位")
                    : t("Pending", "待核实")}
                </span>
              </div>
              {selectedMarker.contributor && (
                <div className="mt-2 text-[11px] text-zinc-500">
                  {t("Contributor:", "社区贡献者：")}{" "}
                  <span className="text-zinc-300">{selectedMarker.contributor}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => toggleMarker(selectedMarker.id)}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition",
                isSelectedDone
                  ? "border border-[#00E5FF]/50 bg-[#00E5FF]/15 text-[#00E5FF]"
                  : "neon-pink-glow bg-[#FF2E93] text-white hover:bg-[#ff47a0]"
              )}
            >
              {isSelectedDone ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t("Marked Collected (Click to Undo)", "已标记为收集（点击取消）")}
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" />
                  {t("Mark as Collected (Dims Pin)", "标记为已收集（图标自动降噪）")}
                </>
              )}
            </button>

            <div className="rounded-xl border border-white/10 bg-[#161922] p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                {t("Location & Guide Notes", "获取条件与攻略说明")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                {isEn
                  ? MARKER_DESC_EN[selectedMarker.id] ?? selectedMarker.descriptionMd
                  : selectedMarker.descriptionMd}
              </p>
            </div>

            {selectedMarker.linkedEntityId && selectedMarker.linkedEntityType && (
              <Link
                href={`/gta6/${
                  selectedMarker.linkedEntityType === "vehicle" ? "vehicles" : "weapons"
                }/${selectedMarker.linkedEntityId}`}
                className="flex items-center justify-between rounded-xl border border-[#00E5FF]/35 bg-[#00E5FF]/10 px-4 py-3 text-xs font-bold text-[#00E5FF] transition hover:bg-[#00E5FF]/20"
              >
                <span>
                  {selectedMarker.linkedEntityType === "vehicle"
                    ? t("View Linked Vehicle Specs", "查看关联载具完整图鉴面板")
                    : t("View Linked Weapon Specs", "查看关联武器完整图鉴面板")}
                </span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleCopyLink(selectedMarker.x, selectedMarker.y, selectedMarker.id)
                }
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#161922] px-3 py-2.5 text-xs font-semibold text-zinc-200 hover:border-[#00E5FF]/50"
              >
                <Share2 className="h-3.5 w-3.5 text-[#00E5FF]" />
                {t("Share Link", "分享坐标链接")}
              </button>
              <button
                type="button"
                onClick={() =>
                  setSubmissionState({
                    open: true,
                    marker: selectedMarker,
                    presetCoords: { x: selectedMarker.x, y: selectedMarker.y },
                  })
                }
                className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#161922] px-3 py-2.5 text-xs font-semibold text-zinc-200 hover:border-[#FF2E93]/50"
              >
                <Flag className="h-3.5 w-3.5 text-[#FF2E93]" />
                {t("Fix / Screenshot", "纠错 / 补图")}
              </button>
            </div>
          </div>
        </aside>
      )}

      <SubmissionModal
        key={`${submissionState.marker?.id ?? "new"}-${submissionState.presetCoords?.x ?? 0}-${submissionState.open}`}
        open={submissionState.open}
        marker={submissionState.marker}
        presetCoords={submissionState.presetCoords}
        onClose={() => setSubmissionState({ open: false })}
      />
    </div>
  );
}
