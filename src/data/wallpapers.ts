export interface WallpaperItem {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  regionEn: string;
  regionZh: string;
  category: "vice-beach" | "supercars" | "leonida-keys";
  categoryEn: string;
  categoryZh: string;
  descriptionEn: string;
  descriptionZh: string;
  imageSrc: string;
  downloadName: string;
  palette: [string, string, string];
  aspectRatio: string;
  tagsEn: string[];
  tagsZh: string[];
}

export const WALLPAPERS: WallpaperItem[] = [
  {
    id: "wp-vice-beach-sunset",
    slug: "vice-beach-sunset",
    titleEn: "Vice Beach Neon Sunset",
    titleZh: "罪恶海滩 · 霓虹日落",
    regionEn: "Vice Beach",
    regionZh: "罪恶海滩",
    category: "vice-beach",
    categoryEn: "Vice Beach",
    categoryZh: "罪恶海滩",
    descriptionEn:
      "Art-deco beachfront hotels glowing in magenta and Miami cyan, palm silhouettes framing a rain-kissed boulevard with clean upper twilight sky for your lock-screen clock.",
    descriptionZh:
      "迈阿密装饰艺术风海滨霓虹酒店、棕榈剪影与湿润反光海滨大道，顶部预留深色暗调天空，完美适配手机锁屏时间。",
    imageSrc: "/wallpapers/vice-beach-sunset.jpg",
    downloadName: "GTA8-Vice-Beach-Neon-Sunset-9x16.jpg",
    palette: ["#FF2E93", "#00E5FF", "#161922"],
    aspectRatio: "9:16 Mobile HD",
    tagsEn: ["Vice Beach", "Sunset", "Art Deco", "Lock Screen"],
    tagsZh: ["罪恶海滩", "霓虹日落", "锁屏适配"],
  },
  {
    id: "wp-grassrivers-dusk",
    slug: "grassrivers-airboat",
    titleEn: "Grassrivers Twilight Bayou",
    titleZh: "沼泽湿地 · 暮色气垫船",
    regionEn: "Grassrivers",
    regionZh: "沼泽湿地",
    category: "leonida-keys",
    categoryEn: "Wetlands",
    categoryZh: "沼泽湿地",
    descriptionEn:
      "Misty southern wetlands at purple-amber dusk as an airboat slices across glassy bayou water with Vice City's pink-cyan skyline glowing on the distant horizon.",
    descriptionZh:
      "雾气氤氲的暮色湿地，气垫船头灯划破镜面水域，柏树剪影与远方粉青双色罪恶城天际线交相辉映。",
    imageSrc: "/wallpapers/grassrivers-airboat.jpg",
    downloadName: "GTA8-Grassrivers-Twilight-9x16.jpg",
    palette: ["#A855F7", "#FF2E93", "#0F172A"],
    aspectRatio: "9:16 Mobile HD",
    tagsEn: ["Grassrivers", "Airboat", "Wetlands", "OLED Dark"],
    tagsZh: ["沼泽湿地", "气垫船", "暗调护眼"],
  },
  {
    id: "wp-neon-garage",
    slug: "vice-neon-garage",
    titleEn: "Vice Customs Neon Garage",
    titleZh: "霓虹改装工坊 · 肌肉猛兽",
    regionEn: "Vice City Downtown",
    regionZh: "罪恶城中心",
    category: "supercars",
    categoryEn: "Vehicles & Garage",
    categoryZh: "载具与车库",
    descriptionEn:
      "Dark underground tuning bay lit by magenta and Miami cyan LED bars reflecting off a widebody classic muscle car and wet concrete—built for OLED lock screens.",
    descriptionZh:
      "地下改装车库内粉青双色霓虹灯管倾泻在宽体美式肌肉车漆面与反光水泥地面，暗黑赛博质感拉满。",
    imageSrc: "/wallpapers/vice-neon-garage.jpg",
    downloadName: "GTA8-Vice-Customs-Garage-9x16.jpg",
    palette: ["#FF2E93", "#00E5FF", "#0D0F14"],
    aspectRatio: "9:16 Mobile HD",
    tagsEn: ["Muscle Car", "Garage", "Neon LED", "OLED Dark"],
    tagsZh: ["肌肉车", "改装车厂", "霓虹灯管"],
  },
];
