# API Reference — GTA8.cc

All API routes live under `src/app/api/*` and run on Cloudflare Workers backed by Cloudflare D1 (`gta8-db`).

---

## 1. Public Endpoints

### `GET /api/markers`
Returns map markers from Cloudflare D1 (auto-seeding initial records on first call; falls back to bundled seed data if D1 is unavailable).

**Query Parameters**
- `version` (optional, default `"gta6"`)
- `category` (optional: `collectible | vehicle | heist | service | wildlife`)

**Example**
```bash
curl "https://gta8.cc/api/markers?category=collectible"
```

**Response (`200 OK`)**
```json
{
  "ok": true,
  "source": "d1",
  "count": 11,
  "markers": [
    {
      "id": "mk-waink-01",
      "gameVersion": "gta6",
      "category": "collectible",
      "subType": "waink_scan",
      "titleZh": "WAiNK 扫描点 #01 · 海景霓虹酒店天台",
      "titleEn": "WAiNK Scan #01 · Ocean View Neon Rooftop",
      "region": "罪恶海滩",
      "regionEn": "Vice Beach",
      "x": 1320,
      "y": 260,
      "isVerified": true
    }
  ]
}
```

---

### `GET /api/intel`
Returns auto-synced intel entries from `IntelFeed` alongside recent `SyncRun` history and D1 counts.

**Query Parameters**
- `source` (optional: `gta6_news_en | gta6_news_zh | gta_wiki | wikipedia`)
- `limit` (optional, default `40`, max `100`)

**Example**
```bash
curl "https://gta8.cc/api/intel?source=gta_wiki&limit=5"
```

---

### `GET /api/progress` & `POST /api/progress`
Reads or merges user map completion progress in `UserProgress`.

**`GET /api/progress?userId=<id>`** returns the stored `completedMarkers` array.

**`POST /api/progress`** merges incoming marker IDs with existing cloud progress using set union (deduplicated):
```bash
curl -X POST "https://gta8.cc/api/progress" \
  -H "Content-Type: application/json" \
  -d '{"userId":"player@example.com","completedMarkers":["mk-waink-01","mk-stunt-01"]}'
```

---

### `POST /api/submissions`
Queues a new community map pin or coordinate correction into `MarkerSubmission` (`status = "pending"`). When `TURNSTILE_SECRET_KEY` is set in Worker secrets, verifies `turnstileToken` against Cloudflare Turnstile `siteverify`.

```bash
curl -X POST "https://gta8.cc/api/submissions" \
  -H "Content-Type: application/json" \
  -d '{
    "markerId": null,
    "nickname": "ViceScout",
    "turnstileToken": "token",
    "payload": {
      "titleEn": "Hidden Package #03",
      "titleZh": "隐藏包裹 #03",
      "category": "collectible",
      "x": 920,
      "y": -440,
      "descriptionMd": "Behind the marina pier crates."
    }
  }'
```

---

## 2. Admin Endpoints

All `/api/admin/*` endpoints require authentication via header:
- `x-admin-token: <ADMIN_TOKEN>` (or `Authorization: Bearer <ADMIN_TOKEN>`)

Returns `401 Unauthorized` when missing or mismatched.

### `POST /api/admin/sync`
Triggers an immediate multi-source sync (`gta6_news_en`, `gta6_news_zh`, `gta_wiki`, `wikipedia`) and writes results to `IntelFeed` and `SyncRun`.

```bash
curl -X POST "https://gta8.cc/api/admin/sync" \
  -H "x-admin-token: $ADMIN_TOKEN"
```

### `GET /api/admin/submissions`
Lists up to 50 recent community submissions ordered by `createdAt DESC`.

### `POST /api/admin/submissions`
Approves or rejects a pending submission. Approving atomically upserts the pin into `MapMarker` so it appears live on `/gta6/map` immediately.

```bash
curl -X POST "https://gta8.cc/api/admin/submissions" \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -d '{"submissionId":"sub_xxx","action":"approve"}'
```
