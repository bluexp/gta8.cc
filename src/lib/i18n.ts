import type {
  ChecklistItem,
  CheatCode,
  VehicleEntity,
  WeaponEntity,
} from "@/types/gta";
import type { Locale } from "@/store/useLocaleStore";

export const VEHICLE_CAT_EN: Record<VehicleEntity["category"], string> = {
  超级跑车: "Super",
  经典跑车: "Sports Classics",
  肌肉车: "Muscle",
  摩托车: "Motorcycles",
  越野车: "Off-Road",
  船艇: "Boats",
  航空器: "Helicopters",
};

export const WEAPON_CAT_EN: Record<WeaponEntity["category"], string> = {
  突击步枪: "Assault Rifles",
  冲锋枪: "SMGs",
  手枪: "Handguns",
  霰弹枪: "Shotguns",
  狙击枪: "Sniper Rifles",
  重武器: "Heavy Weapons",
  近战: "Melee",
};

export const CHEAT_CAT_EN: Record<CheatCode["category"], string> = {
  角色状态: "Player",
  通缉与战斗: "Wanted & Combat",
  载具生成: "Spawn Vehicles",
  世界效果: "World Effects",
};

export const CHECKLIST_SEC_EN: Record<ChecklistItem["section"], string> = {
  主线剧情: "Main Story",
  全收集品: "Collectibles",
  特技与挑战: "Stunts & Challenges",
  载具与武器: "Vehicles & Weapons",
  奖杯成就: "Trophies",
};

export function pickText(locale: Locale, en: string, zh: string): string {
  return locale === "en" ? en : zh;
}

export function formatMarkerTitle(
  locale: Locale,
  m: { titleEn: string; titleZh: string }
): string {
  return locale === "en" ? m.titleEn : m.titleZh;
}

export function formatMarkerSubTitle(
  locale: Locale,
  m: { titleEn: string; titleZh: string }
): string {
  return locale === "en" ? m.titleZh : m.titleEn;
}
