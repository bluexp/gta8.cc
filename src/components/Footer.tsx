"use client";

import Link from "next/link";
import { useLocale } from "@/store/useLocaleStore";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-white/10 bg-[#0A0C10] text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="rounded bg-gradient-to-r from-[#FF2E93] to-[#00E5FF] px-2 py-0.5 text-xs font-black text-[#0D0F14]">
                GTA8.cc
              </span>
              <span className="text-sm font-bold text-white">
                {t(
                  "GTA 6 Leonida Interactive Map & Complete Wiki",
                  "GTA 吧 · 雷奥奈达交互地图与全图鉴"
                )}
              </span>
            </div>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-zinc-400">
              {t(
                "All-in-one GTA 6 interactive Leonida map, zero-login local & cloud progress tracker, bilingual vehicles & weapons wiki, live auto-synced intel, and PS5/Xbox cheat codes.",
                "面向中文玩家的《GTA 6》一站式实用工具站与全收集数据库：高精度雷奥奈达交互式大地图、免登录本地/云端进度追踪、中英双语零延迟图鉴检索与手柄作弊码速查。"
              )}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              <a
                href="https://github.com/bluexp/gta8.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-2.5 py-1 font-semibold text-[#00E5FF] transition hover:bg-[#00E5FF]/20"
              >
                {t("Open Source · MIT License (GitHub)", "完全开源 · MIT 协议 (GitHub)")}
              </a>
              <span className="rounded-full border border-white/10 bg-[#161922] px-2.5 py-1 text-zinc-300">
                {t("Cloudflare Workers Edge", "Cloudflare Workers 边缘加速")}
              </span>
              <span className="rounded-full border border-white/10 bg-[#161922] px-2.5 py-1 text-zinc-300">
                {t("Cloudflare D1 Live Sync", "Cloudflare D1 实时同步")}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              {t("Core Tools", "核心工具")}
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/gta6/map" className="hover:text-[#00E5FF]">
                  {t("Leonida Interactive Map", "雷奥奈达交互大地图")}
                </Link>
              </li>
              <li>
                <Link href="/gta6/intel" className="hover:text-[#00E5FF]">
                  {t("Live Auto-Synced Intel", "GTA 6 实时自动同步情报")}
                </Link>
              </li>
              <li>
                <Link href="/gta6/checklist" className="hover:text-[#00E5FF]">
                  {t("100% Completion & Trophies", "100% 完成度与全奖杯清单")}
                </Link>
              </li>
              <li>
                <Link href="/gta6/cheats" className="hover:text-[#00E5FF]">
                  {t("PS5 / Xbox Cheat Codes", "PS5 / Xbox 手柄作弊码")}
                </Link>
              </li>
              <li>
                <Link href="/gta6/guides" className="hover:text-[#00E5FF]">
                  {t("Heist Calculator & Guides", "抢劫收益速算器与攻略专栏")}
                </Link>
              </li>
              <li>
                <Link href="/gta6/wallpapers" className="hover:text-[#FF2E93]">
                  {t("9:16 Mobile Wallpapers", "GTA 6 高清手机壁纸库")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              {t("Encyclopedia", "双语图鉴库")}
            </h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/gta6/vehicles" className="hover:text-[#FF2E93]">
                  {t("Vehicles Stats & Spawns", "全载具参数与刷新点图鉴")}
                </Link>
              </li>
              <li>
                <Link href="/gta6/weapons" className="hover:text-[#FF2E93]">
                  {t("Weapons & Attachments", "武器面板与改装配件库")}
                </Link>
              </li>
              <li>
                <Link href="/gta6/collectibles" className="hover:text-[#FF2E93]">
                  {t("Collectibles & Stunt Jumps", "WAiNK 扫描与特技飞跃指南")}
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-[#FF2E93]">
                  {t("XML Sitemap", "Sitemap 索引地图")}
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/bluexp/gta8.cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00E5FF]"
                >
                  {t("GitHub Repository (MIT)", "GitHub 源码仓库 (MIT)")}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/bluexp/gta8.cc/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00E5FF]"
                >
                  {t("Contributing & Self-Hosting", "参与贡献与自部署指南")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5 text-[11px] leading-relaxed text-zinc-500">
          <p>
            <strong className="text-zinc-400">
              {t("Unofficial Fan Community Disclaimer: ", "非官方社区免责声明：")}
            </strong>
            {t(
              "GTA8.cc is an independent, unofficial fan-maintained community database and map tool not affiliated with, endorsed, or sponsored by Rockstar Games or Take-Two Interactive Software, Inc. All game titles, trademarks, vehicle names, and locations belong to their respective owners.",
              "GTA8.cc 为非官方中文玩家自发维护的游戏资料与工具社区，与 Rockstar Games、Take-Two Interactive Software, Inc. 无任何隶属、授权或赞助关系。文中提及的游戏名称、载具名称、角色、地图区域及商标归其各自所有者所有。"
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
