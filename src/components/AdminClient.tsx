"use client";

import { useState } from "react";
import {
  Shield,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Lock,
  Database,
  Play,
} from "lucide-react";
import { useLocale } from "@/store/useLocaleStore";

interface SubmissionItem {
  id: string;
  markerId: string | null;
  nickname: string;
  status: string;
  createdAt: string;
  payload: {
    titleZh?: string;
    titleEn?: string;
    category?: string;
    x?: number;
    y?: number;
    descriptionMd?: string;
  };
}

interface SyncSourceStat {
  source: string;
  ok: boolean;
  fetched: number;
  upserted: number;
  error?: string;
}

export function AdminClient() {
  const { locale, t } = useLocale();
  const [token, setToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    runId: string;
    status: string;
    itemsFetched: number;
    itemsUpserted: number;
    sources: SyncSourceStat[];
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadSubmissions = async (tok: string) => {
    setAuthError(null);
    const res = await fetch("/api/admin/submissions", {
      headers: { "x-admin-token": tok },
    });
    const data = (await res.json()) as {
      ok?: boolean;
      error?: string;
      submissions?: SubmissionItem[];
    };
    if (!res.ok || !data.ok) {
      setAuthError(data.error ?? t("Authentication failed", "验证失败"));
      setUnlocked(false);
      return;
    }
    setSubmissions(data.submissions ?? []);
    setUnlocked(true);
  };

  const triggerSync = async () => {
    setSyncing(true);
    setToast(null);
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST",
        headers: { "x-admin-token": token },
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        summary?: {
          runId: string;
          status: string;
          itemsFetched: number;
          itemsUpserted: number;
          sources: SyncSourceStat[];
        };
      };
      if (!res.ok || !data.ok || !data.summary) {
        setToast(data.error ?? t("Sync failed", "同步失败"));
      } else {
        setSyncResult(data.summary);
        setToast(
          t(
            `Sync complete: fetched ${data.summary.itemsFetched}, upserted ${data.summary.itemsUpserted}`,
            `同步完成：拉取 ${data.summary.itemsFetched} 条，入库 ${data.summary.itemsUpserted} 条`
          )
        );
      }
    } catch {
      setToast(t("Network error while syncing", "网络异常，无法触发同步"));
    } finally {
      setSyncing(false);
    }
  };

  const reviewSubmission = async (submissionId: string, action: "approve" | "reject") => {
    const res = await fetch("/api/admin/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": token,
      },
      body: JSON.stringify({ submissionId, action }),
    });
    const data = (await res.json()) as { ok?: boolean; markerId?: string; error?: string };
    if (res.ok && data.ok) {
      setToast(
        action === "approve"
          ? t(
              `Approved and published live to map (${data.markerId})`,
              `已审核通过并实时上架至大地图 (${data.markerId})`
            )
          : t("Submission rejected", "已驳回该条投稿")
      );
      await loadSubmissions(token);
    } else {
      setToast(data.error ?? t("Action failed", "操作失败"));
    }
  };

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-white/10 bg-[#161922] p-6 shadow-2xl">
          <div className="flex items-center gap-2 text-[#FF2E93]">
            <Lock className="h-5 w-5" />
            <h1 className="text-lg font-extrabold text-white">
              {t("GTA8.cc Admin & Sync Console", "GTA8.cc 数据与审核管理台")}
            </h1>
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            {t(
              "Trigger manual Cloudflare D1 data syncs and review community map submissions. Enter your configured ADMIN_TOKEN.",
              "用于手动触发 Cloudflare D1 全源同步与审核玩家提交的地图坐标纠错，请输入通过 ADMIN_TOKEN 配置的管理员口令。"
            )}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void loadSubmissions(token);
            }}
            className="mt-5 space-y-3"
          >
            <input
              type="password"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t("Enter ADMIN_TOKEN...", "输入管理员口令...")}
              className="w-full rounded-xl border border-white/10 bg-[#0D0F14] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#00E5FF]"
            />
            {authError && <p className="text-xs text-rose-400">{authError}</p>}
            <button
              type="submit"
              className="neon-pink-glow w-full rounded-xl bg-[#FF2E93] py-2.5 text-sm font-bold text-white hover:bg-[#ff47a0]"
            >
              {t("Sign In", "进入管理台")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#161922] p-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00E5FF]">
            <Shield className="h-4 w-4" />{" "}
            {t("Cloudflare D1 Live Ops", "Cloudflare D1 实时运维中心")}
          </span>
          <h1 className="mt-1 text-2xl font-black text-white">
            {t("Auto-Sync Engine & UGC Review", "自动同步引擎 & 社区点位审核台")}
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            {t(
              "Cron schedule 0 */6 * * * runs automatically every 6 hours; approved pins go live on /gta6/map immediately.",
              "Cron 计划 0 */6 * * * 每 6 小时自动运行；审核通过的点位立即写入 D1 并上线大地图。"
            )}
          </p>
        </div>

        <button
          type="button"
          disabled={syncing}
          onClick={() => void triggerSync()}
          className="neon-cyan-glow inline-flex items-center gap-2 rounded-xl bg-[#00E5FF] px-4 py-2.5 text-xs font-extrabold text-[#0D0F14] transition hover:opacity-90 disabled:opacity-50"
        >
          {syncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {syncing
            ? t("Syncing Public Sources...", "正在抓取公开数据源...")
            : t("Run Full Sync Now", "立即执行全源同步")}
        </button>
      </div>

      {toast && (
        <div className="mt-4 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-4 py-3 text-xs font-semibold text-[#00E5FF]">
          {toast}
        </div>
      )}

      {syncResult && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-[#161922] p-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white">
              {t(
                `Sync Run (${syncResult.runId}) · Status: ${syncResult.status}`,
                `本次同步结果 (${syncResult.runId}) · 状态：${syncResult.status}`
              )}
            </span>
            <span className="font-mono text-[#00E5FF]">
              {t(
                `Fetched ${syncResult.itemsFetched} / Upserted ${syncResult.itemsUpserted}`,
                `拉取 ${syncResult.itemsFetched} / 入库 ${syncResult.itemsUpserted}`
              )}
            </span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {syncResult.sources.map((s) => (
              <div
                key={s.source}
                className="rounded-xl border border-white/10 bg-[#0D0F14] p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white">{s.source}</span>
                  <span className={s.ok ? "text-emerald-400" : "text-rose-400"}>
                    {s.ok ? "OK" : "ERR"}
                  </span>
                </div>
                <div className="mt-1 text-zinc-400">
                  {t(
                    `Fetched ${s.fetched} · Saved ${s.upserted}`,
                    `抓取 ${s.fetched} · 写入 ${s.upserted}`
                  )}
                </div>
                {s.error && <div className="mt-1 text-[11px] text-rose-400">{s.error}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#161922] p-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <Database className="h-4 w-4 text-[#FF2E93]" />
            {t(
              `Community Submissions Queue (${submissions.length})`,
              `玩家投稿与坐标纠错队列（共 ${submissions.length} 条）`
            )}
          </h2>
          <button
            type="button"
            onClick={() => void loadSubmissions(token)}
            className="text-xs text-[#00E5FF] hover:underline"
          >
            {t("Refresh Queue", "刷新队列")}
          </button>
        </div>

        {submissions.length === 0 ? (
          <p className="mt-4 text-xs text-zinc-400">
            {t("No community submissions yet.", "暂无社区投稿记录。")}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {submissions.map((s) => (
              <div
                key={s.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-[#0D0F14] p-4 sm:flex-row sm:items-center"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        s.status === "approved"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : s.status === "rejected"
                            ? "bg-rose-500/15 text-rose-400"
                            : "bg-amber-400/15 text-amber-300"
                      }`}
                    >
                      {s.status}
                    </span>
                    <span className="font-bold text-white">
                      {s.payload.titleEn || s.payload.titleZh || "Untitled Pin"}
                    </span>
                    <span className="font-mono text-[#00E5FF]">
                      X {s.payload.x}, Y {s.payload.y}
                    </span>
                  </div>
                  <p className="text-zinc-400">{s.payload.descriptionMd}</p>
                  <p className="text-[11px] text-zinc-500">
                    {t("By:", "贡献者：")} {s.nickname} · ID: {s.id} ·{" "}
                    {new Date(s.createdAt).toLocaleString(locale === "en" ? "en-US" : "zh-CN")}
                  </p>
                </div>

                {s.status === "pending" && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => void reviewSubmission(s.id, "approve")}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-[#0D0F14]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> {t("Approve", "通过上架")}
                    </button>
                    <button
                      type="button"
                      onClick={() => void reviewSubmission(s.id, "reject")}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300"
                    >
                      <XCircle className="h-3.5 w-3.5" /> {t("Reject", "驳回")}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
