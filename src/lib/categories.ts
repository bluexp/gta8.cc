import type { MarkerCategory, MarkerSubType } from "@/types/gta";

export const CATEGORY_META: Record<
  MarkerCategory,
  {
    labelZh: string;
    labelEn: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    shortCode: string;
  }
> = {
  collectible: {
    labelZh: "全收集品",
    labelEn: "Collectibles",
    color: "#FF2E93",
    bgClass: "bg-[#FF2E93]/15",
    textClass: "text-[#FF2E93]",
    borderClass: "border-[#FF2E93]/40",
    shortCode: "CL",
  },
  vehicle: {
    labelZh: "载具刷新点",
    labelEn: "Vehicles",
    color: "#00E5FF",
    bgClass: "bg-[#00E5FF]/15",
    textClass: "text-[#00E5FF]",
    borderClass: "border-[#00E5FF]/40",
    shortCode: "VH",
  },
  heist: {
    labelZh: "抢劫与高收益",
    labelEn: "Heists & Loot",
    color: "#FFB800",
    bgClass: "bg-[#FFB800]/15",
    textClass: "text-[#FFB800]",
    borderClass: "border-[#FFB800]/40",
    shortCode: "HS",
  },
  service: {
    labelZh: "军火与据点",
    labelEn: "Services & Gear",
    color: "#A855F7",
    bgClass: "bg-[#A855F7]/15",
    textClass: "text-[#A855F7]",
    borderClass: "border-[#A855F7]/40",
    shortCode: "SV",
  },
  wildlife: {
    labelZh: "野生与生态",
    labelEn: "Wildlife",
    color: "#22C55E",
    bgClass: "bg-[#22C55E]/15",
    textClass: "text-[#22C55E]",
    borderClass: "border-[#22C55E]/40",
    shortCode: "WL",
  },
};

export const SUBTYPE_META: Record<
  MarkerSubType,
  { labelZh: string; labelEn: string; category: MarkerCategory }
> = {
  waink_scan: { labelZh: "WAiNK 扫描点", labelEn: "WAiNK Scan", category: "collectible" },
  stunt_jump: { labelZh: "特技飞跃", labelEn: "Stunt Jump", category: "collectible" },
  hidden_package: { labelZh: "隐藏包裹", labelEn: "Hidden Package", category: "collectible" },
  neon_magazine: { labelZh: "霓虹杂志", labelEn: "Neon Magazine", category: "collectible" },
  supercar: { labelZh: "超级跑车", labelEn: "Supercar", category: "vehicle" },
  muscle: { labelZh: "美式肌肉车", labelEn: "Muscle Car", category: "vehicle" },
  boat: { labelZh: "快艇 / 气垫船", labelEn: "Boat / Airboat", category: "vehicle" },
  aircraft: { labelZh: "直升机 / 飞机", labelEn: "Aircraft", category: "vehicle" },
  bank: { labelZh: "金库与银行", labelEn: "Bank Vault", category: "heist" },
  pawn_shop: { labelZh: "高价当铺", labelEn: "Pawn Shop", category: "heist" },
  armored_truck: { labelZh: "运钞车伏击", labelEn: "Armored Truck", category: "heist" },
  gun_van: { labelZh: "黑市军火车", labelEn: "Gun Van", category: "service" },
  safehouse: { labelZh: "安全屋", labelEn: "Safehouse", category: "service" },
  customs: { labelZh: "改装车厂", labelEn: "Vice Customs", category: "service" },
  alligator: { labelZh: "沼泽短吻鳄", labelEn: "Swamp Alligator", category: "wildlife" },
  flamingo: { labelZh: "火烈鸟栖息地", labelEn: "Flamingo Flock", category: "wildlife" },
  panther: { labelZh: "雷奥奈达黑豹", labelEn: "Leonida Panther", category: "wildlife" },
};

export const LEONIDA_REGIONS = [
  { id: "vice-beach", zh: "罪恶海滩", en: "Vice Beach", center: { x: 1250, y: 120 } },
  { id: "vice-downtown", zh: "罪恶城中心", en: "Vice City Downtown", center: { x: 650, y: 180 } },
  { id: "leonida-keys", zh: "雷奥奈达群岛", en: "Leonida Keys", center: { x: 820, y: -1120 } },
  { id: "grassrivers", zh: "沼泽湿地", en: "Grassrivers", center: { x: -750, y: -680 } },
  { id: "port-gellhorn", zh: "盖尔霍恩港", en: "Port Gellhorn", center: { x: -960, y: 580 } },
  { id: "ambrosia", zh: "安布罗西亚", en: "Ambrosia", center: { x: 80, y: 780 } },
  { id: "mount-kalaga", zh: "卡拉加山脉", en: "Mount Kalaga", center: { x: 180, y: 1450 } },
] as const;
