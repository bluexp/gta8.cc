import fs from "node:fs";
import path from "node:path";

/**
 * Build-time search index generator for gta8.cc
 * Produces public/search-index.json containing bilingual titles, pinyin initials,
 * categories, routes, and coordinates for zero-latency Fuse.js client search.
 */

const PINYIN_MAP = {
  罪恶海滩: "zeht",
  罪恶城中心: "zeczx",
  雷奥奈达群岛: "landqd",
  沼泽湿地: "zzsd",
  盖尔霍恩港: "geheg",
  安布罗西亚: "ablxy",
  卡拉加山脉: "kljsm",
  扫描点: "smd",
  特技飞跃: "tjfy",
  隐藏包裹: "ycbg",
  霓虹杂志: "nhzz",
  猎豹经典版: "lbjdb",
  女妖: "ny",
  郁金香: "yjx",
  公爵: "gj",
  气垫船: "qdc",
  海洋雀: "hyq",
  直升机: "zsj",
  忍者: "rz",
  卡拉加: "klj",
  花园银行: "hyyh",
  当铺: "dp",
  运钞车: "ycc",
  军火车: "jhc",
  安全屋: "aqw",
  改装: "gz",
  短吻鳄: "dwe",
  火烈鸟: "hln",
  黑豹: "hb",
  战术卡宾: "zskb",
  冲锋枪: "cfq",
  狙击枪: "jjq",
  手枪: "sq",
  霰弹枪: "xdq",
  无敌: "wd",
  通缉: "tj",
  生命: "sm",
  天气: "tq",
  超跑: "cp",
  摩托: "mt",
  抢劫: "qj",
  防盗: "fd",
  彩蛋: "cd",
  剧情: "jq",
};

function derivePinyin(text) {
  const hits = [];
  for (const [k, v] of Object.entries(PINYIN_MAP)) {
    if (text.includes(k)) hits.push(v);
  }
  return hits.join(" ");
}

function extractBlocks(source, fieldNames) {
  const results = [];
  const objRegex = /\{[^{}]*id:\s*"([^"]+)"[^{}]*\}/gs;
  let match;
  while ((match = objRegex.exec(source)) !== null) {
    const block = match[0];
    const item = { id: match[1] };
    for (const field of fieldNames) {
      const strMatch = block.match(new RegExp(`\\b${field}:\\s*"([^"]+)"`));
      if (strMatch) {
        item[field] = strMatch[1];
      } else {
        const numMatch = block.match(new RegExp(`\\b${field}:\\s*(-?\\d+(?:\\.\\d+)?)`));
        if (numMatch) item[field] = Number(numMatch[1]);
      }
    }
    results.push(item);
  }
  return results;
}

function main() {
  const root = process.cwd();
  const dataDir = path.join(root, "src", "data");
  const index = [];

  // 1. Markers
  const markersSrc = fs.readFileSync(path.join(dataDir, "markers.ts"), "utf8");
  for (const m of extractBlocks(markersSrc, ["titleZh", "titleEn", "category", "region", "x", "y"])) {
    if (!m.titleZh) continue;
    index.push({
      id: m.id,
      type: "marker",
      titleZh: m.titleZh,
      titleEn: m.titleEn ?? "",
      pinyin: derivePinyin(`${m.titleZh} ${m.region ?? ""}`),
      category: m.category ?? "marker",
      region: m.region,
      href: `/gta6/map?x=${m.x ?? 0}&y=${m.y ?? 0}&marker=${encodeURIComponent(m.id)}`,
      coords: typeof m.x === "number" && typeof m.y === "number" ? { x: m.x, y: m.y } : undefined,
    });
  }

  // 2. Vehicles
  const vehiclesSrc = fs.readFileSync(path.join(dataDir, "vehicles.ts"), "utf8");
  const vehicleRegex = /id:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?titleZh:\s*"([^"]+)"[\s\S]*?titleEn:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g;
  let vm;
  while ((vm = vehicleRegex.exec(vehiclesSrc)) !== null) {
    index.push({
      id: vm[1],
      type: "vehicle",
      titleZh: vm[3],
      titleEn: vm[4],
      pinyin: derivePinyin(`${vm[3]} ${vm[5]}`),
      category: vm[5],
      href: `/gta6/vehicles/${vm[2]}`,
    });
  }

  // 3. Weapons
  const weaponsSrc = fs.readFileSync(path.join(dataDir, "weapons.ts"), "utf8");
  const weaponRegex = /id:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?titleZh:\s*"([^"]+)"[\s\S]*?titleEn:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g;
  let wm;
  while ((wm = weaponRegex.exec(weaponsSrc)) !== null) {
    index.push({
      id: wm[1],
      type: "weapon",
      titleZh: wm[3],
      titleEn: wm[4],
      pinyin: derivePinyin(`${wm[3]} ${wm[5]}`),
      category: wm[5],
      href: `/gta6/weapons/${wm[2]}`,
    });
  }

  // 4. Cheats
  const cheatsSrc = fs.readFileSync(path.join(dataDir, "cheats.ts"), "utf8");
  for (const c of extractBlocks(cheatsSrc, ["titleZh", "titleEn", "category"])) {
    if (!c.titleZh) continue;
    index.push({
      id: c.id,
      type: "cheat",
      titleZh: c.titleZh,
      titleEn: c.titleEn ?? "",
      pinyin: derivePinyin(`${c.titleZh} ${c.category ?? ""}`),
      category: c.category ?? "作弊码",
      href: `/gta6/cheats#${c.id}`,
    });
  }

  // 5. Guides
  const guidesSrc = fs.readFileSync(path.join(dataDir, "guides.ts"), "utf8");
  const guideRegex = /slug:\s*"([^"]+)"[\s\S]*?titleZh:\s*"([^"]+)"[\s\S]*?titleEn:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g;
  let gm;
  while ((gm = guideRegex.exec(guidesSrc)) !== null) {
    index.push({
      id: `guide-${gm[1]}`,
      type: "guide",
      titleZh: gm[2],
      titleEn: gm[3],
      pinyin: derivePinyin(`${gm[2]} ${gm[4]}`),
      category: gm[4],
      href: `/gta6/guides#${gm[1]}`,
    });
  }

  const publicDir = path.join(root, "public");
  fs.mkdirSync(publicDir, { recursive: true });
  const outPath = path.join(publicDir, "search-index.json");
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2), "utf8");
  console.log(`[search-index] Generated ${index.length} bilingual entries -> public/search-index.json`);
}

main();
