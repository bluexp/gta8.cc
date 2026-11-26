/**
 * High-detail procedural Leonida SVG basemap generator (Satellite & Vector modes).
 * Coordinate system maps SVG [0..4000, 0..4000] directly onto planar Leaflet CRS.Simple
 * bounds X: [-2000, 2000], Y: [-2000, 2000] (svgX = x + 2000, svgY = 2000 - y).
 * When NEXT_PUBLIC_TILES_BASE_URL is configured (e.g. https://tiles.gta8.cc),
 * the map automatically layers real {z}/{x}/{y}.webp tiles from Cloudflare R2.
 */

export type BasemapStyle = "satellite" | "vector";

export function buildLeonidaSvgDataUrl(style: BasemapStyle): string {
  const isSat = style === "satellite";

  const oceanBg = isSat ? "#06111F" : "#070A12";
  const shallowOcean = isSat ? "#0B2438" : "#0B1220";
  const landFill = isSat ? "#1A2524" : "#121622";
  const landStroke = isSat ? "#2D4F54" : "#00E5FF";
  const cityFill = isSat ? "#232838" : "#1A2030";
  const swampFill = isSat ? "#132922" : "#101E1D";
  const mountainFill = isSat ? "#25292E" : "#181C28";
  const beachFill = isSat ? "#3B372B" : "#1E2232";
  const hwyPrimary = isSat ? "#FF2E93" : "#FF2E93";
  const hwySecondary = isSat ? "#00E5FF" : "#00E5FF";
  const gridColor = isSat ? "rgba(255,255,255,0.045)" : "rgba(0,229,255,0.07)";

  // Helper coordinate grid lines every 400 units
  const gridLines: string[] = [];
  for (let i = 400; i < 4000; i += 400) {
    gridLines.push(
      `<line x1="${i}" y1="0" x2="${i}" y2="4000" stroke="${gridColor}" stroke-width="2" />`,
      `<line x1="0" y1="${i}" x2="4000" y2="${i}" stroke="${gridColor}" stroke-width="2" />`
    );
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 4000" width="2048" height="2048">
  <defs>
    <radialGradient id="oceanGlow" cx="55%" cy="52%" r="60%">
      <stop offset="0%" stop-color="${shallowOcean}" />
      <stop offset="100%" stop-color="${oceanBg}" />
    </radialGradient>
    <radialGradient id="viceGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,46,147,0.22)" />
      <stop offset="100%" stop-color="rgba(255,46,147,0)" />
    </radialGradient>
    <radialGradient id="keysGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(0,229,255,0.18)" />
      <stop offset="100%" stop-color="rgba(0,229,255,0)" />
    </radialGradient>
    <pattern id="cityBlocks" width="44" height="44" patternUnits="userSpaceOnUse">
      <rect x="4" y="4" width="16" height="16" fill="rgba(255,255,255,0.035)" rx="2" />
      <rect x="24" y="4" width="16" height="12" fill="rgba(0,229,255,0.04)" rx="2" />
      <rect x="4" y="24" width="12" height="16" fill="rgba(255,46,147,0.035)" rx="2" />
      <rect x="20" y="22" width="20" height="18" fill="rgba(255,255,255,0.03)" rx="2" />
    </pattern>
  </defs>

  <!-- Ocean -->
  <rect width="4000" height="4000" fill="url(#oceanGlow)" />

  <!-- Bathymetry coastal shelf -->
  <path d="M 480 420 Q 1900 180 3260 520 Q 3680 1280 3560 2320 Q 3400 3280 2640 3580 Q 1780 3700 1080 3380 Q 440 2900 420 1860 Q 380 960 480 420 Z"
        fill="${shallowOcean}" opacity="0.55" />

  <!-- Coordinate Graticule -->
  <g>${gridLines.join("")}</g>

  <!-- Main Leonida Peninsula -->
  <path d="
    M 680 620
    C 1100 320, 2100 260, 2860 480
    C 3180 620, 3260 1120, 3140 1620
    L 3110 2260
    C 3050 2560, 2760 2780, 2320 2790
    L 1760 2960
    C 1220 3080, 740 2860, 620 2420
    C 540 2060, 760 1760, 620 1440
    C 480 1120, 520 820, 680 620 Z"
    fill="${landFill}" stroke="${landStroke}" stroke-opacity="${isSat ? "0.65" : "0.45"}" stroke-width="6" />

  <!-- Mount Kalaga Northern Highlands (x: -600..900, y: 1150..1750 -> svgX: 1400..2900, svgY: 250..850) -->
  <path d="M 1340 680 Q 1860 320 2580 440 Q 2820 620 2640 840 Q 2080 940 1460 880 Z"
        fill="${mountainFill}" stroke="rgba(255,255,255,0.1)" stroke-width="3" />
  <path d="M 1640 620 Q 2020 430 2380 540 Q 2480 680 2220 760 Q 1820 790 1640 620 Z"
        fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-dasharray="12 10" />

  <!-- Grassrivers Wetlands (x: -1350..-150, y: -1200..-250 -> svgX: 650..1850, svgY: 2250..3200) -->
  <path d="M 760 2240 Q 1340 2180 1840 2380 Q 1920 2780 1540 2960 Q 980 2980 740 2620 Z"
        fill="${swampFill}" stroke="rgba(34,197,94,0.3)" stroke-width="4" />
  <!-- Wetland water channels -->
  <path d="M 880 2480 Q 1120 2560 1320 2420 T 1720 2560 M 1020 2760 Q 1300 2680 1580 2820"
        fill="none" stroke="#0C2C3C" stroke-width="18" stroke-linecap="round" />

  <!-- Lake Leonida (central inland lake) -->
  <ellipse cx="1920" cy="1480" rx="260" ry="185" fill="${oceanBg}" stroke="${landStroke}" stroke-opacity="0.4" stroke-width="4" />

  <!-- Vice City Downtown Urban Grid (x: 350..900, y: -250..650 -> svgX: 2350..2900, svgY: 1350..2250) -->
  <path d="M 2320 1360 L 2960 1340 L 2990 2260 L 2360 2290 Z" fill="${cityFill}" />
  <path d="M 2320 1360 L 2960 1340 L 2990 2260 L 2360 2290 Z" fill="url(#cityBlocks)" />

  <!-- Vice Beach Barrier Island (x: 1150..1550, y: -350..680 -> svgX: 3150..3550, svgY: 1320..2350) -->
  <path d="M 3220 1280 Q 3440 1320 3470 1760 Q 3490 2180 3380 2420 Q 3260 2440 3210 2220 Q 3190 1720 3220 1280 Z"
        fill="${beachFill}" stroke="#FF2E93" stroke-opacity="0.55" stroke-width="5" />
  <path d="M 3250 1360 L 3410 1380 L 3410 2320 L 3250 2300 Z" fill="url(#cityBlocks)" />

  <!-- Starfish Island between Downtown and Vice Beach -->
  <ellipse cx="3095" cy="1890" rx="75" ry="120" fill="${cityFill}" stroke="#00E5FF" stroke-opacity="0.45" stroke-width="3" />

  <!-- Port Gellhorn West Coast Harbor (x: -1450..-450, y: 150..1050 -> svgX: 550..1550, svgY: 950..1850) -->
  <path d="M 760 1120 L 1380 1160 L 1360 1720 L 820 1740 Z" fill="${cityFill}" opacity="0.85" />
  <path d="M 760 1120 L 1380 1160 L 1360 1720 L 820 1740 Z" fill="url(#cityBlocks)" />

  <!-- Leonida Keys Archipelago (x: 200..1450, y: -1550..-700 -> svgX: 2200..3450, svgY: 2700..3550) -->
  <g fill="${landFill}" stroke="#00E5FF" stroke-opacity="0.55" stroke-width="4">
    <ellipse cx="3240" cy="2850" rx="145" ry="62" transform="rotate(-24 3240 2850)" />
    <ellipse cx="2980" cy="3030" rx="150" ry="56" transform="rotate(-18 2980 3030)" />
    <ellipse cx="2680" cy="3165" rx="135" ry="52" transform="rotate(-10 2680 3165)" />
    <ellipse cx="2360" cy="3360" rx="120" ry="48" transform="rotate(8 2360 3360)" />
    <ellipse cx="3120" cy="3220" rx="90" ry="42" transform="rotate(-15 3120 3220)" />
  </g>

  <!-- Ambient Neon Glows -->
  <circle cx="3280" cy="1820" r="460" fill="url(#viceGlow)" />
  <circle cx="2880" cy="3080" r="420" fill="url(#keysGlow)" />

  <!-- Major Highways & Causeways -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- I-97 Coastal Neon Highway -->
    <path d="M 2240 520 Q 2620 920 2780 1440 L 2840 2280 Q 2960 2620 3240 2850 L 2980 3030 L 2680 3165 L 2360 3360"
          stroke="${hwyPrimary}" stroke-width="10" stroke-opacity="0.82" />
    <!-- East-West Cross-State Expressway -->
    <path d="M 880 1460 Q 1520 1240 2180 1220 Q 2640 1320 2840 1620 L 3330 1620"
          stroke="${hwySecondary}" stroke-width="9" stroke-opacity="0.78" />
    <!-- Vice Beach Causeways -->
    <path d="M 2840 1890 L 3330 1890 M 2840 2140 L 3310 2140"
          stroke="${hwySecondary}" stroke-width="7" stroke-opacity="0.85" />
    <!-- Port Gellhorn -> Grassrivers -> Vice City Southern Belt -->
    <path d="M 1020 1480 Q 1080 2020 1320 2420 Q 1900 2580 2660 2260"
          stroke="${hwySecondary}" stroke-width="7" stroke-opacity="0.58" />
    <!-- Ambrosia -> Mount Kalaga Loop -->
    <path d="M 1040 1260 Q 1620 820 2260 660 Q 2680 860 2760 1380"
          stroke="${hwyPrimary}" stroke-width="7" stroke-opacity="0.55" />
  </g>

  <!-- Bilingual District Labels -->
  <g font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">
    <text x="3340" y="1760" fill="#FF2E93" font-size="52" font-weight="900" letter-spacing="4">VICE BEACH</text>
    <text x="3340" y="1820" fill="#F8FAFC" font-size="38" font-weight="700" opacity="0.9">罪恶海滩</text>

    <text x="2650" y="1780" fill="#00E5FF" font-size="56" font-weight="900" letter-spacing="4">VICE CITY</text>
    <text x="2650" y="1842" fill="#E2E8F0" font-size="38" font-weight="700" opacity="0.88">罪恶城中心</text>

    <text x="2840" y="3300" fill="#00E5FF" font-size="48" font-weight="900" letter-spacing="4">LEONIDA KEYS</text>
    <text x="2840" y="3360" fill="#F8FAFC" font-size="36" font-weight="700" opacity="0.85">雷奥奈达群岛</text>

    <text x="1280" y="2640" fill="#4ADE80" font-size="48" font-weight="900" letter-spacing="4">GRASSRIVERS</text>
    <text x="1280" y="2700" fill="#DCFCE7" font-size="36" font-weight="700" opacity="0.85">沼泽湿地</text>

    <text x="1080" y="1420" fill="#FFB800" font-size="46" font-weight="900" letter-spacing="3">PORT GELLHORN</text>
    <text x="1080" y="1480" fill="#FEF3C7" font-size="36" font-weight="700" opacity="0.85">盖尔霍恩港</text>

    <text x="2080" y="1160" fill="#C084FC" font-size="44" font-weight="900" letter-spacing="3">AMBROSIA</text>
    <text x="2080" y="1218" fill="#F3E8FF" font-size="34" font-weight="700" opacity="0.85">安布罗西亚</text>

    <text x="2140" y="590" fill="#E2E8F0" font-size="46" font-weight="900" letter-spacing="3">MOUNT KALAGA</text>
    <text x="2140" y="648" fill="#CBD5E1" font-size="34" font-weight="700" opacity="0.85">卡拉加山脉</text>
  </g>
</svg>`.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
