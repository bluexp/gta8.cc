"use client";

import Link from "next/link";
import {
  Map,
  CheckSquare,
  Car,
  Crosshair,
  Sparkles,
  Gamepad2,
  Calculator,
  Radio,
  ArrowUpRight,
  Compass,
  Zap,
  ShieldCheck,
  Github,
  GitPullRequest,
  Scale,
} from "lucide-react";
import { GlobalSearch } from "@/components/GlobalSearch";
import { HomeProgressOverview } from "@/components/HomeProgressOverview";
import { VEHICLES } from "@/data/vehicles";
import { MAP_MARKERS } from "@/data/markers";
import { formatMoney } from "@/lib/utils";
import { useLocale } from "@/store/useLocaleStore";

const TOOLS_MATRIX = [
  {
    href: "/gta6/map",
    enTitle: "Interactive Leonida Map",
    zhTitle: "雷奥奈达交互大地图",
    subtitleEn: "Satellite & Vector Layers",
    subtitleZh: "Interactive Leonida Map",
    enDesc: "Switch satellite/road layers, cluster markers, share exact coordinates, and dim collected pins.",
    zhDesc: "卫星/路网底图切换、点位聚合、右键分享精确坐标、勾选半透明降噪。",
    enBadge: "Core Engine",
    zhBadge: "核心引擎",
    accent: "#FF2E93",
    icon: Map,
  },
  {
    href: "/gta6/intel",
    enTitle: "Live GTA 6 Intel Feed",
    zhTitle: "GTA 6 实时自动同步情报",
    subtitleEn: "Auto-Synced Every 6h",
    subtitleZh: "Cloudflare Cron + D1",
    enDesc: "Automatically pulls latest GTA 6 news, GTA Wiki confirmed items, and Wikipedia updates into D1.",
    zhDesc: "Cloudflare Cron 每 6 小时自动抓取中文快讯、GTA Wiki 与 Wikipedia 最新变动。",
    enBadge: "Auto-Sync",
    zhBadge: "自动更新",
    accent: "#00E5FF",
    icon: Radio,
  },
  {
    href: "/gta6/checklist",
    enTitle: "100% Completion & Trophies",
    zhTitle: "100% 完成度与全奖杯清单",
    subtitleEn: "Two-Way Map Sync",
    subtitleZh: "100% Completion Tracker",
    enDesc: "Bidirectionally synced with map markers across story chapters, collectibles, stunts, and trophies.",
    zhDesc: "与大地图标点双向实时同步，按章节/收集品/奖杯逐项打卡追踪。",
    enBadge: "Synced",
    zhBadge: "双向联动",
    accent: "#00E5FF",
    icon: CheckSquare,
  },
  {
    href: "/gta6/vehicles",
    enTitle: "Vehicles Database",
    zhTitle: "载具全图鉴与防盗分级",
    subtitleEn: `${VEHICLES.length} Curated Rides`,
    subtitleZh: "Vehicles Database",
    enDesc: "Top speed & handling radar charts, Tier 1–5 anti-theft breakdown, and embedded spawn maps.",
    zhDesc: "极速/操控雷达面板、1–5 级防盗解析、内置迷你定位地图一键直达刷新点。",
    enBadge: "Stats & Spawns",
    zhBadge: `${VEHICLES.length} 款精选`,
    accent: "#00E5FF",
    icon: Car,
  },
  {
    href: "/gta6/weapons",
    enTitle: "Weapons & Loadouts",
    zhTitle: "武器装备与配件库",
    subtitleEn: "Gun Van Linked",
    subtitleZh: "Weapons & Loadouts",
    enDesc: "Damage, fire rate, accuracy & range bars, recommended attachments, and Gun Van coordinates.",
    zhDesc: "伤害/射速/射程数值条、黑市军火车刷新坐标与改装配件推荐。",
    enBadge: "Armory",
    zhBadge: "黑市联动",
    accent: "#A855F7",
    icon: Crosshair,
  },
  {
    href: "/gta6/collectibles",
    enTitle: "Collectibles Guide",
    zhTitle: "全收集品攻略库",
    subtitleEn: "WAiNK, Stunts & Packages",
    subtitleZh: "Collectibles Guide",
    enDesc: "Track WAiNK scans, Stunt Jumps, Hidden Packages, and Neon Magazines with one-click map flight.",
    zhDesc: "WAiNK 扫描点、特技飞跃、水下隐藏包裹与霓虹杂志图文坐标。",
    enBadge: "Fly-to-Map",
    zhBadge: "一键飞图",
    accent: "#FF2E93",
    icon: Sparkles,
  },
  {
    href: "/gta6/cheats",
    enTitle: "PS5 / Xbox Cheat Codes",
    zhTitle: "PS5 / Xbox 手柄作弊码",
    subtitleEn: "Visual Controller Icons",
    subtitleZh: "Controller Cheat Codes",
    enDesc: "Visual DualSense & Xbox button icons plus in-game phone dial numbers with instant copy.",
    zhDesc: "可视化 DualSense / Xbox 按键图标与手机拨号代码，支持一键筛选。",
    enBadge: "Quick Sheet",
    zhBadge: "高传播速查",
    accent: "#FFB800",
    icon: Gamepad2,
  },
  {
    href: "/gta6/guides",
    enTitle: "Heist Calculator & Guides",
    zhTitle: "抢劫收益速算器 & 专栏",
    subtitleEn: "Interactive Payout Tool",
    subtitleZh: "Heist Calculator & Guides",
    enDesc: "Calculate net player splits after crew cuts, fence fees, and damage loss—plus story & easter egg guides.",
    zhDesc: "双主角与团队抽成净收益实时试算，含剧情分支与罪恶都市经典彩蛋。",
    enBadge: "Calculator",
    zhBadge: "交互计算器",
    accent: "#22C55E",
    icon: Calculator,
  },
];

