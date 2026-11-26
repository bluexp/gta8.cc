/**
 * High-craft organic Leonida Cartographic Basemap Engine.
 * - `satellite`: Uses photorealistic top-down aerial satellite imagery (/maps/leonida-satellite.jpg)
 *   blended seamlessly into deep ocean #060D1A.
 * - `vector`: Generates an ultra-smooth, organic cubic-Bezier cartographic road & terrain map
 *   inspired by GTA V / GTA VI dark radar atlas aesthetics (realistic bays, barrier islands,
 *   harbor piers, runways, topographic elevation contours, braided wetlands, multi-tier highways).
 * - If NEXT_PUBLIC_TILES_BASE_URL is configured (e.g. https://tiles.gta8.cc), Leaflet uses remote
 *   {z}/{x}/{y}.webp pyramid tiles from Cloudflare R2 instead.
 */

export type BasemapStyle = "satellite" | "vector";

export const OCEAN_BG_COLOR = "#051223";

/**
 * Converts a closed loop of [x, y] points into a smooth C1-continuous Catmull-Rom -> Cubic Bezier SVG path.
 */
function smoothClosedPath(pts: Array<[number, number]>, tension = 0.2): string {
  const n = pts.length;
  if (n < 3) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + " Z";
}

/**
 * Converts an open polyline of [x, y] points into a smooth cubic Bezier curve.
 */
