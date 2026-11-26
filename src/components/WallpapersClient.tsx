"use client";

import { useState } from "react";
import {
  Smartphone,
  Download,
  Eye,
  X,
  Share2,
  Check,
  Sparkles,
  Wifi,
  Battery,
} from "lucide-react";
import { WALLPAPERS, type WallpaperItem } from "@/data/wallpapers";
import { useLocale } from "@/store/useLocaleStore";
import { cn } from "@/lib/utils";

const FILTER_TABS = [
  { id: "all", en: "All Wallpapers", zh: "全部壁纸" },
  { id: "vice-beach", en: "Vice Beach", zh: "罪恶海滩" },
  { id: "supercars", en: "Vehicles & Garage", zh: "载具与车库" },
  { id: "leonida-keys", en: "Wetlands & Dusk", zh: "湿地暮色" },
] as const;

export function WallpapersClient() {
  const { isEn, t } = useLocale();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [previewItem, setPreviewItem] = useState<WallpaperItem | null>(null);
  const [showClockOverlay, setShowClockOverlay] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const list =
    activeTab === "all"
      ? WALLPAPERS
      : WALLPAPERS.filter((w) => w.category === activeTab);

  const handleShare = (item: WallpaperItem) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://gta8.cc";
    const url = `${origin}/gta6/wallpapers#${item.slug}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#161922] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/15 px-3 py-1 text-xs font-bold text-[#FF2E93]">
              <Smartphone className="h-3.5 w-3.5" />
              {t("9:16 Vertical Mobile HD · Free Download", "9:16 竖屏高清手机壁纸 · 免费原图下载")}
            </span>
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              {t("GTA 6 Leonida Mobile Wallpapers", "GTA 6 雷奥奈达主题手机壁纸库")}
            </h1>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-zinc-400">
              {t(
                "Original Vice City & Leonida inspired AI fan-art wallpapers crafted specifically for iPhone & Android lock screens—clean dark upper sky for clock legibility, zero watermarks.",
                "专为 iPhone / Android 全面屏打造的原创罪恶都市与雷奥奈达霓虹风手机壁纸，顶部留白深色渐变适配锁屏时钟，无水印一键保存原图。"
              )}
            </p>
          </div>

          <div className="rounded-xl border border-[#00E5FF]/30 bg-[#0D0F14] px-4 py-3 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#00E5FF]">
              <Sparkles className="h-3.5 w-3.5" />
              {t("Lock-Screen Ready", "内置手机锁屏实机预览")}
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              {t(
                "Click any wallpaper to preview with a live lock-screen clock before saving.",
                "点击任意壁纸即可模拟真实手机锁屏时间效果，再一键下载原图。"
              )}
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-5 flex flex-wrap gap-2">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition",
                activeTab === tab.id
                  ? "bg-[#FF2E93] text-white shadow-[0_0_16px_rgba(255,46,147,0.35)]"
                  : "border border-white/10 bg-[#0D0F14] text-zinc-300 hover:border-white/25"
              )}
            >
              {t(tab.en, tab.zh)}
            </button>
          ))}
        </div>
      </div>

      {/* Wallpaper Grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <article
            key={item.id}
            id={item.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161922] transition hover:-translate-y-1 hover:border-[#00E5FF]/50"
          >
            {/* 9:16 Preview Frame */}
            <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#0A0C12]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageSrc}
                alt={isEn ? item.titleEn : item.titleZh}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Subtle Top Badges */}
              <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                <span className="rounded-full bg-[#0D0F14]/80 px-2.5 py-1 font-mono text-[10px] font-bold text-[#00E5FF] backdrop-blur">
                  {item.aspectRatio}
                </span>
                <div className="flex items-center gap-1 rounded-full bg-[#0D0F14]/80 px-2 py-1 backdrop-blur">
                  {item.palette.map((hex) => (
                    <span
                      key={hex}
                      className="h-2.5 w-2.5 rounded-full border border-white/25"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>

              {/* Hover Action Overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 pt-12">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewItem(item);
                    setShowClockOverlay(true);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-[#161922]/90 px-3 py-2 text-xs font-bold text-white backdrop-blur transition hover:border-[#00E5FF] hover:text-[#00E5FF]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t("Lock-Screen Preview", "锁屏预览")}
                </button>
                <a
                  href={item.imageSrc}
                  download={item.downloadName}
                  className="neon-pink-glow inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FF2E93] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#ff47a0]"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("Save HD", "下载原图")}
                </a>
              </div>
            </div>

            {/* Card Footer Details */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-base font-extrabold text-white">
                    {isEn ? item.titleEn : item.titleZh}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleShare(item)}
                    className="rounded-lg border border-white/10 bg-[#0D0F14] p-1.5 text-zinc-400 hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
                    title={t("Copy share link", "复制分享链接")}
                  >
                    {copiedId === item.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] font-mono text-zinc-500">
                  {isEn ? `${item.regionEn} · ${item.titleZh}` : `${item.regionZh} · ${item.titleEn}`}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {isEn ? item.descriptionEn : item.descriptionZh}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5 pt-2">
                {(isEn ? item.tagsEn : item.tagsZh).map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-white/10 bg-[#0D0F14] px-2 py-0.5 text-[10px] text-zinc-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Smartphone Lock-Screen Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-3xl flex-col items-center gap-6 rounded-3xl border border-white/15 bg-[#12151F] p-5 sm:flex-row sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="absolute right-4 top-4 rounded-xl bg-white/5 p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              aria-label={t("Close preview", "关闭预览")}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Phone Mockup */}
            <div className="relative aspect-[9/19.5] h-[68vh] max-h-[640px] shrink-0 overflow-hidden rounded-[2.6rem] border-[6px] border-zinc-800 bg-black shadow-[0_0_50px_rgba(255,46,147,0.28)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewItem.imageSrc}
                alt={isEn ? previewItem.titleEn : previewItem.titleZh}
                className="h-full w-full object-cover"
              />

              {/* Dynamic Island */}
              <div className="absolute left-1/2 top-2.5 h-5 w-24 -translate-x-1/2 rounded-full bg-black/95" />

              {showClockOverlay && (
                <>
                  {/* Status Bar */}
                  <div className="absolute left-5 right-5 top-3 flex items-center justify-between text-[10px] font-bold text-white drop-shadow">
                    <span>9:41</span>
                    <span className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      <Battery className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  {/* Lock Screen Clock */}
                  <div className="absolute inset-x-0 top-14 text-center text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]">
                    <div className="text-xs font-semibold tracking-wide opacity-90">
                      {t("Thursday, November 26", "11月26日 星期四")}
                    </div>
                    <div className="mt-0.5 font-sans text-6xl font-black tracking-tight">
                      21:08
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="absolute bottom-2.5 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-white/80" />
                </>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="rounded-full bg-[#FF2E93]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#FF2E93]">
                  {isEn ? previewItem.regionEn : previewItem.regionZh}
                </span>
                <h3 className="mt-2 text-xl font-black text-white">
                  {isEn ? previewItem.titleEn : previewItem.titleZh}
                </h3>
                <p className="font-mono text-xs text-zinc-400">
                  {isEn ? previewItem.titleZh : previewItem.titleEn}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-zinc-300">
                {isEn ? previewItem.descriptionEn : previewItem.descriptionZh}
              </p>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-[#0D0F14] px-3.5 py-2.5 text-xs text-zinc-200">
                <span>{t("Show Lock-Screen Clock Overlay", "显示锁屏时间与灵动岛模拟")}</span>
                <input
                  type="checkbox"
                  checked={showClockOverlay}
                  onChange={(e) => setShowClockOverlay(e.target.checked)}
                  className="h-4 w-4 accent-[#00E5FF]"
                />
              </label>

              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href={previewItem.imageSrc}
                  download={previewItem.downloadName}
                  className="neon-pink-glow flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF2E93] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#ff47a0]"
                >
                  <Download className="h-4 w-4" />
                  {t("Download Full-Res Mobile Wallpaper", "下载无水印高清原图 (HD JPG)")}
                </a>
                <button
                  type="button"
                  onClick={() => handleShare(previewItem)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#0D0F14] px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:border-[#00E5FF]"
                >
                  {copiedId === previewItem.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      {t("Link Copied!", "分享链接已复制！")}
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5 text-[#00E5FF]" />
                      {t("Copy Wallpaper Link", "复制壁纸直达链接")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
