import { NextResponse } from "next/server";
import { getDB, verifyAdminAuth } from "@/lib/d1";

interface SubmissionRow {
  id: string;
  markerId: string | null;
  payloadJson: string;
  nickname: string | null;
  status: string;
  createdAt: string;
}

export async function GET(request: Request) {
  const authorized = await verifyAdminAuth(request);
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "未授权访问" }, { status: 401 });
  }

  const db = await getDB();
  if (!db) {
    return NextResponse.json({ ok: true, dbConnected: false, submissions: [] });
  }

  const res = await db
    .prepare("SELECT * FROM MarkerSubmission ORDER BY createdAt DESC LIMIT 50")
    .all<SubmissionRow>();

  const submissions = (res.results ?? []).map((r) => {
    let payload: Record<string, unknown> = {};
    try {
      payload = JSON.parse(r.payloadJson);
    } catch {
      payload = {};
    }
    return {
      id: r.id,
      markerId: r.markerId,
      nickname: r.nickname ?? "匿名探员",
      status: r.status,
      createdAt: r.createdAt,
      payload,
    };
  });

  return NextResponse.json({ ok: true, dbConnected: true, submissions });
}

export async function POST(request: Request) {
  const authorized = await verifyAdminAuth(request);
  if (!authorized) {
    return NextResponse.json({ ok: false, error: "未授权访问" }, { status: 401 });
  }

  const db = await getDB();
  if (!db) {
    return NextResponse.json({ ok: false, error: "D1 未连接" }, { status: 500 });
  }

  const body = (await request.json()) as {
    submissionId?: string;
    action?: "approve" | "reject";
  };

  if (!body.submissionId || (body.action !== "approve" && body.action !== "reject")) {
    return NextResponse.json({ ok: false, error: "参数无效" }, { status: 400 });
  }

  const sub = await db
    .prepare("SELECT * FROM MarkerSubmission WHERE id = ?")
    .bind(body.submissionId)
    .first<SubmissionRow>();

  if (!sub) {
    return NextResponse.json({ ok: false, error: "找不到该投稿记录" }, { status: 404 });
  }

  if (body.action === "reject") {
    await db
      .prepare("UPDATE MarkerSubmission SET status = 'rejected' WHERE id = ?")
      .bind(sub.id)
      .run();
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  // Approve: upsert into live MapMarker table so it immediately appears on /gta6/map!
  const payload = JSON.parse(sub.payloadJson) as {
    titleZh?: string;
    titleEn?: string;
    category?: string;
    subType?: string;
    region?: string;
    x?: number;
    y?: number;
    descriptionMd?: string;
    screenshotUrl?: string;
  };

  const markerId = sub.markerId || `mk-ugc-${Date.now().toString(36)}`;
  const category = payload.category || "collectible";
  const subType =
    payload.subType ||
    (category === "vehicle"
      ? "supercar"
      : category === "heist"
        ? "bank"
        : category === "service"
          ? "gun_van"
          : category === "wildlife"
            ? "alligator"
            : "waink_scan");

  const mediaUrls = payload.screenshotUrl ? [payload.screenshotUrl] : [];

  await db.batch([
    db
      .prepare(
        `INSERT INTO MapMarker
         (id, gameVersion, category, subType, titleZh, titleEn, region, x, y, descriptionMd, mediaUrls, contributor, isVerified)
         VALUES (?, 'gta6', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
         ON CONFLICT(id) DO UPDATE SET
           titleZh = excluded.titleZh,
           titleEn = excluded.titleEn,
           x = excluded.x,
           y = excluded.y,
           descriptionMd = excluded.descriptionMd,
           mediaUrls = excluded.mediaUrls,
           contributor = excluded.contributor,
           isVerified = 1`
      )
      .bind(
        markerId,
        category,
        subType,
        payload.titleZh || "社区新点位",
        payload.titleEn || payload.titleZh || "Community Marker",
        payload.region || "雷奥奈达|Leonida",
        Number(payload.x ?? 0),
        Number(payload.y ?? 0),
        payload.descriptionMd || "",
        JSON.stringify(mediaUrls),
        sub.nickname || "社区贡献者"
      ),
    db
      .prepare("UPDATE MarkerSubmission SET status = 'approved' WHERE id = ?")
      .bind(sub.id),
  ]);

  return NextResponse.json({ ok: true, status: "approved", markerId });
}
