# Architecture Guide — GTA8.cc

This document details the technical architecture, data flow, coordinate system, bilingual design, and edge automation behind **GTA8.cc**.

---

## 1. System Topology

GTA8.cc runs entirely on **Cloudflare's edge network** via `@opennextjs/cloudflare`:

1. **Static & SSG Delivery (`ASSETS`)**: Pre-rendered static routes (`/`, `/gta6/vehicles/[slug]`, `/gta6/weapons/[slug]`, `/gta6/cheats`, `/search-index.json`, `/sitemap.xml`) are served directly from Cloudflare Edge CDN with zero Worker invocation cost.
2. **Dynamic API & SSR (`custom-worker.ts`)**: Wraps the OpenNext-generated `.open-next/worker.js` `fetch` handler while adding a native Cloudflare `scheduled()` Cron entrypoint.
3. **Edge Relational Database (`Cloudflare D1` — `gta8-db`)**: Stores live map markers, community UGC submissions, cloud-synced user progress, auto-synced intel feeds, and sync audit runs.
4. **Scheduled Automation (`triggers.crons: ["0 */6 * * *"]`)**: Runs `runScheduledSync()` every 6 hours to keep `/gta6/intel` updated without manual redeploys.

---

## 2. Information Architecture & Rendering Strategy

| Route | Rendering | Primary Data Source |
| --- | --- | --- |
| `/` | Static + Client Hydration | `public/search-index.json` + Zustand `localStorage` |
| `/gta6/map` | Client Interactive Canvas | `/api/markers` (Cloudflare D1) + Zustand + Leaflet |
| `/gta6/intel` | Client Live Feed | `/api/intel` (Cloudflare D1 `IntelFeed` + `SyncRun`) |
| `/gta6/checklist` | Static + Client Store | Bidirectionally synced with `completedMarkers` |
| `/gta6/vehicles` & `/[slug]` | SSG (`generateStaticParams`) | `src/data/vehicles.ts` + `src/data/en-copy.ts` |
| `/gta6/weapons` & `/[slug]` | SSG (`generateStaticParams`) | `src/data/weapons.ts` + `src/data/en-copy.ts` |
| `/gta6/collectibles` | Static + Client Store | Synced with `completedMarkers` |
| `/gta6/cheats` | Static + Client Filter | `src/data/cheats.ts` + `src/data/en-copy.ts` |
| `/gta6/guides` | Static + Interactive Calc | `src/data/guides.ts` + `HeistCalculator` |
| `/admin` | Client Console (`noindex`) | `/api/admin/sync` + `/api/admin/submissions` |

---

## 3. Interactive Map Coordinate System

- **Projection**: `L.CRS.Simple` (flat Cartesian plane—no spherical Web Mercator distortion).
- **World Bounds**: `X ∈ [-2000, 2000]`, `Y ∈ [-2000, 2000]`.
  - Leaflet uses `[lat, lng]` which maps directly to `[y, x]`.
  - Shareable URLs use `?x=<number>&y=<number>&marker=<id>`.
- **Basemap Resolution**:
  - When `NEXT_PUBLIC_TILES_BASE_URL` is unset, `buildLeonidaSvgDataUrl("satellite" | "vector")` renders a high-resolution procedural SVG overlay directly onto `WORLD_BOUNDS`.
  - When `NEXT_PUBLIC_TILES_BASE_URL` is set (e.g. `https://tiles.gta8.cc`), Leaflet switches to `L.tileLayer("${base}/${style}/{z}/{x}/{y}.webp")` backed by Cloudflare R2.
- **Clustering**: At zoom `<= -1`, markers are grouped into planar grid cells (`cellSize = 300` or `520`) into interactive neon cluster badges; clicking zooms in cleanly.

---

## 4. Bilingual i18n Design (EN Default + 中文)

- **State Store**: `src/store/useLocaleStore.ts` (Zustand persisted under `gta8-cc-locale-v1`, default `"en"`).
- **Hydration Safety**: `useLocale()` always returns `"en"` during SSR and the initial client render pass, matching `<html lang="en">` from `src/app/layout.tsx`, then reconciles any saved `"zh"` preference cleanly inside `useEffect`—eliminating React hydration mismatches.
- **Data Separation**: Core bilingual titles (`titleEn`, `titleZh`, `regionEn`, `region`) live directly on models; rich English prose lives in `src/data/en-copy.ts` keyed by `id`/`slug`, keeping the build-time search indexer clean and deterministic.

---

## 5. Database Schema (Cloudflare D1 / SQLite)

Managed via SQL migrations in `migrations/`:

1. **`MapMarker`** (`0001_init.sql`): Verified map pins (`category`, `subType`, `x`, `y`, bilingual titles, `linkedEntityId`, `contributor`). Auto-seeded on first query if empty.
2. **`WikiEntity`** (`0001_init.sql`): Polymorphic schema reserved for D1-backed vehicles, weapons, and collectibles.
3. **`UserProgress`** (`0001_init.sql`): Cloud-synced `completedMarkers` JSON array per `userId` with set-union deduplication on sync.
4. **`MarkerSubmission`** (`0001_init.sql`): Community new-pin and coordinate-correction queue (`pending | approved | rejected`). Approving in `/admin` atomically upserts into `MapMarker`.
5. **`IntelFeed`** (`0002_auto_sync.sql`): Auto-synced external articles and wiki items deduplicated by `externalId`.
6. **`SyncRun`** (`0002_auto_sync.sql`): Execution audit log (`cron | manual`, status, fetched/upserted counts, per-source telemetry JSON).

---

## 6. Build-Time Search Index Pipeline

`scripts/generate-search-index.mjs` runs automatically prior to `next build` and outputs `public/search-index.json` containing bilingual titles, derived Chinese pinyin initials, categories, routes, and map coordinates. `GlobalSearch.tsx` loads this static JSON into `Fuse.js` for zero-latency client-side fuzzy search.
