import { NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

interface IntelRow {
  id: string;
  source: string;
  sourceType: string;
  externalId: string;
  title: string;
  summary: string | null;
  url: string;
  tagsJson: string;
  publishedAt: string;
  syncedAt: string;
}

interface SyncRunRow {
  id: string;
  triggerType: string;
  status: string;
  itemsFetched: number;
  itemsUpserted: number;
  detailsJson: string;
  startedAt: string;
  finishedAt: string | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");
  const limit = Math.min(Number(searchParams.get("limit") ?? 40) || 40, 100);

  const db = await getDB();
  if (!db) {
    return NextResponse.json({
      ok: true,
      connected: false,
      items: [],
      recentRuns: [],
      counts: { intel: 0, markers: 0, pendingSubmissions: 0 },
    });
  }

  try {
    const itemsStmt = source
      ? db
          .prepare(
            "SELECT * FROM IntelFeed WHERE source = ? ORDER BY publishedAt DESC LIMIT ?"
          )
          .bind(source, limit)
      : db
          .prepare("SELECT * FROM IntelFeed ORDER BY publishedAt DESC LIMIT ?")
          .bind(limit);

    const [itemsRes, runsRes, intelCnt, markerCnt, subCnt] = await Promise.all([
      itemsStmt.all<IntelRow>(),
      db
        .prepare("SELECT * FROM SyncRun ORDER BY startedAt DESC LIMIT 8")
        .all<SyncRunRow>(),
      db.prepare("SELECT COUNT(*) as c FROM IntelFeed").first<{ c: number }>(),
      db.prepare("SELECT COUNT(*) as c FROM MapMarker").first<{ c: number }>(),
      db
        .prepare("SELECT COUNT(*) as c FROM MarkerSubmission WHERE status = 'pending'")
        .first<{ c: number }>(),
    ]);

    const items = (itemsRes.results ?? []).map((r) => {
      let tags: string[] = [];
      try {
        const parsed = JSON.parse(r.tagsJson);
        if (Array.isArray(parsed)) tags = parsed;
      } catch {
        tags = [];
      }
      return {
        id: r.id,
        source: r.source,
        sourceType: r.sourceType,
        title: r.title,
        summary: r.summary ?? "",
        url: r.url,
        tags,
        publishedAt: r.publishedAt,
        syncedAt: r.syncedAt,
      };
    });

    const recentRuns = (runsRes.results ?? []).map((run) => {
      let sources = [];
      try {
        sources = JSON.parse(run.detailsJson);
      } catch {
        sources = [];
      }
      return { ...run, sources };
    });

    return NextResponse.json(
      {
        ok: true,
        connected: true,
        items,
        recentRuns,
        counts: {
          intel: intelCnt?.c ?? 0,
          markers: markerCnt?.c ?? 0,
          pendingSubmissions: subCnt?.c ?? 0,
        },
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "D1 查询失败",
      },
      { status: 500 }
    );
  }
}