function smoothOpenPath(pts: Array<[number, number]>, tension = 0.22): string {
  const n = pts.length;
  if (n < 2) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

// Organic high-resolution coastline control points (SVG 0..4000, where x=svgX-2000, y=2000-svgY)
const MAINLAND_PTS: Array<[number, number]> = [
  [1260, 520], [1560, 390], [1920, 340], [2290, 355], [2620, 420],
  [2840, 560], [2970, 740], [3050, 960], [3010, 1140], [3085, 1340],
  [3040, 1540], [2995, 1740], [3025, 1960], [2980, 2170], [3030, 2370],
  [2920, 2530], [2740, 2650], [2520, 2720], [2310, 2765], [2140, 2870],
  [1920, 2945], [1680, 3020], [1420, 3040], [1160, 2990], [930, 2880],
  [765, 2710], [670, 2490], [645, 2260], [740, 2060], [820, 1890],
  [720, 1730], [625, 1560], [590, 1360], [650, 1160], [740, 1010],
  [850, 860], [990, 690],
];

const BATHYMETRY_OUTER: Array<[number, number]> = [
  [1040, 310], [1880, 140], [2820, 240], [3440, 660], [3690, 1380],
  [3660, 2240], [3480, 2980], [2940, 3560], [2180, 3720], [1340, 3540],
  [640, 3080], [390, 2320], [410, 1480], [580, 780],
];

const BATHYMETRY_INNER: Array<[number, number]> = [
  [1170, 430], [1920, 260], [2710, 350], [3260, 760], [3560, 1480],
  [3540, 2260], [3360, 2860], [2850, 3360], [2160, 3520], [1360, 3260],
  [720, 2860], [520, 2240], [510, 1460], [720, 840],
];

const VICE_BEACH_PTS: Array<[number, number]> = [
  [3240, 1270], [3345, 1285], [3425, 1420], [3455, 1650], [3470, 1910],
  [3450, 2170], [3395, 2395], [3315, 2465], [3245, 2380], [3225, 2140],
  [3210, 1870], [3205, 1590], [3215, 1370],
];

const STARFISH_PTS: Array<[number, number]> = [
  [3060, 1810], [3125, 1795], [3165, 1855], [3158, 1945], [3100, 1985],
  [3045, 1945], [3035, 1865],
];

const LAKE_LEONIDA_PTS: Array<[number, number]> = [
  [1780, 1340], [1960, 1290], [2130, 1355], [2205, 1480], [2165, 1615],
  [2020, 1685], [1835, 1675], [1710, 1575], [1695, 1445],
];

const GRASSRIVERS_PTS: Array<[number, number]> = [
  [780, 2270], [1080, 2210], [1420, 2235], [1730, 2350], [1860, 2550],
  [1810, 2790], [1560, 2945], [1220, 2965], [910, 2830], [735, 2580],
];

const KALAGA_HILLS_OUTER: Array<[number, number]> = [
  [1420, 640], [1780, 440], [2220, 420], [2620, 520], [2740, 710],
  [2520, 860], [2060, 910], [1620, 860], [1390, 750],
];

const KALAGA_HILLS_MID: Array<[number, number]> = [
  [1640, 620], [1940, 490], [2310, 510], [2540, 620], [2440, 755],
  [2080, 810], [1730, 760],
];

const KALAGA_HILLS_PEAK: Array<[number, number]> = [
  [1860, 610], [2080, 545], [2300, 595], [2250, 695], [1980, 715],
];

const KEYS_ISLANDS: Array<Array<[number, number]>> = [
  [[3120, 2785], [3260, 2745], [3365, 2820], [3315, 2915], [3165, 2925], [3090, 2855]],
  [[2845, 2985], [2990, 2945], [3115, 3000], [3075, 3085], [2910, 3105], [2820, 3045]],
  [[2555, 3130], [2695, 3095], [2810, 3155], [2760, 3235], [2610, 3240], [2530, 3185]],
  [[2245, 3315], [2385, 3285], [2495, 3350], [2445, 3425], [2295, 3435], [2220, 3375]],
  [[3030, 3185], [3140, 3155], [3215, 3210], [3170, 3275], [3055, 3275], [3010, 3225]],
  [[2030, 3395], [2130, 3375], [2185, 3425], [2140, 3475], [2045, 3470]],
];

export function buildLeonidaSvgDataUrl(style: BasemapStyle): string {
  const isSat = style === "satellite";

  const shelfOuter = isSat ? "#081A2C" : "#081222";
  const shelfInner = isSat ? "#0C2940" : "#0B192E";
  const landBase = isSat ? "#1A2923" : "#111724";
  const landHighlight = isSat ? "#21332B" : "#161E2F";
  const coastStroke = isSat ? "#3E7073" : "#00E5FF";
  const cityFill = isSat ? "#232B3B" : "#182032";
  const beachSand = isSat ? "#3D3A2D" : "#1D2436";
  const swampFill = isSat ? "#11281F" : "#0D1E1E";
  const waterChannel = isSat ? "#092133" : "#07111F";
  const hwyMain = isSat ? "#F472B6" : "#FF2E93";
  const hwySec = isSat ? "#38BDF8" : "#00E5FF";
  const roadMinor = isSat ? "rgba(226,232,240,0.22)" : "rgba(148,163,184,0.24)";

  // Smooth interstate & arterial road curves
  const highways = [
    // I-97 North-South Coastal Interstate -> Keys Overseas Highway
    smoothOpenPath([
      [2120, 480], [2380, 680], [2580, 960], [2720, 1280], [2785, 1620],
      [2810, 1980], [2835, 2320], [2960, 2610], [3210, 2835], [2970, 3025],
      [2680, 3165], [2360, 3360], [2105, 3425],
    ]),
    // East-West Cross-State Expressway (Port Gellhorn -> Ambrosia -> Vice City -> Vice Beach)
    smoothOpenPath([
      [780, 1460], [1120, 1390], [1480, 1245], [1860, 1185], [2260, 1215],
      [2560, 1380], [2795, 1605], [3120, 1615], [3335, 1610],
    ]),
    // Southern Wetlands & Airport Corridor
    smoothOpenPath([
      [960, 1490], [920, 1840], [1040, 2180], [1260, 2440], [1640, 2545],
      [2080, 2495], [2490, 2345], [2830, 2245],
    ]),
    // Northern Mount Kalaga Scenic Loop
    smoothOpenPath([
      [960, 1280], [1220, 960], [1560, 740], [1980, 635], [2420, 685],
      [2680, 920], [2745, 1310],
    ]),
    // Central Lake Leonida Ring Road
    smoothOpenPath([
      [1640, 1220], [1610, 1520], [1740, 1745], [2060, 1765], [2280, 1610],
      [2290, 1340], [2120, 1190],
    ]),
    // Vice Beach Ocean Drive & Causeways
    smoothOpenPath([[3320, 1340], [3360, 1640], [3365, 1980], [3320, 2340]]),
    smoothOpenPath([[2800, 1890], [3095, 1890], [3355, 1890]]),
    smoothOpenPath([[2825, 2160], [3095, 2175], [3340, 2185]]),
  ];

  // Organic braided wetland rivers & northern creeks
  const waterways = [
    smoothOpenPath([[2020, 560], [1960, 820], [1940, 1080], [1945, 1310]]),
    smoothOpenPath([[1820, 1660], [1740, 1920], [1620, 2160], [1420, 2420], [1220, 2660], [1080, 2940]]),
    smoothOpenPath([[860, 2460], [1080, 2540], [1310, 2440], [1540, 2580], [1740, 2530]]),
    smoothOpenPath([[960, 2740], [1220, 2680], [1480, 2795], [1690, 2740]]),
    smoothOpenPath([[720, 1520], [920, 1560], [1140, 1520], [1360, 1580]]),
  ];

  // Fine urban arterial grid lines inside Vice City & Port Gellhorn
  const urbanStreets: string[] = [];
  for (let x = 2380; x <= 2940; x += 70) {
    urbanStreets.push(`<line x1="${x}" y1="1380" x2="${x}" y2="2280" />`);
  }
  for (let y = 1400; y <= 2260; y += 72) {
    urbanStreets.push(`<line x1="2340" y1="${y}" x2="2980" y2="${y}" />`);
  }
  for (let x = 800; x <= 1340; x += 90) {
    urbanStreets.push(`<line x1="${x}" y1="1180" x2="${x}" y2="1700" />`);
  }
  for (let y = 1220; y <= 1680; y += 90) {
    urbanStreets.push(`<line x1="780" y1="${y}" x2="1360" y2="${y}" />`);
  }

  const keysPaths = KEYS_ISLANDS.map(
    (pts) =>
      `<path d="${smoothClosedPath(pts, 0.24)}" fill="${landBase}" stroke="${coastStroke}" stroke-opacity="0.55" stroke-width="3.5" />`
  ).join("");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 4000" width="2048" height="2048">
  <defs>
    <radialGradient id="oceanFade" cx="50%" cy="50%" r="54%">
      <stop offset="0%" stop-color="${shelfOuter}" />
      <stop offset="78%" stop-color="${OCEAN_BG_COLOR}" />
      <stop offset="100%" stop-color="${OCEAN_BG_COLOR}" />
    </radialGradient>
    <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${landHighlight}" />
      <stop offset="100%" stop-color="${landBase}" />
    </linearGradient>
    <clipPath id="mainlandClip">
      <path d="${smoothClosedPath(MAINLAND_PTS, 0.22)}" />
    </clipPath>
    <clipPath id="viceBeachClip">
      <path d="${smoothClosedPath(VICE_BEACH_PTS, 0.22)}" />
    </clipPath>
  </defs>

  <!-- Seamless Deep Ocean Backdrop -->
  <rect width="4000" height="4000" fill="url(#oceanFade)" />

  <!-- Organic Bathymetry Continental Shelf Contours -->
  <path d="${smoothClosedPath(BATHYMETRY_OUTER, 0.25)}" fill="${shelfOuter}" opacity="0.65" />
  <path d="${smoothClosedPath(BATHYMETRY_INNER, 0.24)}" fill="${shelfInner}" opacity="0.6" stroke="rgba(0,229,255,0.09)" stroke-width="2" />

  <!-- Subtle Cartographic Graticule -->
  <g stroke="rgba(0,229,255,0.045)" stroke-width="1.5">
    <line x1="800" y1="200" x2="800" y2="3800" />
    <line x1="1600" y1="200" x2="1600" y2="3800" />
    <line x1="2400" y1="200" x2="2400" y2="3800" />
    <line x1="3200" y1="200" x2="3200" y2="3800" />
    <line x1="200" y1="800" x2="3800" y2="800" />
    <line x1="200" y1="1600" x2="3800" y2="1600" />
    <line x1="200" y1="2400" x2="3800" y2="2400" />
    <line x1="200" y1="3200" x2="3800" y2="3200" />
  </g>

  <!-- Leonida Peninsula Mainland -->
  <path d="${smoothClosedPath(MAINLAND_PTS, 0.22)}" fill="url(#landGrad)" stroke="${coastStroke}" stroke-opacity="${isSat ? "0.55" : "0.48"}" stroke-width="5" />

  <!-- Clipped Interior Biomes, Urban Grids, Rivers & Elevation Contours -->
  <g clip-path="url(#mainlandClip)">
    <!-- Mount Kalaga Topographic Elevation Contours -->
    <path d="${smoothClosedPath(KALAGA_HILLS_OUTER, 0.24)}" fill="rgba(255,255,255,0.04)" stroke="rgba(226,232,240,0.14)" stroke-width="2.5" />
    <path d="${smoothClosedPath(KALAGA_HILLS_MID, 0.24)}" fill="rgba(255,255,255,0.045)" stroke="rgba(226,232,240,0.16)" stroke-width="2.5" />
    <path d="${smoothClosedPath(KALAGA_HILLS_PEAK, 0.24)}" fill="rgba(255,255,255,0.06)" stroke="rgba(226,232,240,0.2)" stroke-width="2" />

    <!-- Grassrivers Organic Wetlands -->
    <path d="${smoothClosedPath(GRASSRIVERS_PTS, 0.24)}" fill="${swampFill}" stroke="rgba(74,222,128,0.22)" stroke-width="3" />

    <!-- Urban Metro Zones -->
    <rect x="2320" y="1350" width="720" height="960" rx="90" fill="${cityFill}" opacity="0.88" />
    <rect x="740" y="1140" width="660" height="600" rx="80" fill="${cityFill}" opacity="0.72" />
    <rect x="1860" y="960" width="460" height="280" rx="60" fill="${cityFill}" opacity="0.55" />

    <!-- Fine City Street Network -->
    <g stroke="${roadMinor}" stroke-width="2.2">${urbanStreets.join("")}</g>

    <!-- Vice International Airport Runways (south of Downtown) -->
    <g stroke="rgba(226,232,240,0.55)" stroke-width="9" stroke-linecap="round">
      <line x1="2420" y1="2430" x2="2690" y2="2430" />
      <line x1="2450" y1="2495" x2="2710" y2="2495" />
      <line x1="2510" y1="2385" x2="2640" y2="2545" />
    </g>

    <!-- Rivers & Braided Wetland Channels -->
    <g fill="none" stroke="${waterChannel}" stroke-linecap="round" stroke-linejoin="round">
      ${waterways.map((p, idx) => `<path d="${p}" stroke-width="${idx === 1 ? 18 : 13}" />`).join("")}
    </g>

    <!-- Lake Leonida -->
    <path d="${smoothClosedPath(LAKE_LEONIDA_PTS, 0.24)}" fill="${shelfInner}" stroke="${coastStroke}" stroke-opacity="0.38" stroke-width="3.5" />
  </g>

  <!-- Starfish Island -->
  <path d="${smoothClosedPath(STARFISH_PTS, 0.24)}" fill="${cityFill}" stroke="${coastStroke}" stroke-opacity="0.5" stroke-width="3" />

  <!-- Vice Beach Barrier Island -->
  <path d="${smoothClosedPath(VICE_BEACH_PTS, 0.22)}" fill="${beachSand}" stroke="#FF2E93" stroke-opacity="0.6" stroke-width="4.5" />
  <g clip-path="url(#viceBeachClip)" stroke="${roadMinor}" stroke-width="2">
    <line x1="3260" y1="1280" x2="3260" y2="2450" />
    <line x1="3330" y1="1280" x2="3330" y2="2450" />
    <line x1="3395" y1="1320" x2="3395" y2="2410" />
    <line x1="3200" y1="1480" x2="3460" y2="1480" />
    <line x1="3200" y1="1680" x2="3470" y2="1680" />
    <line x1="3200" y1="1880" x2="3470" y2="1880" />
    <line x1="3200" y1="2080" x2="3460" y2="2080" />
    <line x1="3200" y1="2280" x2="3440" y2="2280" />
  </g>

  <!-- Leonida Keys Archipelago -->
  ${keysPaths}

  <!-- Smooth Multi-Tier Highway & Causeway Network -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- Highway outer dark casing for crisp legibility -->
    ${highways.map((p) => `<path d="${p}" stroke="#060D1A" stroke-width="14" stroke-opacity="0.72" />`).join("")}
    <!-- Colored arterial centerlines -->
    ${highways
      .map(
        (p, i) =>
          `<path d="${p}" stroke="${i === 0 || i === 3 || i === 5 ? hwyMain : hwySec}" stroke-width="${i <= 1 ? 7 : 5.5}" stroke-opacity="0.88" />`
      )
      .join("")}
  </g>
</svg>`.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
