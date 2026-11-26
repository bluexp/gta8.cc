import type { D1DatabaseLike } from "./d1";
import { MAP_MARKERS } from "@/data/markers";

export interface SyncedIntelItem {
  id: string;
  source: "gta_wiki" | "wikipedia" | "gta6_news_en" | "gta6_news_zh" | "rockstar" | "manual";
  sourceType: "vehicle" | "weapon" | "location" | "news" | "update";
  externalId: string;
  title: string;
  summary: string;
  url: string;
  tags: string[];
  publishedAt: string;
}

export interface SourceSyncStat {
  source: string;
  ok: boolean;
  fetched: number;
  upserted: number;
  error?: string;
}

export interface SyncRunSummary {
  runId: string;
  triggerType: "cron" | "manual";
  status: "success" | "partial" | "error";
  itemsFetched: number;
  itemsUpserted: number;
  sources: SourceSyncStat[];
  startedAt: string;
  finishedAt: string;
}

async function fetchJsonWithTimeout<T>(
  url: string,
  headers: Record<string, string> = {},
  timeoutMs = 10000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "GTA8Bot/1.0 (+https://gta8.cc; Community Wiki Sync)",
        Accept: "application/json",
        ...headers,
      },
      signal: controller.signal,
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Source 1: GTA Wiki (Fandom MediaWiki Public API - CC-BY-SA)
 * Fetches confirmed GTA VI vehicles, weapons, and locations incrementally.
 */
async function fetchGtaWikiItems(): Promise<SyncedIntelItem[]> {
  const categories: Array<{
    cmtitle: string;
    sourceType: SyncedIntelItem["sourceType"];
    tag: string;
  }> = [
    { cmtitle: "Category:Vehicles_in_GTA_VI", sourceType: "vehicle", tag: "已确认载具" },
    { cmtitle: "Category:Weapons_in_GTA_VI", sourceType: "weapon", tag: "已确认武器" },
    { cmtitle: "Category:Locations_in_GTA_VI", sourceType: "location", tag: "雷奥奈达地点" },
  ];

  const items: SyncedIntelItem[] = [];
  const nowIso = new Date().toISOString();

  for (const cat of categories) {
    const url = `https://gta.fandom.com/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(
      cat.cmtitle
    )}&cmnamespace=0&cmlimit=15&cmsort=timestamp&cmdir=desc&format=json`;
    const data = await fetchJsonWithTimeout<{
      query?: {
        categorymembers?: Array<{ pageid: number; title: string; timestamp?: string }>;
      };
    }>(url);

    for (const m of data.query?.categorymembers ?? []) {
      const slug = m.title.replace(/\s+/g, "_");
      items.push({
        id: `wiki-${m.pageid}`,
        source: "gta_wiki",
        sourceType: cat.sourceType,
        externalId: `gta_wiki:${m.pageid}`,
        title: m.title,
        summary: `来自 GTA Wiki 公开词条分类（${cat.tag}），由定时同步引擎自动收录。`,
        url: `https://gta.fandom.com/wiki/${encodeURIComponent(slug)}`,
        tags: ["GTA Wiki", cat.tag],
        publishedAt: m.timestamp ?? nowIso,
      });
    }
  }
  return items;
}

/**
 * Source 2: Wikipedia MediaWiki API (Grand Theft Auto VI article revisions & extract)
 */
