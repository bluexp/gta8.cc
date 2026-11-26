import { NextResponse } from "next/server";
import { getDB, verifyAdminAuth } from "@/lib/d1";
import { runScheduledSync } from "@/lib/sync-engine";

export async function POST(request: Request) {
  const authorized = await verifyAdminAuth(request);
  if (!authorized) {
    return NextResponse.json(
      { ok: false, error: "管理员口令错误，请检查 ADMIN_TOKEN。" },
      { status: 401 }
    );
  }

  const db = await getDB();
  const summary = await runScheduledSync(db, "manual");
  return NextResponse.json({
    ok: true,
    dbConnected: Boolean(db),
    summary,
  });
}
