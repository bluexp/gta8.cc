import { NextResponse } from "next/server";
import { getDB, getWorkerEnv } from "@/lib/d1";

interface SubmissionPayload {
  markerId?: string | null;
  nickname?: string;
  turnstileToken?: string;
  payload?: {
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
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmissionPayload;
    const titleZh = body.payload?.titleZh?.trim();
    const x = body.payload?.x;
    const y = body.payload?.y;

    if (
      !titleZh ||
      typeof x !== "number" ||
      typeof y !== "number" ||
      Number.isNaN(x) ||
      Number.isNaN(y)
    ) {
      return NextResponse.json(
        { ok: false, error: "请填写完整的中文标题与有效数字坐标 (X, Y)。" },
        { status: 400 }
      );
    }

    const env = await getWorkerEnv();
    const turnstileSecret = env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const token = body.turnstileToken;
      if (!token) {
        return NextResponse.json(
          { ok: false, error: "缺少 Turnstile 人机验证凭证。" },
          { status: 400 }
        );
      }
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: token,
          }),
        }
      );
      const verifyData = (await verifyRes.json()) as { success?: boolean };
      if (!verifyData.success) {
        return NextResponse.json(
          { ok: false, error: "Turnstile 人机校验未通过，请重试。" },
          { status: 403 }
        );
      }
    }

    const submissionId = `sub_${Date.now().toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    const nickname = body.nickname?.trim() || "匿名雷奥奈达探员";
    const createdAt = new Date().toISOString();

    const db = await getDB();
    let persisted = false;
    if (db) {
      await db
        .prepare(
          `INSERT INTO MarkerSubmission (id, markerId, payloadJson, nickname, status, createdAt)
           VALUES (?, ?, ?, ?, 'pending', ?)`
        )
        .bind(
          submissionId,
          body.markerId ?? null,
          JSON.stringify(body.payload ?? {}),
          nickname,
          createdAt
        )
        .run();
      persisted = true;
    }

    return NextResponse.json({
      ok: true,
      id: submissionId,
      persisted,
      status: "pending",
      markerId: body.markerId ?? null,
      nickname,
      createdAt,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "请求体格式无效。" }, { status: 400 });
  }
}
