# Deployment & Operations Runbook — GTA8.cc

This runbook covers deploying **GTA8.cc** on Cloudflare Workers Free Plan (`$0/month` within free quotas), managing D1 migrations, configuring secrets, and building high-resolution R2 map tiles.

---

## 1. Cloudflare Free Tier Budget

| Resource | Free Quota | GTA8.cc Usage |
| --- | --- | --- |
| Workers Requests | 100,000 req/day (static assets excluded) | API + SSR only; static assets served free via CDN |
| Cron Triggers | Up to 5 triggers | 1 trigger (`0 */6 * * *` = 4 runs/day) |
| D1 Database (`gta8-db`) | 5 GB storage, 5M reads/day, 100K writes/day | `< 1 MB` storage, ~300 writes/day |
| DNS + Custom Domains + SSL | Unlimited | `gta8.cc`, `www.gta8.cc` |
| R2 Object Storage (optional) | 10 GB storage, $0 egress | Map tiles (`tiles.gta8.cc`) |

---

## 2. Initial Setup & Deployment

### Step 1: Authenticate Wrangler
```bash
npx wrangler login
npx wrangler whoami
```

### Step 2: Create & Bind D1 Database
```bash
npx wrangler d1 create gta8-db
```
Ensure `wrangler.jsonc` has your `database_id` under `d1_databases`:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "gta8-db",
    "database_id": "<YOUR_D1_DATABASE_ID>",
    "migrations_dir": "migrations"
  }
]
```

### Step 3: Apply Database Migrations
```bash
npm run db:migrate:remote
```

### Step 4: Configure Encrypted Worker Secrets
```bash
# Required: protects /admin and /api/admin/*
npx wrangler secret put ADMIN_TOKEN

# Optional: enables live Cloudflare Turnstile verification on /api/submissions
npx wrangler secret put TURNSTILE_SECRET_KEY
```

### Step 5: Build & Deploy
```bash
npm run cf:deploy
```

Cloudflare automatically provisions Custom Domain DNS records and Universal SSL certificates for `gta8.cc` and `www.gta8.cc`.

---

## 3. High-Resolution Map Tile Pipeline (Cloudflare R2)

When high-resolution Leonida basemap imagery (`8192×8192` or `16384×16384`) is ready:

1. **Install `pyvips`** (macOS):
   ```bash
   brew install vips
   pip3 install pyvips
   ```
2. **Generate Google-layout WebP tile pyramids** (zoom levels 0–5):
   ```bash
   python3 scripts/slice-tiles.py \
     --input ./leonida-satellite-16384.png \
     --output ./tiles-output/satellite \
     --quality 82 \
     --tile-size 256

   python3 scripts/slice-tiles.py \
     --input ./leonida-vector-16384.png \
     --output ./tiles-output/vector \
     --quality 82 \
     --tile-size 256
   ```
3. **Create R2 bucket & bind custom domain `tiles.gta8.cc`**:
   ```bash
   npx wrangler r2 bucket create gta8-tiles
   ```
   Bind `tiles.gta8.cc` in Cloudflare Dashboard -> R2 -> `gta8-tiles` -> Settings -> Custom Domains.
4. **Upload tiles with immutable cache headers**:
   ```bash
   rclone copy ./tiles-output r2:gta8-tiles \
     --transfers 32 \
     --header-upload "Cache-Control: public, max-age=31536000, immutable"
   ```
5. **Enable remote tiles** in `wrangler.jsonc`:
   ```jsonc
   "vars": {
     "NEXT_PUBLIC_SITE_URL": "https://gta8.cc",
     "NEXT_PUBLIC_TILES_BASE_URL": "https://tiles.gta8.cc"
   }
   ```
   Then redeploy with `npm run cf:deploy`.

---

## 4. Troubleshooting

- **Local browser shows `ERR_NAME_NOT_RESOLVED` right after domain registration**:
  - Clear Chrome DNS cache at `chrome://net-internals/#dns` -> **Clear host cache**.
  - Flush macOS DNS cache: `sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`.
- **Inspect live Worker logs**:
  ```bash
  npx wrangler tail gta8-cc
  ```
- **Manually trigger a data sync**:
  - Visit `https://gta8.cc/admin`, sign in with your `ADMIN_TOKEN`, and click **Run Full Sync Now**.
