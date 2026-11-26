import { NextResponse } from "next/server";
import { getDB } from "@/lib/d1";

const memoryStore = new Map<string, { completedMarkers: string[]; updatedAt: string }>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "缺少 userId 参数" }, { status: 400 });
  }

  const db = await getDB();
  if (db) {
    const row = await db
      .prepare("SELECT completedMarkers, updatedAt FROM UserProgress WHERE userId = ?")
      .bind(userId)
      .first<{ completedMarkers: string; updatedAt: string }>();
    let list: string[] = [];
    if (row?.completedMarkers) {
      try {
        const parsed = JSON.parse(row.completedMarkers);
        if (Array.isArray(parsed)) list = parsed;
      } catch {
        list = [];
      }
    }
    return NextResponse.json({
      ok: true,
      storage: "d1",
      userId,
      completedMarkers: list,
      updatedAt: row?.updatedAt ?? null,
    });
  }

  const existing = memoryStore.get(userId);
  return NextResponse.json({
    ok: true,
    storage: "memory",
    userId,
    completedMarkers: existing?.completedMarkers ?? [],
    updatedAt: existing?.updatedAt ?? null,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      userId?: string;
      completedMarkers?: unknown;
    };
    const userId = body.userId?.trim();
    if (!userId || !Array.isArray(body.completedMarkers)) {
      return NextResponse.json(
        { ok: false, error: "请提供有效的 userId 与 completedMarkers 数组" },
        { status: 400 }
      );
    }

    const incoming = body.completedMarkers.filter((x): x is string => typeof x === "string");
    const updatedAt = new Date().toISOString();

    const db = await getDB();
    if (db) {
      const existing = await db
        .prepare("SELECT completedMarkers FROM UserProgress WHERE userId = ?")
        .bind(userId)
        .first<{ completedMarkers: string }>();
      let prev: string[] = [];
      if (existing?.completedMarkers) {
        try {
          const parsed = JSON.parse(existing.completedMarkers);
          if (Array.isArray(parsed)) prev = parsed;
        } catch {
          prev = [];
        }
      }
      const merged = Array.from(new Set([...prev, ...incoming]));

      await db
        .prepare(
          `INSERT INTO UserProgress (userId, completedMarkers, updatedAt)
           VALUES (?, ?, ?)
           ON CONFLICT(userId) DO UPDATE SET
             completedMarkers = excluded.completedMarkers,
             updatedAt = excluded.updatedAt`
        )
        .bind(userId, JSON.stringify(merged), updatedAt)
        .run();

      return NextResponse.json({
        ok: true,
        storage: "d1",
        userId,
        completedMarkers: merged,
        updatedAt,
      });
    }

    const prev = memoryStore.get(userId)?.completedMarkers ?? [];
    const merged = Array.from(new Set([...prev, ...incoming]));
    memoryStore.set(userId, { completedMarkers: merged, updatedAt });

    return NextResponse.json({
      ok: true,
      storage: "memory",
      userId,
      completedMarkers: merged,
      updatedAt,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "无法解析同步请求" }, { status: 400 });
  }
}
