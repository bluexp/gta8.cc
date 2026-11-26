import type { WeaponEntity } from "@/types/gta";

export const WEAPONS: WeaponEntity[] = [
  {
    id: "wp-tactical-carbine",
    slug: "tactical-carbine-mk2",
    titleZh: "战术卡宾步枪 Mk II",
    titleEn: "Tactical Carbine Mk II",
    category: "突击步枪",
    categoryEn: "Assault Rifles",
    stats: {
      damage: 78,
      fireRate: 84,
      accuracy: 88,
      range: 82,
      mobility: 76,
      clipSize: 45,
      price: 68500,
    },
    summary:
      "全能中近距主力突击步枪，后坐力曲线极其平滑，装配穿甲弹与全息瞄准镜后可轻松应对重甲特警。",
    acquisition:
      "在罪恶城集装箱港口的黑市军火车购入，或于花园银行抢劫前置任务中从武装车队缴获。",
    attachments: ["战术消音器", "全息红点镜", "45 发扩容弹匣", "垂直战术握把", "穿甲弹匣"],
    spawnMarkerIds: ["mk-srv-01"],
    contributor: "ArmoryPro",
  },
  {
    id: "wp-vice-smg",
    slug: "vice-compact-smg",
    titleZh: "罪恶紧凑冲锋枪",
    titleEn: "Vice Compact SMG",
    category: "冲锋枪",
    categoryEn: "SMGs",
    stats: {
      damage: 58,
      fireRate: 94,
      accuracy: 70,
      range: 54,
      mobility: 95,
      clipSize: 36,
      price: 24500,
    },
    summary:
      "支持驾驶位单手射击的高射速冲锋枪，车战追逐与室内近距离清房的绝对王者。",
    acquisition:
      "可在盖尔霍恩港废弃船坞地下枪械库免费拾取原型，或在全图 Ammu-Nation 购入。",
    attachments: ["快速弹匣", "激光指示器", "轻量消音管", "霓虹涂装"],
    spawnMarkerIds: ["mk-srv-05"],
    contributor: "ArmoryPro",
  },
  {
    id: "wp-heavy-sniper",
    slug: "heavy-precision-sniper",
    titleZh: "重型反器材狙击枪",
    titleEn: "Heavy Precision Sniper",
    category: "狙击枪",
    categoryEn: "Sniper Rifles",
    stats: {
      damage: 98,
      fireRate: 28,
      accuracy: 97,
      range: 99,
      mobility: 46,
      clipSize: 6,
      price: 115000,
    },
    summary:
      "大口径栓动反器材步枪，装配爆炸弹或穿甲弹可直接击毁直升机尾桨与运钞车引擎。",
    acquisition:
      "卡拉加林场黑市军火车限量供应，需声望等级达到 15 级或在抢劫准备中解锁。",
    attachments: ["热成像倍镜", "重型制退器", "穿甲弹", "加长精密枪管"],
    spawnMarkerIds: ["mk-srv-02"],
    contributor: "ArmoryPro",
  },
  {
    id: "wp-neon-pistol",
    slug: "vice-9mm-tactical",
    titleZh: "罪恶 9mm 战术手枪",
    titleEn: "Vice 9mm Tactical Pistol",
    category: "手枪",
    categoryEn: "Handguns",
    stats: {
      damage: 54,
      fireRate: 72,
      accuracy: 83,
      range: 58,
      mobility: 98,
      clipSize: 18,
      price: 9800,
    },
    summary:
      "潜行任务标配微声手枪，爆头判定精准且拔枪速度全武器最快，适合零警报清理摄像头与守卫。",
    acquisition:
      "完成序章后自动解锁于安全屋武器柜，全图枪店均可加装消音器与手电。",
    attachments: ["微声消音器", "战术手电", "18 发加长弹匣", "镀铬霓虹滑套"],
    spawnMarkerIds: ["mk-srv-03"],
    contributor: "GTA8编辑部",
  },
  {
    id: "wp-swamp-shotgun",
    slug: "sweeper-tactical-shotgun",
    titleZh: "清道夫战术连喷",
    titleEn: "Sweeper Tactical Shotgun",
    category: "霰弹枪",
    categoryEn: "Shotguns",
    stats: {
      damage: 92,
      fireRate: 64,
      accuracy: 48,
      range: 36,
      mobility: 74,
      clipSize: 12,
      price: 42000,
    },
    summary:
      "半自动 12 发弹鼓霰弹枪，近距离毁灭性压制力，对付狭窄走廊特警和野生猛兽极其可靠。",
    acquisition:
      "集装箱港区黑市军火车购入，或于沼泽湿地走私据点清理后拾取。",
    attachments: ["12 发弹鼓", "龙息弹药", "战术手电", "收束枪口"],
    spawnMarkerIds: ["mk-srv-01"],
    contributor: "SwampRunner",
  },
  {
    id: "wp-compact-launcher",
    slug: "compact-emp-launcher",
    titleZh: "便携式 EMP 脉冲发射器",
    titleEn: "Compact EMP Launcher",
    category: "重武器",
    categoryEn: "Heavy Weapons",
    stats: {
      damage: 45,
      fireRate: 30,
      accuracy: 78,
      range: 70,
      mobility: 68,
      clipSize: 1,
      price: 165000,
    },
    summary:
      "命中载具后使其电子系统瘫痪 8 秒而不引爆目标，拦截运钞车与无伤劫取 5 级防盗超跑的神器。",
    acquisition:
      "完成运钞车伏击支线后于黑市军火车常驻上架。",
    attachments: ["快速装填弹带", "数字测距瞄具"],
    spawnMarkerIds: ["mk-heist-03", "mk-srv-01"],
    contributor: "HeistMaster",
  },
];

export function getWeaponBySlug(slug: string): WeaponEntity | undefined {
  return WEAPONS.find((w) => w.slug === slug);
}