async function fetchWikipediaUpdates(): Promise<SyncedIntelItem[]> {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&titles=Grand_Theft_Auto_VI&prop=revisions|extracts&exintro=1&explaintext=1&rvprop=ids|timestamp|comment&rvlimit=5&format=json";
  const data = await fetchJsonWithTimeout<{
    query?: {
      pages?: Record<
        string,
        {
          pageid?: number;
          title?: string;
          extract?: string;
          revisions?: Array<{ revid: number; timestamp: string; comment?: string }>;
        }
      >;
    };
  }>(url);

  const pages = Object.values(data.query?.pages ?? {});
  const page = pages[0];
  if (!page) return [];

  const items: SyncedIntelItem[] = [];
  if (page.extract) {
    items.push({
      id: "wp-gtavi-overview",
      source: "wikipedia",
      sourceType: "news",
      externalId: "wikipedia:Grand_Theft_Auto_VI:overview",
      title: "Grand Theft Auto VI 官方百科摘要同步",
      summary: page.extract.slice(0, 320),
      url: "https://en.wikipedia.org/wiki/Grand_Theft_Auto_VI",
      tags: ["Wikipedia", "官方资料汇总"],
      publishedAt: page.revisions?.[0]?.timestamp ?? new Date().toISOString(),
    });
  }

  for (const rev of (page.revisions ?? []).slice(0, 4)) {
    const comment = rev.comment?.trim();
    if (!comment) continue;
    items.push({
      id: `wp-rev-${rev.revid}`,
      source: "wikipedia",
      sourceType: "update",
      externalId: `wikipedia:rev:${rev.revid}`,
      title: `GTA VI 百科修订：${comment.slice(0, 90)}`,
      summary: comment,
      url: `https://en.wikipedia.org/w/index.php?title=Grand_Theft_Auto_VI&oldid=${rev.revid}`,
      tags: ["Wikipedia", "词条变动"],
      publishedAt: rev.timestamp,
    });
  }

  return items;
}

function decodeXmlEntities(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

async function fetchGoogleNewsRss(
  rssUrl: string,
  source: "gta6_news_en" | "gta6_news_zh",
  defaultTag: string,
  summaryPrefix: string
): Promise<SyncedIntelItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; GTA8Bot/1.0; +https://gta8.cc)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();

    const items: SyncedIntelItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match: RegExpExecArray | null;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
      const block = match[1];
      const titleRaw = block.match(/<title>([\s\S]*?)<\/title>/)?.[1];
      const linkRaw = block.match(/<link>([\s\S]*?)<\/link>/)?.[1];
      const pubRaw = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
      const sourceRaw = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1];
      const guidRaw = block.match(/<guid[^>]*>([\s\S]*?)<\/guid>/)?.[1];

      if (!titleRaw || !linkRaw) continue;
      const title = decodeXmlEntities(titleRaw);
      const link = decodeXmlEntities(linkRaw);
      const mediaName = sourceRaw ? decodeXmlEntities(sourceRaw) : defaultTag;
      const pubDate = pubRaw ? new Date(pubRaw) : new Date();
      const publishedAt = Number.isNaN(pubDate.getTime())
        ? new Date().toISOString()
        : pubDate.toISOString();
      const keyHash = (guidRaw ?? link).slice(-24).replace(/[^a-zA-Z0-9]/g, "");

      items.push({
        id: `${source}-${keyHash || items.length}`,
        source,
        sourceType: "news",
        externalId: `${source}:${guidRaw ?? link}`,
        title,
        summary: `${summaryPrefix}${mediaName}`,
        url: link,
        tags: [defaultTag, mediaName],
        publishedAt,
      });
    }
    return items;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchGta6EnglishNews(): Promise<SyncedIntelItem[]> {
  return fetchGoogleNewsRss(
    "https://news.google.com/rss/search?q=%22GTA+6%22+OR+%22Grand+Theft+Auto+VI%22+Rockstar&hl=en-US&gl=US&ceid=US:en",
    "gta6_news_en",
    "EN News",
    "Source: "
  );
}

async function fetchGta6ChineseNews(): Promise<SyncedIntelItem[]> {
  return fetchGoogleNewsRss(
    "https://news.google.com/rss/search?q=%22GTA+6%22+OR+%22GTA6%22+Rockstar&hl=zh-CN&gl=CN&ceid=CN:zh-Hans",
    "gta6_news_zh",
    "中文资讯",
    "来源媒体："
  );
}

/**
 * Ensures MapMarker table in D1 is seeded once if completely empty.
 */
