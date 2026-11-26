import { NextResponse } from "next/server";
import { MAP_MARKERS } from "@/data/markers";
import { getDB } from "@/lib/d1";
import { ensureMarkersSeeded } from "@/lib/sync-engine";
import type { MapMarker, MarkerCategory, MarkerSubType } from "@/types/gta";

interface D1MarkerRow {
  id: string;
  gameVersion: string;
  category: string;
  subType: string;
  titleZh: string;
  titleEn: string;
  region: string | null;
  x: number;
  y: number;
  descriptionMd: string | null;
  mediaUrls: string;
  linkedEntityId: string | null;
  contributor: string | null;
  isVerified: number;
}

function rowToMarker(row: D1MarkerRow): MapMarker {
  const [regionZh, regionEn] = (row.region ?? "雷奥奈达|Leonida").split("|");
  let linkedEntityType: "vehicle" | "weapon" | undefined;
  let linkedEntityId: string | undefined;
  if (row.linkedEntityId) {
    if (row.linkedEntityId.includes(":")) {
      const [t, slug] = row.linkedEntityId.split(":");
      linkedEntityType = t === "weapon" ? "weapon" : "vehicle";
      linkedEntityId = slug;
    } else {
      linkedEntityType = "vehicle";
      linkedEntityId = row.linkedEntityId;
    }
  }
  let mediaUrls: string[] = [];
  try {
    const parsed = JSON.parse(row.mediaUrls);
    if (Array.isArray(parsed)) mediaUrls = parsed;
  } catch {
    mediaUrls = [];
  }

  return {
    id: row.id,
    gameVersion: "gta6",
    category: row.category as MarkerCategory,
    subType: row.subType as MarkerSubType,
    titleZh: row.titleZh,
    titleEn: row.titleEn,
    region: regionZh || "雷奥奈达",
    regionEn: regionEn || regionZh || "Leonida",
    x: Number(row.x),
    y: Number(row.y),
    descriptionMd: row.descriptionMd ?? "",
    mediaUrls,
    linkedEntityId,
    linkedEntityType,
    contributor: row.contributor ?? undefined,
    isVerified: Boolean(row.isVerified),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const version = searchParams.get("version") ?? "gta6";

  try {
    const db = await getDB();
    if (db) {
      await ensureMarkersSeeded(db);
      const stmt = category
        ? db
            .prepare(
              "SELECT * FROM MapMarker WHERE gameVersion = ? AND category = ? ORDER BY createdAt DESC"
            )
            .bind(version, category)
        : db
            .prepare("SELECT * FROM MapMarker WHERE gameVersion = ? ORDER BY createdAt DESC")
            .bind(version);
      const res = await stmt.all<D1MarkerRow>();
      const markers = (res.results ?? []).map(rowToMarker);

      return NextResponse.json(
        {
          ok: true,
          source: "d1",
          count: markers.length,
          markers,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
          },
        }
      );
    }
  } catch {
    // Graceful fallback to bundled seed markers
  }

  let markers = MAP_MARKERS.filter((m) => m.gameVersion === version);
  if (category) {
    markers = markers.filter((m) => m.category === category);
  }

  return NextResponse.json({
    ok: true,
    source: "seed",
    count: markers.length,
    markers,
  });
}
