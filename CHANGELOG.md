# Changelog

All notable changes to **GTA8.cc** are documented in this file.

## [1.1.0] - 2026-11-26

### Added
- **9:16 Mobile Wallpapers (`/gta6/wallpapers`)**: Launched Vol. 1 vertical HD Leonida & Vice City mobile wallpapers with an interactive lock-screen clock preview modal and watermark-free HD download.
- **Xiaohongshu Mini-Tool (`xhs-minitool/`)**: Added standalone offline, CSP-safe, Chrome 61 compatible Red App source, native `window.xhs.miniTool` SDK integration (safe area, storage, album save, share), validator/packager (`build-zip.mjs`), 1:1 icon, 3:4 cover, and release guide.
- **Full Open-Source Community Governance**: Added `CODE_OF_CONDUCT.md`, `SECURITY.md`, GitHub Issue/PR templates, `wrangler.example.jsonc`, and homepage/navbar/footer GitHub open-source links; hardened `/api/admin/*` to fail closed when `ADMIN_TOKEN` is unset.

### Changed
- Decluttered the desktop navigation bar by grouping encyclopedias under a clean **Wiki** dropdown and preventing language pill line-wrapping.

## [1.0.0] - 2026-11-26

### Added
- **Core Platform & Dark Neon UI**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 Vice City dark neon theme (`#0D0F14` / `#161922` / `#FF2E93` / `#00E5FF`).
- **Bilingual Support (EN Default + 中文)**: Hydration-safe Zustand locale store (`useLocaleStore`) with instant `EN | 中文` navbar switcher across all pages, map tooltips, modals, and wiki entries.
- **Interactive Leonida Map (`/gta6/map`)**: Leaflet `CRS.Simple` planar map with Satellite/Vector basemap switching, zoom-aware clustering, category counters, marker completion dimming, right-click coordinate share links, JSON export/import, D1 cloud sync, and Turnstile-ready UGC submission modal.
- **Cloudflare D1 + Cron Auto-Sync Engine**:
  - Provisioned `gta8-db` D1 database with `0001_init.sql` and `0002_auto_sync.sql`.
  - Custom Worker entrypoint (`custom-worker.ts`) running `0 */6 * * *` Cron sync across `gta6_news_en`, `gta6_news_zh`, `gta_wiki`, and `wikipedia`.
  - Added `/gta6/intel` live synced feed and `ADMIN_TOKEN`-protected `/admin` review & manual sync console.
- **Encyclopedias & Tools**:
  - 100% Completion & Trophy Checklist (`/gta6/checklist`) bidirectionally synced with map markers.
  - Vehicles (`/gta6/vehicles/[slug]`) & Weapons (`/gta6/weapons/[slug]`) SSG pages with 5-axis SVG radar charts and embedded Mini Spawn Locator Maps.
  - Collectibles Guide (`/gta6/collectibles`), Visual PS5/Xbox Cheat Codes (`/gta6/cheats`), and Interactive Heist Payout Calculator + Guides (`/gta6/guides`).
- **SEO & Pipelines**: Dynamic `sitemap.xml`, `robots.txt`, build-time Fuse.js bilingual search indexer (`scripts/generate-search-index.mjs`), and `pyvips` WebP map tile slicer (`scripts/slice-tiles.py`).
- **Live Deployment**: Deployed to Cloudflare Workers (`gta8-cc`) with custom domains `gta8.cc` and `www.gta8.cc`.
