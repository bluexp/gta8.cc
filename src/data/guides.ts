import type { GuideArticle } from "@/types/gta";

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: "leonida-heist-optimal-crew",
    titleZh: "花园银行旗舰金库最优分工与零警报潜行路线",
    titleEn: "Maze Bank Vice Vault: Optimal Crew & Silent Route",
    category: "抢劫攻略",
    readMinutes: 6,
    updatedAt: "2026-11-26",
    summary:
      "详解双主角配合下如何压低黑客与车手抽成至 11% 以内，避开红外感应并利用跨海快艇零通缉撤离。",
    highlights: [
      "优先解锁盖尔霍恩汽车旅馆 WAiNK 点位，可将黑市黑客抽成从 9% 降至 5%。",
      "撤离载具推荐选择港口改装的海洋雀直升机或湿地气垫船，直接甩开路面警车拦截。",
      "使用便携式 EMP 脉冲发射器瘫痪外围装甲车，避免枪战导致战利品现金袋被打损。",
    ],
    sections: [
      {
        heading: "一、前置踩点必查 3 处关键节点",
        body: "进入金库前务必使用相机拍下北侧空调通风口、地下变电箱与金库值班表。解锁通风口路线后可跳过大厅交火，节省超过 45 秒的室内停留时间。",
      },
      {
        heading: "二、收益最大化分红策略",
        body: "枪手建议选择低抽成（5%）但自带 EMP 脉冲的组合，因为潜行路线几乎不触发正面交火；预算重点投入在 7% 以上的高阶黑客以多争取 35 秒金库搬运时间。",
      },
    ],
  },
  {
    slug: "vice-city-anti-theft-system",
    titleZh: "载具防盗等级（1–5 级）机制与信号干扰器获取指南",
    titleEn: "Vehicle Anti-Theft Tier 1-5 & Signal Jammer Guide",
    category: "机制解析",
    readMinutes: 4,
    updatedAt: "2026-11-26",
    summary:
      "为什么在罪恶海滩直接砸窗偷超跑会瞬间 3 星并锁死引擎？一篇看懂防盗等级与零元购破解流程。",
    highlights: [
      "1–2 级（老旧肌肉车/皮卡）：传统破窗接线即可开走。",
      "3–4 级（现代跑车/猎豹经典版）：需使用钥匙中继器或信号干扰器，否则 15 秒后远程锁死。",
      "5 级（顶级超跑如女妖 GTS）：必须先到霓虹改装工坊刷写 VIN 识别码，方可存入个人车库。",
    ],
    sections: [
      {
        heading: "如何快速入手电子干扰器？",
        body: "前往罪恶城集装箱港区黑市军火车（坐标 X 420, Y -180），花费 \$12,000 即可常驻装备在快捷轮盘中。",
      },
    ],
  },
  {
    slug: "leonida-story-branches",
    titleZh: "双主角信任度系统与关键剧情分支剧透预警",
    titleEn: "Dual-Protagonist Trust System & Story Branches",
    category: "剧情分支",
    readMinutes: 5,
    updatedAt: "2026-11-26",
    summary:
      "梳理主线中影响双主角“默契/信任值”的核心对话与分赃选项，避免错过真结局与隐藏安全屋。",
    highlights: [
      "每次小型抢劫后公平分配战利品将稳步提升默契度，解锁双人合击慢动作技能。",
      "第三章港口对峙选择“掩护撤离”而非“独吞货箱”是解锁全员存活真结局的前置条件。",
    ],
    sections: [
      {
        heading: "分支点速查建议",
        body: "强烈建议在进入大型劫案决策界面前手动保存独立存档槽，并在本站 100% 清单中记录已完成分支。",
      },
    ],
  },
  {
    slug: "vice-city-classic-easter-eggs",
    titleZh: "致敬《罪恶都市》的 8 大霓虹彩蛋坐标汇总",
    titleEn: "8 Classic Vice City Easter Eggs in Leonida",
    category: "彩蛋揭秘",
    readMinutes: 5,
    updatedAt: "2026-11-26",
    summary:
      "从海洋景观酒店复古霓虹灯牌、海滨唱片店创刊号，到深夜电台神秘频率，带你重温 1986 迈阿密情怀。",
    highlights: [
      "海洋景观安全屋（X 1350, Y 110）大厅保留了经典的粉青双色霓虹廊柱设计。",
      "雨夜 02:00 驾车经过星光岛大桥时，车载电台会短暂收到 1986 年复古合成器波信号。",
    ],
    sections: [
      {
        heading: "探索提示",
        body: "开启大地图的“全收集品”与“霓虹杂志”图层即可沿着海滨大道一站式打卡全部经典致敬点。",
      },
    ],
  },
];
