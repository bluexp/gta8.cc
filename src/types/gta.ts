export type MarkerCategory =
  | "collectible"
  | "vehicle"
  | "heist"
  | "service"
  | "wildlife";

export type MarkerSubType =
  | "waink_scan"
  | "stunt_jump"
  | "hidden_package"
  | "neon_magazine"
  | "supercar"
  | "muscle"
  | "boat"
  | "aircraft"
  | "bank"
  | "pawn_shop"
  | "armored_truck"
  | "gun_van"
  | "safehouse"
  | "customs"
  | "alligator"
  | "flamingo"
  | "panther";

export interface MapMarker {
  id: string;
  gameVersion: "gta6";
  category: MarkerCategory;
  subType: MarkerSubType;
  titleZh: string;
  titleEn: string;
  region: string;
  regionEn: string;
  x: number; // Planar coordinate: -2000 to 2000
  y: number; // Planar coordinate: -2000 to 2000
  descriptionMd: string;
  descriptionEn?: string;
  mediaUrls: string[];
  linkedEntityId?: string;
  linkedEntityType?: "vehicle" | "weapon";
  contributor?: string;
  isVerified: boolean;
}

export interface VehicleStats {
  topSpeed: number; // 0-100
  acceleration: number; // 0-100
  handling: number; // 0-100
  braking: number; // 0-100
  antiTheft: number; // 1-5 stars
  topSpeedKmh: number;
  price: number;
  seats: number;
  drivetrain: "RWD" | "AWD" | "FWD" | "Water" | "Air";
}

export interface VehicleEntity {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  manufacturer: string;
  category: "超级跑车" | "肌肉车" | "经典跑车" | "摩托车" | "越野车" | "船艇" | "航空器";
  categoryEn: string;
  accentColor: string;
  stats: VehicleStats;
  summary: string;
  summaryEn?: string;
  acquisition: string;
  acquisitionEn?: string;
  relatedMissions: string[];
  spawnMarkerIds: string[];
  contributor?: string;
}

export interface WeaponStats {
  damage: number; // 0-100
  fireRate: number; // 0-100
  accuracy: number; // 0-100
  range: number; // 0-100
  mobility: number; // 0-100
  clipSize: number;
  price: number;
}

export interface WeaponEntity {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  category: "手枪" | "冲锋枪" | "突击步枪" | "霰弹枪" | "狙击枪" | "重武器" | "近战";
  categoryEn: string;
  stats: WeaponStats;
  summary: string;
  summaryEn?: string;
  acquisition: string;
  acquisitionEn?: string;
  attachments: string[];
  attachmentsEn?: string[];
  spawnMarkerIds: string[];
  contributor?: string;
}

export type CheatButton =
  | "UP"
  | "DOWN"
  | "LEFT"
  | "RIGHT"
  | "TRIANGLE"
  | "CIRCLE"
  | "CROSS"
  | "SQUARE"
  | "L1"
  | "R1"
  | "L2"
  | "R2";

export interface CheatCode {
  id: string;
  titleZh: string;
  titleEn: string;
  category: "角色状态" | "载具生成" | "世界效果" | "通缉与战斗";
  effect: string;
  effectEn?: string;
  ps5: CheatButton[];
  xbox: string[];
  phone: string;
  disablesTrophies: boolean;
}

export interface ChecklistItem {
  id: string;
  section: "主线剧情" | "全收集品" | "特技与挑战" | "载具与武器" | "奖杯成就";
  titleZh: string;
  titleEn: string;
  description: string;
  descriptionEn?: string;
  weight: number; // Contribution weight toward 100%
  linkedMarkerId?: string;
  trophyTier?: "Platinum" | "Gold" | "Silver" | "Bronze";
}

export interface GuideArticle {
  slug: string;
  titleZh: string;
  titleEn: string;
  category: "剧情分支" | "抢劫攻略" | "彩蛋揭秘" | "机制解析";
  categoryEn?: string;
  readMinutes: number;
  summary: string;
  summaryEn?: string;
  updatedAt: string;
  highlights: string[];
  highlightsEn?: string[];
  sections: { heading: string; headingEn?: string; body: string; bodyEn?: string }[];
}

export interface SearchIndexItem {
  id: string;
  type: "marker" | "vehicle" | "weapon" | "cheat" | "guide";
  titleZh: string;
  titleEn: string;
  pinyin: string;
  category: string;
  region?: string;
  href: string;
  coords?: { x: number; y: number };
}
