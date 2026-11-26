"use client";

import { useMemo, useState } from "react";
import { Gamepad2, Search, Copy, Check, AlertTriangle, Phone } from "lucide-react";
import { CHEAT_CODES } from "@/data/cheats";
import { CHEAT_EFFECT_EN } from "@/data/en-copy";
import { CHEAT_CAT_EN } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";
import type { CheatButton, CheatCode } from "@/types/gta";

type Platform = "ps5" | "xbox" | "phone";

const CATEGORIES: Array<"全部" | CheatCode["category"]> = [
  "全部",
  "角色状态",
  "通缉与战斗",
  "载具生成",
  "世界效果",
];

const PS5_GLYPH: Record<CheatButton, { label: string; style: string }> = {
  UP: { label: "↑", style: "border-zinc-500/60 bg-zinc-800 text-white" },
  DOWN: { label: "↓", style: "border-zinc-500/60 bg-zinc-800 text-white" },
  LEFT: { label: "←", style: "border-zinc-500/60 bg-zinc-800 text-white" },
  RIGHT: { label: "→", style: "border-zinc-500/60 bg-zinc-800 text-white" },
  TRIANGLE: { label: "△", style: "border-emerald-400/70 bg-emerald-500/15 text-emerald-300" },
  CIRCLE: { label: "○", style: "border-rose-400/70 bg-rose-500/15 text-rose-300" },
  CROSS: { label: "×", style: "border-sky-400/70 bg-sky-500/15 text-sky-300" },
  SQUARE: { label: "□", style: "border-pink-400/70 bg-pink-500/15 text-pink-300" },
  L1: { label: "L1", style: "border-white/30 bg-[#0D0F14] text-zinc-100 rounded-md px-2" },
  R1: { label: "R1", style: "border-white/30 bg-[#0D0F14] text-zinc-100 rounded-md px-2" },
  L2: { label: "L2", style: "border-[#00E5FF]/50 bg-[#00E5FF]/10 text-[#00E5FF] rounded-md px-2" },
  R2: { label: "R2", style: "border-[#FF2E93]/50 bg-[#FF2E93]/10 text-[#FF2E93] rounded-md px-2" },
};

function xboxStyle(btn: string): string {
  switch (btn) {
    case "A":
      return "border-emerald-400/70 bg-emerald-500/15 text-emerald-300";
    case "B":
      return "border-rose-400/70 bg-rose-500/15 text-rose-300";
    case "X":
      return "border-sky-400/70 bg-sky-500/15 text-sky-300";
    case "Y":
      return "border-amber-400/70 bg-amber-500/15 text-amber-300";
    case "LT":
      return "border-[#00E5FF]/50 bg-[#00E5FF]/10 text-[#00E5FF] rounded-md px-2";
    case "RT":
      return "border-[#FF2E93]/50 bg-[#FF2E93]/10 text-[#FF2E93] rounded-md px-2";
    case "LB":
    case "RB":
      return "border-white/30 bg-[#0D0F14] text-zinc-100 rounded-md px-2";
    default:
      return "border-zinc-500/60 bg-zinc-800 text-white";
  }
}

function formatXboxArrow(btn: string): string {
  if (btn === "UP") return "↑";
  if (btn === "DOWN") return "↓";
  if (btn === "LEFT") return "←";
  if (btn === "RIGHT") return "→";
  return btn;
}

