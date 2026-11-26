"use client";

import { useState } from "react";
import { Calculator, DollarSign, Users } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";

const PRESET_HEISTS = [
  {
    en: "Maze Bank Vault (Silent)",
    zh: "花园银行旗舰金库（潜行）",
    gross: 2650000,
    setupFee: 45000,
    crewPct: 16,
  },
  {
    en: "Starfish Yacht Safe",
    zh: "星光岛私人游艇保险柜",
    gross: 1480000,
    setupFee: 25000,
    crewPct: 12,
  },
  {
    en: "Port Container Ambush",
    zh: "港口集装箱走私截击",
    gross: 920000,
    setupFee: 15000,
    crewPct: 10,
  },
];

export function HeistCalculator() {
  const { t } = useLocale();
  const [grossTake, setGrossTake] = useState(2650000);
  const [setupCost, setSetupCost] = useState(45000);
  const [crewCutPct, setCrewCutPct] = useState(16);
  const [fenceCutPct, setFenceCutPct] = useState(5);
  const [damageLossPct, setDamageLossPct] = useState(2);
  const [players, setPlayers] = useState(2);
  const [leaderSharePct, setLeaderSharePct] = useState(55);

  const afterDamage = Math.round(grossTake * (1 - damageLossPct / 100));
  const crewDeduction = Math.round(afterDamage * (crewCutPct / 100));
  const fenceDeduction = Math.round(afterDamage * (fenceCutPct / 100));
  const netPool = Math.max(0, afterDamage - crewDeduction - fenceDeduction - setupCost);

  const leaderNet =
    players === 1 ? netPool : Math.round(netPool * (leaderSharePct / 100));
  const partnerNet =
    players > 1 ? Math.round((netPool - leaderNet) / (players - 1)) : 0;

  return (
    <section className="rounded-2xl border border-[#00E5FF]/30 bg-[#161922] p-6 shadow-[0_0_32px_rgba(0,229,255,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00E5FF]/15 px-3 py-1 text-xs font-bold text-[#00E5FF]">
            <Calculator className="h-3.5 w-3.5" />
            {t("Interactive Tool", "交互式工具")}
          </span>
          <h2 className="mt-2 text-xl font-black text-white">
            {t("Leonida Heist Payout Calculator", "雷奥奈达抢劫收益速算器（Heist Payout Calculator）")}
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            {t(
              "Calculate exact net payout per player after NPC crew cuts, fencing fees, gunfire damage loss, and setup costs.",
              "一键试算原始战利品扣除 NPC 团队抽成、销赃费、中弹损耗与前置成本后的每人净到手收益。"
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {PRESET_HEISTS.map((p) => (
            <button
              key={p.en}
              type="button"
              onClick={() => {
                setGrossTake(p.gross);
                setSetupCost(p.setupFee);
                setCrewCutPct(p.crewPct);
              }}
              className="rounded-lg border border-white/10 bg-[#0D0F14] px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 hover:border-[#FF2E93]/60 hover:text-[#FF2E93]"
            >
              {t(p.en, p.zh)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="space-y-4 text-xs lg:col-span-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-zinc-300">{t("Gross Potential Take (USD)", "原始战利品总额 (USD)")}</span>
              <input
                type="number"
                step={50000}
                min={0}
                value={grossTake}
                onChange={(e) => setGrossTake(Math.max(0, Number(e.target.value)))}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0D0F14] px-3 py-2.5 font-mono text-sm font-bold text-[#00E5FF] outline-none focus:border-[#00E5FF]"
              />
            </label>
            <label className="block">
              <span className="text-zinc-300">{t("Setup / Prep Cost (USD)", "前置准备成本 (USD)")}</span>
              <input
                type="number"
                step={5000}
                min={0}
                value={setupCost}
                onChange={(e) => setSetupCost(Math.max(0, Number(e.target.value)))}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0D0F14] px-3 py-2.5 font-mono text-sm font-bold text-white outline-none focus:border-[#00E5FF]"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <div className="flex justify-between">
                <span className="text-zinc-400">{t("NPC Crew Cut", "NPC 团队总抽成")}</span>
                <span className="font-mono font-bold text-[#FF2E93]">{crewCutPct}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={35}
                value={crewCutPct}
                onChange={(e) => setCrewCutPct(Number(e.target.value))}
                className="mt-2 w-full accent-[#FF2E93]"
              />
            </label>

            <label className="block">
              <div className="flex justify-between">
                <span className="text-zinc-400">{t("Fencing Fee", "黑市销赃费")}</span>
                <span className="font-mono font-bold text-amber-300">{fenceCutPct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={fenceCutPct}
                onChange={(e) => setFenceCutPct(Number(e.target.value))}
                className="mt-2 w-full accent-amber-400"
              />
            </label>

            <label className="block">
              <div className="flex justify-between">
                <span className="text-zinc-400">{t("Damage Loss", "交火战损")}</span>
                <span className="font-mono font-bold text-rose-400">{damageLossPct}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={damageLossPct}
                onChange={(e) => setDamageLossPct(Number(e.target.value))}
                className="mt-2 w-full accent-rose-500"
              />
            </label>
          </div>

          <div className="grid gap-4 rounded-xl border border-white/10 bg-[#0D0F14] p-4 sm:grid-cols-2">
            <div>
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Users className="h-3.5 w-3.5 text-[#00E5FF]" /> {t("Players Splitting", "参与分红人数")}
              </span>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPlayers(n)}
                    className={`flex-1 rounded-lg py-1.5 font-mono font-bold transition ${
                      players === n
                        ? "bg-[#00E5FF] text-[#0D0F14]"
                        : "bg-[#161922] text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t(`${n}P`, `${n}人`)}
                  </button>
                ))}
              </div>
            </div>

            {players > 1 && (
              <div>
                <div className="flex justify-between text-zinc-300">
                  <span>{t("Leader Share", "主策划（队长）占比")}</span>
                  <span className="font-mono font-bold text-[#00E5FF]">{leaderSharePct}%</span>
                </div>
                <input
                  type="range"
                  min={25}
                  max={85}
                  step={5}
                  value={leaderSharePct}
                  onChange={(e) => setLeaderSharePct(Number(e.target.value))}
                  className="mt-3 w-full accent-[#00E5FF]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0D0F14] p-5 lg:col-span-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              {t("Total Net Team Payout", "团队净到手总收益")}
            </div>
            <div className="mt-1 font-mono text-3xl font-black text-emerald-400">
              {formatMoney(netPool)}
            </div>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>{t("Take After Damage", "战损后实收")}</span>
                <span className="font-mono text-zinc-200">{formatMoney(afterDamage)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{t(`NPC Crew Cut (${crewCutPct}%)`, `NPC 团队抽成 (${crewCutPct}%)`)}</span>
                <span className="font-mono text-rose-400">-{formatMoney(crewDeduction)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>{t("Fence & Setup Cost", "销赃与前置费")}</span>
                <span className="font-mono text-rose-400">
                  -{formatMoney(fenceDeduction + setupCost)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
            <div className="rounded-xl border border-[#FF2E93]/30 bg-[#FF2E93]/10 p-3">
              <div className="text-[11px] text-[#FF2E93]">{t("Leader Net", "主策划净收益")}</div>
              <div className="mt-1 font-mono text-lg font-black text-white">
                {formatMoney(leaderNet)}
              </div>
            </div>
            <div className="rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/10 p-3">
              <div className="text-[11px] text-[#00E5FF]">
                {players > 1
                  ? t(`Each Partner (x${players - 1})`, `其余 ${players - 1} 名队员每人`)
                  : t("Solo Take", "单人独享")}
              </div>
              <div className="mt-1 font-mono text-lg font-black text-white">
                {players > 1 ? formatMoney(partnerNet) : formatMoney(leaderNet)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