export function HomeClient() {
  const { isEn, t } = useLocale();
  const hotVehicles = VEHICLES.slice(0, 4);
  const hotMarkers = MAP_MARKERS.slice(0, 4);

  return (
    <div className="vice-grid-bg">
      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pt-14">
        <div className="grid items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF2E93]/40 bg-[#FF2E93]/10 px-3 py-1 text-xs font-semibold text-[#FF2E93]">
              <Zap className="h-3.5 w-3.5" />
              <span>
                {t(
                  "GTA8.cc · Dark Neon Mode · Powered by Cloudflare Edge & D1",
                  "GTA8.cc · 暗黑霓虹护眼模式 · Cloudflare 全球边缘加速"
                )}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl sm:leading-[1.12]">
              {t("Leonida Interactive Map", "雷奥奈达交互地图")}
              <span className="block bg-gradient-to-r from-[#FF2E93] via-[#FF73B8] to-[#00E5FF] bg-clip-text text-transparent">
                {t("GTA 6 All-in-One Tools & Wiki", "GTA 6 一站式工具与全图鉴")}
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              {t(
                "Explore every corner of Leonida with instant EN/中文 fuzzy search, zero-login local & cloud checklist tracking, shareable coordinates, and live auto-synced GTA 6 intel.",
                "专为开荒玩家打造的 Tool + Wiki 数据库。支持毫秒级中英双语/拼音模糊检索、免登录本地打卡进度持久化、坐标精准分享与全载具武器图鉴联动。"
              )}
            </p>

            {/* Bilingual Search Console */}
            <div className="mt-6">
              <GlobalSearch />
            </div>

            {/* Primary CTA Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/gta6/map"
                className="neon-pink-glow inline-flex items-center gap-2 rounded-xl bg-[#FF2E93] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff47a0]"
              >
                <Compass className="h-4 w-4" />
                {t("Launch Leonida Interactive Map", "立即进入雷奥奈达大地图")}
              </Link>
              <Link
                href="/gta6/cheats"
                className="inline-flex items-center gap-2 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 px-5 py-3 text-sm font-bold text-[#00E5FF] transition hover:bg-[#00E5FF]/20"
              >
                <Gamepad2 className="h-4 w-4" />
                {t("PS5 / Xbox Cheat Codes", "PS5 / Xbox 作弊码速查")}
              </Link>
              <Link
                href="/gta6/map?x=1240&y=-850&marker=mk-waink-02"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#161922] px-4 py-3 text-xs font-medium text-zinc-300 transition hover:border-white/25 hover:text-white"
              >
                {t("Jump to Coords (X 1240, Y -850)", "示例坐标直达 (X 1240, Y -850)")}
                <ArrowUpRight className="h-3.5 w-3.5 text-[#00E5FF]" />
              </Link>
            </div>
          </div>

          {/* Interactive Map Quick-Launch Preview Card */}
          <div className="lg:col-span-5">
            <Link
              href="/gta6/map"
              className="group relative block overflow-hidden rounded-2xl border border-white/15 bg-[#121622] p-4 shadow-2xl transition hover:border-[#00E5FF]/60"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-mono text-[#00E5FF]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#00E5FF]" />
                  LEONIDA STATE · LIVE MAP
                </span>
                <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[11px]">
                  {t(`${MAP_MARKERS.length} Verified Pins`, `${MAP_MARKERS.length} 个已验证标点`)}
                </span>
              </div>

              <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#080C16]">
                <svg viewBox="0 0 400 300" className="h-full w-full">
                  <defs>
                    <linearGradient id="oceanGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#07111F" />
                      <stop offset="100%" stopColor="#0B192E" />
                    </linearGradient>
                    <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#1B2235" />
                      <stop offset="100%" stopColor="#121826" />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" fill="url(#oceanGrad)" />
                  <g stroke="rgba(0,229,255,0.08)" strokeWidth="1">
                    <line x1="80" y1="0" x2="80" y2="300" />
                    <line x1="160" y1="0" x2="160" y2="300" />
                    <line x1="240" y1="0" x2="240" y2="300" />
                    <line x1="320" y1="0" x2="320" y2="300" />
                    <line x1="0" y1="75" x2="400" y2="75" />
                    <line x1="0" y1="150" x2="400" y2="150" />
                    <line x1="0" y1="225" x2="400" y2="225" />
                  </g>
                  <path
                    d="M 65 40 L 260 32 L 312 85 L 335 165 L 315 210 L 258 212 L 220 228 L 130 225 L 70 180 L 58 105 Z"
                    fill="url(#landGrad)"
                    stroke="#00E5FF"
                    strokeOpacity="0.35"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 295 225 Q 272 252 230 264 Q 186 272 150 266"
                    fill="none"
                    stroke="#FF2E93"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="12 8"
                    opacity="0.7"
                  />
                  <path
                    d="M 95 100 Q 195 95 310 130 M 195 45 L 210 210 M 105 180 Q 200 155 305 170"
                    fill="none"
                    stroke="#00E5FF"
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                  />
                  <circle cx="318" cy="132" r="5" fill="#FF2E93" />
                  <circle cx="318" cy="132" r="11" fill="#FF2E93" opacity="0.25" />
                  <circle cx="255" cy="145" r="4.5" fill="#00E5FF" />
                  <circle cx="275" cy="242" r="5" fill="#FF2E93" />
                  <circle cx="115" cy="112" r="4" fill="#FFB800" />
                  <circle cx="132" cy="195" r="4" fill="#22C55E" />
                  <circle cx="215" cy="64" r="4" fill="#A855F7" />

                  <text x="278" y="122" fill="#F8FAFC" fontSize="9" fontWeight="700">
                    VICE BEACH
                  </text>
                  <text x="172" y="142" fill="#94A3B8" fontSize="8">
                    VICE CITY
                  </text>
                  <text x="78" y="198" fill="#6EE7B7" fontSize="8">
                    GRASSRIVERS
                  </text>
                  <text x="200" y="284" fill="#FF73B8" fontSize="8" fontWeight="700">
                    LEONIDA KEYS
                  </text>
                </svg>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg border border-white/10 bg-[#0D0F14]/90 px-3 py-2 backdrop-blur">
                  <span className="text-xs font-semibold text-white">
                    {t("Open Fullscreen Interactive Map", "点击启动全屏交互地图引擎")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00E5FF] transition-transform group-hover:translate-x-0.5">
                    {t("Explore", "进入地图")} <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Personal Progress Overview */}
        <div className="mt-10">
          <HomeProgressOverview />
        </div>

        {/* Hot Tools Matrix */}
        <section className="mt-12">
          <div>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">
              {t("GTA 6 Tools & Database Hub", "热门工具与全图鉴矩阵")}
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              {t(
                "Flat architecture built for fast exploration, 100% completion tracking, and instant reference",
                "扁平化全站导航架构，全面覆盖 GTA 6 开荒探索、全收集与实战配装"
              )}
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS_MATRIX.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#161922] p-5 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-[#1B202C]"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${tool.accent}20`,
                          color: tool.accent,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${tool.accent}18`,
                          color: tool.accent,
                        }}
                      >
                        {t(tool.enBadge, tool.zhBadge)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-white group-hover:text-[#00E5FF]">
                      {t(tool.enTitle, tool.zhTitle)}
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-500">
                      {t(tool.subtitleEn, tool.subtitleZh)}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {t(tool.enDesc, tool.zhDesc)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-300 group-hover:text-white">
                    {t("Open Tool", "立即使用")}{" "}
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#FF2E93]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Vehicles & Coordinates */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#161922] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                {t("Top Speed Leaderboard", "热门载具极速榜")}
              </h2>
              <Link href="/gta6/vehicles" className="text-xs text-[#00E5FF] hover:underline">
                {t("All Vehicles →", "查看全部载具 →")}
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {hotVehicles.map((v) => (
                <Link
                  key={v.id}
                  href={`/gta6/vehicles/${v.slug}`}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0D0F14] px-4 py-3 transition hover:border-[#00E5FF]/40"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: v.accentColor }}
                      />
                      <span className="text-sm font-bold text-white">
                        {isEn ? v.titleEn : v.titleZh}
                      </span>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400">
                        {isEn ? v.categoryEn : v.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {isEn ? v.titleZh : v.titleEn}
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-[#00E5FF]">
                      {v.stats.topSpeedKmh} km/h
                    </div>
                    <div className="text-[11px] text-zinc-400">{formatMoney(v.stats.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161922] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                {t("High-Value Coordinates", "高价值开荒点位速达")}
              </h2>
              <Link href="/gta6/map" className="text-xs text-[#FF2E93] hover:underline">
                {t("Open on Map →", "在大地图中查看 →")}
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {hotMarkers.map((m) => (
                <Link
                  key={m.id}
                  href={`/gta6/map?x=${m.x}&y=${m.y}&marker=${encodeURIComponent(m.id)}`}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0D0F14] px-4 py-3 transition hover:border-[#FF2E93]/40"
                >
                  <div className="min-w-0 pr-3">
                    <div className="truncate text-sm font-bold text-white">
                      {isEn ? m.titleEn : m.titleZh}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-zinc-400">
                      {isEn ? `${m.regionEn} · ${m.titleZh}` : `${m.region} · ${m.titleEn}`}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-lg border border-white/10 bg-[#161922] px-2.5 py-1 font-mono text-[11px] text-[#FF2E93]">
                    X {m.x}, Y {m.y}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs text-emerald-300">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {t(
                "Community coordinate corrections are stored in Cloudflare D1 & protected by Turnstile.",
                "社区众包纠错已接入 Cloudflare D1 与 Turnstile 防刷保护，欢迎在地图右侧抽屉补充新点位。"
              )}
            </div>
          </div>
        </section>

        {/* Open-Source Community Showcase */}
        <section className="mt-12 overflow-hidden rounded-2xl border border-[#00E5FF]/30 bg-gradient-to-br from-[#161922] via-[#131826] to-[#1A1322] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00E5FF]/40 bg-[#00E5FF]/15 px-3 py-1 text-xs font-bold text-[#00E5FF]">
                  <Github className="h-3.5 w-3.5" />
                  {t("100% Open Source", "100% 完全开源")}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[11px] font-semibold text-zinc-300">
                  <Scale className="h-3 w-3 text-[#FF2E93]" /> MIT License
                </span>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  {t("Self-Hostable on Cloudflare Free Tier", "支持 Cloudflare 免费套餐一键自部署")}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-black text-white sm:text-2xl">
                {t(
                  "Built in the Open for the Global GTA Community",
                  "完全开源 · 与全球 GTA 玩家共建雷奥奈达数据库"
                )}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm">
                {t(
                  "All frontend code, Leaflet map engine, D1 database migrations, 6-hour Cloudflare Cron sync worker, and pyvips tile-slicing scripts are open-sourced under the MIT License on GitHub. Star the repo, submit map coordinates, or fork and deploy your own instance.",
                  "本项目全部前端页面、Leaflet 平面地图引擎、Cloudflare D1 建表迁移、每 6 小时自动同步 Cron Worker 以及 pyvips 瓦片切图脚本均已以 MIT 协议完全开源在 GitHub。欢迎 Star、提交坐标 PR 或 Fork 自部署。"
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:shrink-0">
              <a
                href="https://github.com/bluexp/gta8.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="neon-cyan-glow inline-flex items-center gap-2 rounded-xl bg-[#00E5FF] px-5 py-3 text-xs font-extrabold text-[#0D0F14] transition hover:opacity-90 sm:text-sm"
              >
                <Github className="h-4 w-4" />
                {t("Star on GitHub", "GitHub 开源仓库")}
              </a>
              <a
                href="https://github.com/bluexp/gta8.cc/issues/new/choose"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#FF2E93]/45 bg-[#FF2E93]/15 px-4 py-3 text-xs font-bold text-[#FF2E93] transition hover:bg-[#FF2E93] hover:text-white sm:text-sm"
              >
                <GitPullRequest className="h-4 w-4" />
                {t("Contribute Pins / PR", "提交点位 / 参与共建")}
              </a>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
