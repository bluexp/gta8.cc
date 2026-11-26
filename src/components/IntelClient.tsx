"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Radio,
  ExternalLink,
  RefreshCw,
  Clock,
  Database,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";

interface IntelItem {
  id: string;
  source: string;
  sourceType: string;
  title: string;
  summary: string;
  url: string;
  tags: string[];
  publishedAt: string;
  syncedAt: string;
}

interface SyncRun {
  id: string;
  triggerType: string;
  status: string;
  itemsFetched: number;
  itemsUpserted: number;
  startedAt: string;
  finishedAt: string | null;
}

interface IntelApiResponse {
  ok: boolean;
  connected: boolean;
  items: IntelItem[];
  recentRuns: SyncRun[];
  counts: { intel: number; markers: number; pendingSubmissions: number };
}

const SOURCE_FILTERS = [
  { id: "all", en: "All Sources", zh: "全部情报源" },
  { id: "gta6_news_en", en: "EN News", zh: "英文快讯" },
  { id: "gta6_news_zh", en: "中文快讯", zh: "中文快讯" },
  { id: "gta_wiki", en: "GTA Wiki", zh: "GTA Wiki 词条" },
  { id: "wikipedia", en: "Wikipedia", zh: "Wikipedia 动态" },
] as const;

const SOURCE_BADGE: Record<string, { en: string; zh: string; cls: string }> = {
  gta6_news_en: { en: "EN News", zh: "英文快讯", cls: "bg-emerald-500/15 text-emerald-300" },
  gta6_news_zh: { en: "ZH News", zh: "中文快讯", cls: "bg-[#FF2E93]/15 text-[#FF2E93]" },
  gta_wiki: { en: "GTA Wiki", zh: "GTA Wiki", cls: "bg-[#00E5FF]/15 text-[#00E5FF]" },
  wikipedia: { en: "Wikipedia", zh: "Wikipedia", cls: "bg-[#A855F7]/15 text-[#A855F7]" },
  rockstar: { en: "Rockstar", zh: "Rockstar", cls: "bg-amber-400/15 text-amber-300" },
};

export function IntelClient() {
  const { locale, t } = useLocale();
  const [source, setSource] = useState<string>("all");
  const [data, setData] = useState<IntelApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async (src: string) => {
    setLoading(true);
    try {
      const url =
        src === "all"
          ? "/api/intel?limit=50"
          : `/api/intel?source=${encodeURIComponent(src)}&limit=50`;
      const res = await fetch(url);
      const json = (await res.json()) as IntelApiResponse;
      setData(json);
    } catch {
      // keep previous
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(source);
  }, [source]);

  const latestRun = data?.recentRuns?.[0];
  const dateLocale = locale === "en" ? "en-US" : "zh-CN";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-white/10 bg-[#161922] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-3 py-1 text-xs font-bold text-[#00E5FF]">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              {t(
                "Cloudflare Cron Auto-Sync · Updates Every 6 Hours",
                "Cloudflare Cron 自动定时同步 · 每 6 小时更新"
              )}
            </span>
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              {t("GTA 6 Live Intel & Auto-Synced Feed", "GTA 6 实时情报与全网词条自动追踪")}
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              {t(
                "Automatically pulls GTA 6 English & Chinese news, GTA Wiki confirmed items, and Wikipedia updates into Cloudflare D1—zero manual redeploys.",
                "由 Cloudflare Workers 定时任务直连中英文资讯、GTA Wiki 与 Wikipedia 公开接口增量入库 Cloudflare D1，无需手动发版自动刷新。"
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void load(source)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0D0F14] px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-[#00E5FF]"
            >
              <RefreshCw className={cn("h-3.5 w-3.5 text-[#00E5FF]", loading && "animate-spin")} />
              {t("Refresh", "刷新列表")}
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF2E93] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#ff47a0]"
            >
              <Shield className="h-3.5 w-3.5" /> {t("Admin / Sync", "管理 / 手动同步")}
            </Link>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-[#0D0F14] p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <Database className="h-3.5 w-3.5 text-[#00E5FF]" />{" "}
              {t("Synced Intel in D1", "D1 已入库实时情报")}
            </div>
            <div className="mt-1 font-mono text-2xl font-black text-white">
              {data?.counts?.intel ?? 0}
              <span className="ml-1.5 text-xs font-normal text-zinc-500">
                {t("live entries", "条外部同步记录")}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#0D0F14] p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />{" "}
              {t("Latest Sync Run", "最近一次自动同步")}
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-emerald-400">
              {latestRun
                ? `${latestRun.status.toUpperCase()} · +${latestRun.itemsUpserted}`
                : t("Waiting for first run", "等待首次同步触发")}
            </div>
            <div className="mt-0.5 text-[11px] text-zinc-500">
              {latestRun ? new Date(latestRun.startedAt).toLocaleString(dateLocale) : "Cron: 0 */6 * * *"}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#0D0F14] p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-[#FF2E93]" />{" "}
              {t("Live Map Pins in D1", "D1 地图实时点位")}
            </div>
            <div className="mt-1 font-mono text-2xl font-black text-[#FF2E93]">
              {data?.counts?.markers ?? 0}
              <span className="ml-1.5 text-xs font-normal text-zinc-500">
                {t(
                  `Pending UGC: ${data?.counts?.pendingSubmissions ?? 0}`,
                  `待审投稿 ${data?.counts?.pendingSubmissions ?? 0}`
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSource(f.id)}
              className={cn(
                "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition",
                source === f.id
                  ? "bg-[#00E5FF] text-[#0D0F14]"
                  : "border border-white/10 bg-[#0D0F14] text-zinc-300 hover:border-white/25"
              )}
            >
              {t(f.en, f.zh)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {loading && !data ? (
          <div className="rounded-2xl border border-white/10 bg-[#161922] p-10 text-center text-sm text-zinc-400">
            {t("Loading live intel from Cloudflare D1...", "正在从 Cloudflare D1 读取实时情报...")}
          </div>
        ) : (data?.items?.length ?? 0) === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#161922] p-10 text-center">
            <p className="text-sm font-semibold text-white">
              {t("No synced entries for this source yet", "该情报源暂无同步记录")}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {t(
                "Cloudflare Cron runs every 6 hours, or trigger an immediate sync from /admin.",
                "Cloudflare Cron 每 6 小时自动运行，您也可以前往管理台立即手动触发一次同步。"
              )}
            </p>
            <Link
              href="/admin"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#FF2E93] px-4 py-2 text-xs font-bold text-white"
            >
              {t("Open /admin to Sync Now", "前往 /admin 立即同步")}
            </Link>
          </div>
        ) : (
          data?.items.map((item) => {
            const badge = SOURCE_BADGE[item.source] ?? {
              en: item.source,
              zh: item.source,
              cls: "bg-white/10 text-zinc-300",
            };
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-white/10 bg-[#161922] p-5 transition hover:border-[#00E5FF]/50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold", badge.cls)}>
                      {t(badge.en, badge.zh)}
                    </span>
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[11px] text-zinc-500">
                    {new Date(item.publishedAt).toLocaleString(dateLocale)}
                  </span>
                </div>

                <div className="mt-2 flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold text-white group-hover:text-[#00E5FF]">
                    {item.title}
                  </h2>
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-zinc-500 group-hover:text-[#FF2E93]" />
                </div>

                {item.summary && (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                    {item.summary}
                  </p>
                )}
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}