export async function ensureMarkersSeeded(db: D1DatabaseLike): Promise<number> {
  const countRow = await db
    .prepare("SELECT COUNT(*) as cnt FROM MapMarker")
    .first<{ cnt: number }>();
  if ((countRow?.cnt ?? 0) > 0) return countRow?.cnt ?? 0;

  const stmts = MAP_MARKERS.map((m) =>
    db
      .prepare(
        `INSERT OR IGNORE INTO MapMarker
         (id, gameVersion, category, subType, titleZh, titleEn, region, x, y, descriptionMd, mediaUrls, linkedEntityId, contributor, isVerified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        m.id,
        m.gameVersion,
        m.category,
        m.subType,
        m.titleZh,
        m.titleEn,
        `${m.region}|${m.regionEn}`,
        m.x,
        m.y,
        m.descriptionMd,
        JSON.stringify(m.mediaUrls),
        m.linkedEntityId ? `${m.linkedEntityType ?? "vehicle"}:${m.linkedEntityId}` : null,
        m.contributor ?? "GTA8编辑部",
        m.isVerified ? 1 : 0
      )
  );

  await db.batch(stmts);
  return MAP_MARKERS.length;
}

/**
 * Main automated continuous sync pipeline.
 * Triggered automatically by Cloudflare Cron (`0 *\/6 * * *`) or manually from `/admin`.
 */
export async function runScheduledSync(
  db: D1DatabaseLike | null,
  triggerType: "cron" | "manual" = "cron"
): Promise<SyncRunSummary> {
  const runId = `sync_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const startedAt = new Date().toISOString();

  if (db) {
    try {
      await ensureMarkersSeeded(db);
    } catch {
      // Continue syncing intel even if seed check fails
    }
  }

  const connectors: Array<{
    name: string;
    run: () => Promise<SyncedIntelItem[]>;
  }> = [
    { name: "gta6_news_en", run: fetchGta6EnglishNews },
    { name: "gta6_news_zh", run: fetchGta6ChineseNews },
    { name: "gta_wiki", run: fetchGtaWikiItems },
    { name: "wikipedia", run: fetchWikipediaUpdates },
  ];

  const sources: SourceSyncStat[] = [];
  let totalFetched = 0;
  let totalUpserted = 0;

  for (const conn of connectors) {
    try {
      const items = await conn.run();
      totalFetched += items.length;
      let upserted = 0;

      if (db && items.length > 0) {
        const stmts = items.map((item) =>
          db
            .prepare(
              `INSERT INTO IntelFeed (id, source, sourceType, externalId, title, summary, url, tagsJson, publishedAt, syncedAt)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
               ON CONFLICT(externalId) DO UPDATE SET
                 title = excluded.title,
                 summary = excluded.summary,
                 tagsJson = excluded.tagsJson,
                 publishedAt = excluded.publishedAt,
                 syncedAt = datetime('now')`
            )
            .bind(
              item.id,
              item.source,
              item.sourceType,
              item.externalId,
              item.title,
              item.summary,
              item.url,
              JSON.stringify(item.tags),
              item.publishedAt
            )
        );
        await db.batch(stmts);
        upserted = items.length;
      }

      totalUpserted += upserted;
      sources.push({
        source: conn.name,
        ok: true,
        fetched: items.length,
        upserted,
      });
    } catch (err) {
      sources.push({
        source: conn.name,
        ok: false,
        fetched: 0,
        upserted: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const okCount = sources.filter((s) => s.ok).length;
  const status: SyncRunSummary["status"] =
    okCount === sources.length ? "success" : okCount > 0 ? "partial" : "error";
  const finishedAt = new Date().toISOString();

  if (db) {
    await db
      .prepare(
        `INSERT INTO SyncRun (id, triggerType, status, itemsFetched, itemsUpserted, detailsJson, startedAt, finishedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        runId,
        triggerType,
        status,
        totalFetched,
        totalUpserted,
        JSON.stringify(sources),
        startedAt,
        finishedAt
      )
      .run();
  }

  return {
    runId,
    triggerType,
    status,
    itemsFetched: totalFetched,
    itemsUpserted: totalUpserted,
    sources,
    startedAt,
    finishedAt,
  };
}
