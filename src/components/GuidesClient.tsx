"use client";

import Link from "next/link";
import { BookOpen, Clock, CheckCircle2, MapPin } from "lucide-react";
import { HeistCalculator } from "@/components/HeistCalculator";
import { GUIDE_ARTICLES } from "@/data/guides";
import { GUIDE_COPY_EN } from "@/data/en-copy";
import { useLocale } from "@/store/useLocaleStore";

export function GuidesClient() {
  const { isEn, t } = useLocale();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400">
          <BookOpen className="h-3.5 w-3.5" /> GTA 6 GUIDES & TOOLS
        </span>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          {t("Guides, Mechanics & Heist Calculator", "深度攻略专栏与抢劫收益速算器")}
        </h1>
        <p className="mt-1 text-xs text-zinc-400">
          {t(
            "Story branching breakdowns, Tier 1–5 anti-theft guides, Vice City easter eggs, and our interactive heist payout calculator.",
            "涵盖剧情分支关键选项、防盗与黑市机制解析、罪恶都市彩蛋与交互式分红计算工具。"
          )}
        </p>
      </div>

      <HeistCalculator />

      <div className="mt-10 space-y-6">
        {GUIDE_ARTICLES.map((article) => {
          const enCopy = GUIDE_COPY_EN[article.slug];
          const highlights = isEn ? enCopy?.highlights ?? article.highlights : article.highlights;
          const sections = isEn ? enCopy?.sections ?? article.sections : article.sections;

          return (
            <article
              key={article.slug}
              id={article.slug}
              className="rounded-2xl border border-white/10 bg-[#161922] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#FF2E93]/15 px-2.5 py-0.5 font-bold text-[#FF2E93]">
                    {isEn ? enCopy?.category ?? article.category : article.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-zinc-400">
                    <Clock className="h-3.5 w-3.5" />{" "}
                    {t(`${article.readMinutes} min read`, `阅读约 ${article.readMinutes} 分钟`)}
                  </span>
                </div>
                <span className="font-mono text-zinc-500">
                  {t(`Updated ${article.updatedAt}`, `更新于 ${article.updatedAt}`)}
                </span>
              </div>

              <h2 className="mt-3 text-xl font-extrabold text-white">
                {isEn ? article.titleEn : article.titleZh}
              </h2>
              <p className="font-mono text-xs text-zinc-500">
                {isEn ? article.titleZh : article.titleEn}
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-300">
                {isEn ? enCopy?.summary ?? article.summary : article.summary}
              </p>

              <div className="mt-4 rounded-xl border border-white/5 bg-[#0D0F14] p-4">
                <div className="text-xs font-bold text-[#00E5FF]">
                  {t("Key Takeaways", "核心要点速览")}
                </div>
                <ul className="mt-2 space-y-1.5 text-xs text-zinc-300">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {sections.map((sec) => (
                  <div key={sec.heading} className="rounded-xl border border-white/5 bg-[#12151E] p-4">
                    <h3 className="text-sm font-bold text-white">{sec.heading}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">{sec.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  href="/gta6/map"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#00E5FF] hover:underline"
                >
                  <MapPin className="h-3.5 w-3.5" />{" "}
                  {t("Explore on Interactive Leonida Map", "前往雷奥奈达交互大地图实地查看")}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
