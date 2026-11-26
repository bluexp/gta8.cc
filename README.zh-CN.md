# GTA8.cc · GTA 6 雷奥奈达交互地图与全图鉴

[![Live Site](https://img.shields.io/badge/Live-gta8.cc-FF2E93?style=flat-square)](https://gta8.cc)
[![License: MIT](https://img.shields.io/badge/License-MIT-00E5FF?style=flat-square)](./LICENSE)
[![CI](https://github.com/bluexp/gta8.cc/actions/workflows/ci.yml/badge.svg)](https://github.com/bluexp/gta8.cc/actions/workflows/ci.yml)

> **线上访问：** [https://gta8.cc](https://gta8.cc) | **GitHub 开源仓库：** [bluexp/gta8.cc](https://github.com/bluexp/gta8.cc) | **English README:** [README.md](./README.md)

**GTA8.cc** 是一套 **100% 完全开源（MIT 协议）** 的《GTA 6》一站式实用工具站与全收集数据库（Tool + Wiki），采用暗黑霓虹视觉体系（`#0D0F14` / `#161922` / `#FF2E93` / `#00E5FF`），基于 **Next.js 16 (App Router) + TypeScript + Tailwind CSS + Leaflet (`CRS.Simple`) + Fuse.js + Zustand** 构建，并完整部署于 **Cloudflare Workers + D1 + Cron Triggers** 边缘架构（起步阶段完全运行在 Cloudflare 免费套餐内）。自部署可直接复制 [wrangler.example.jsonc](./wrangler.example.jsonc) 填入自己的 D1 ID 与域名。

全站**默认显示英文版（`EN`）**，右上角提供一键无刷新切换 **简体中文（`中文`）**，自动持久化至浏览器本地。

---

## 核心功能模块

| 路由 | 模块 | 核心能力 |
| --- | --- | --- |
| `/` | 首页聚合台 | 中英双语/拼音首字母零延迟搜索（Fuse.js）、地图预览、个人探索总进度、热门工具矩阵 |
| `/gta6/map` | 雷奥奈达交互大地图 | Leaflet `CRS.Simple` 平面坐标、卫星/矢量路网切换、低倍缩放聚合、分类统计（已打卡/总数）、右键分享精确坐标（如 `?x=1240&y=-850`）、打卡半透明降噪、JSON 备份、D1 云端同步与社区纠错弹窗 |
| `/gta6/intel` | 实时自动同步情报 | Cloudflare Cron 每 6 小时自动抓取中英文 GTA 6 资讯、GTA Wiki 与 Wikipedia 词条入库 D1 |
| `/gta6/checklist` | 100% 完成度与全奖杯清单 | 免登录本地持久化，与大地图标点双向实时联动 |
| `/gta6/vehicles` | 载具全图鉴 | 按车型、极速、防盗等级（Lv.1–5）筛选；详情页含五维性能雷达图与迷你刷新点地图 |
| `/gta6/weapons` | 武器与黑市装备库 | 伤害/射速/精准/射程/机动面板、推荐改装配件与黑市军火车坐标联动 |
| `/gta6/collectibles` | 全收集品指南 | WAiNK 扫描点、特技飞跃、隐藏包裹、霓虹杂志分项进度条与一键飞图 |
| `/gta6/cheats` | PS5 / Xbox 手柄作弊码 | 可视化 DualSense / Xbox 按键图标 + 手机拨号代码，分类筛选与一键复制 |
| `/gta6/guides` | 攻略专栏与抢劫速算器 | 交互式**抢劫收益速算器**（团队抽成/销赃/战损/多人分红净收益）+ 剧情分支与彩蛋指南 |
| `/admin` | 实时运维与投稿审核台 | 受 `ADMIN_TOKEN` 保护，支持一键手动全源同步与社区投稿审核（通过后实时写入 D1 上线大地图） |

---

## 快速开始

```bash
# 1. 安装依赖（国内网络可加 --registry=https://registry.npmmirror.com）
npm install

# 2. 生成中英双语搜索索引
npm run search:index

# 3. 启动本地开发服务器
npm run dev
```

### Cloudflare Workers 本地模拟与部署

```bash
# 本地 D1 建表迁移
npm run db:migrate:local

# 构建 OpenNext Cloudflare 产物并本地 workerd 预览
npm run cf:build
npx wrangler dev --local

# 线上 D1 迁移、设置管理员密钥并部署至 gta8.cc
npm run db:migrate:remote
npx wrangler secret put ADMIN_TOKEN
npm run cf:deploy
```

---

## 详细文档导航

- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — 系统架构、平面坐标系、双语 i18n、D1 表结构与 Cron 自动同步流水线
- **[docs/API.md](./docs/API.md)** — 全站 REST API 接口文档与调用示例
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** — Cloudflare 零成本部署、D1/R2 瓦片切图与密钥运维手册
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — 社区贡献与 PR 指南
- **[CHANGELOG.md](./CHANGELOG.md)** — 版本变更日志

---

## 免责声明与开源协议

GTA8.cc 为非官方玩家社区工具与资料站，与 Rockstar Games 及 Take-Two Interactive Software, Inc. 无任何隶属或赞助关系。本项目源代码采用 [MIT License](./LICENSE) 开源。