export function CheatsClient() {
  const { isEn, t } = useLocale();
  const [platform, setPlatform] = useState<Platform>("ps5");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("全部");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHEAT_CODES.filter((c) => {
      if (category !== "全部" && c.category !== category) return false;
      const effEn = CHEAT_EFFECT_EN[c.id] ?? "";
      if (
        q &&
        !c.titleZh.toLowerCase().includes(q) &&
        !c.titleEn.toLowerCase().includes(q) &&
        !c.effect.toLowerCase().includes(q) &&
        !effEn.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [category, query]);

  const copyText = (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-white/10 bg-[#161922] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFB800]/15 px-3 py-1 text-xs font-bold text-[#FFB800]">
              <Gamepad2 className="h-3.5 w-3.5" />
              {t(
                "PS5 DualSense / Xbox Series X|S Visual Reference",
                "PS5 DualSense / Xbox Series X|S 可视化速查表"
              )}
            </span>
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              {t("GTA 6 Controller Cheat Codes", "GTA 6 手柄作弊码大全（按键图示版）")}
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              {t(
                "Enter button combos directly during gameplay without pausing, or dial the phone number on your in-game smartphone.",
                "在游戏中无需暂停直接快速输入按键组合，或打开角色手机拨号键盘输入对应号码激活。"
              )}
            </p>
          </div>

          <div className="flex rounded-xl border border-white/10 bg-[#0D0F14] p-1 text-xs font-bold">
            {(
              [
                { id: "ps5", en: "PS5", zh: "PS5 手柄" },
                { id: "xbox", en: "Xbox", zh: "Xbox 手柄" },
                { id: "phone", en: "Phone Dial", zh: "游戏内拨号" },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={cn(
                  "rounded-lg px-3.5 py-2 transition",
                  platform === p.id
                    ? "bg-[#FF2E93] text-white"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {t(p.en, p.zh)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            {t(
              "Trophy Notice: Activating cheats temporarily disables PS5 Trophies / Xbox Achievements for the current session. Keep a separate clean save slot.",
              "奖杯提醒：激活任意作弊码会暂时禁用当前游戏会话的 PS5 奖杯 / Xbox 成就，建议开玩前单独保留一份干净存档。"
            )}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                  category === cat
                    ? "bg-[#00E5FF] text-[#0D0F14]"
                    : "border border-white/10 bg-[#0D0F14] text-zinc-300 hover:border-white/25"
                )}
              >
                {cat === "全部" ? t("All", "全部") : isEn ? CHEAT_CAT_EN[cat] : cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Filter invincibility, wanted, weather...", "筛选无敌、消星、超跑、天气...")}
              className="w-60 rounded-xl border border-white/10 bg-[#0D0F14] py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-[#00E5FF]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {list.map((cheat) => {
          const textToCopy =
            platform === "phone"
              ? cheat.phone
              : platform === "ps5"
                ? cheat.ps5.map((b) => PS5_GLYPH[b].label).join(" ")
                : cheat.xbox.map(formatXboxArrow).join(" ");

          return (
            <div
              key={cheat.id}
              id={cheat.id}
              className="rounded-2xl border border-white/10 bg-[#161922] p-5 transition hover:border-white/25"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
                    {isEn ? CHEAT_CAT_EN[cheat.category] : cheat.category}
                  </span>
                  <h2 className="mt-1.5 text-base font-extrabold text-white">
                    {isEn ? cheat.titleEn : cheat.titleZh}
                  </h2>
                  <p className="font-mono text-[11px] text-zinc-500">
                    {isEn ? cheat.titleZh : cheat.titleEn}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyText(cheat.id, textToCopy)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 bg-[#0D0F14] px-2.5 py-1.5 text-[11px] font-semibold text-zinc-300 hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
                >
                  {copiedId === cheat.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> {t("Copied", "已复制")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> {t("Copy", "复制")}
                    </>
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-zinc-300">
                {isEn ? CHEAT_EFFECT_EN[cheat.id] ?? cheat.effect : cheat.effect}
              </p>

              <div className="mt-4 rounded-xl border border-white/5 bg-[#0D0F14] p-3.5">
                {platform === "ps5" && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {cheat.ps5.map((btn, idx) => {
                      const g = PS5_GLYPH[btn];
                      return (
                        <span
                          key={`${cheat.id}-ps-${idx}`}
                          className={cn(
                            "inline-flex h-8 min-w-8 items-center justify-center rounded-full border font-mono text-xs font-extrabold shadow-sm",
                            g.style
                          )}
                        >
                          {g.label}
                        </span>
                      );
                    })}
                  </div>
                )}

                {platform === "xbox" && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {cheat.xbox.map((btn, idx) => (
                      <span
                        key={`${cheat.id}-xb-${idx}`}
                        className={cn(
                          "inline-flex h-8 min-w-8 items-center justify-center rounded-full border font-mono text-xs font-extrabold shadow-sm",
                          xboxStyle(btn)
                        )}
                      >
                        {formatXboxArrow(btn)}
                      </span>
                    ))}
                  </div>
                )}

                {platform === "phone" && (
                  <div className="flex items-center justify-between font-mono text-base font-bold text-[#00E5FF]">
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#FF2E93]" />
                      {cheat.phone}
                    </span>
                    <span className="text-[11px] font-normal text-zinc-500">
                      {t("In-Game Phone", "游戏手机拨号")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
