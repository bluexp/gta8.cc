/* Offline dataset for GTA8 Xiaohongshu Mini-Tool (ES2017 compatible) */
window.GTA8_DATA = {
  categories: [
    { id: "all", label: "全部点位", color: "#00E5FF" },
    { id: "collectible", label: "全收集品", color: "#FF2E93", code: "CL" },
    { id: "vehicle", label: "载具刷新", color: "#00E5FF", code: "VH" },
    { id: "heist", label: "抢劫收益", color: "#FFB800", code: "HS" },
    { id: "service", label: "军火据点", color: "#A855F7", code: "SV" },
    { id: "wildlife", label: "生态动物", color: "#22C55E", code: "WL" }
  ],
  markers: [
    { id: "mk-waink-01", category: "collectible", region: "罪恶海滩", title: "WAiNK 扫描点 #01 · 海景酒店天台", en: "Ocean View Rooftop", x: 1320, y: 260, desc: "罪恶海滩东侧粉色霓虹酒店三楼露台，从后巷消防梯爬上扫码得涂鸦与 $2,500。" },
    { id: "mk-waink-02", category: "collectible", region: "雷奥奈达群岛", title: "WAiNK 扫描点 #02 · 跨海断桥观景台", en: "Keys Causeway Overlook", x: 1240, y: -850, desc: "跨海大桥南侧废弃渔人栈道尽头，傍晚 18:00 后霓虹牌亮起最易辨认。" },
    { id: "mk-waink-03", category: "collectible", region: "盖尔霍恩港", title: "WAiNK 扫描点 #03 · 港口汽车旅馆", en: "Port Gellhorn Motel", x: -1020, y: 620, desc: "27 号公路旁汽车旅馆二楼走廊转角，扫描解锁当地黑市折扣。" },
    { id: "mk-stunt-01", category: "collectible", region: "罪恶城中心", title: "特技飞跃 #01 · 星光岛游艇跳台", en: "Starfish Marina Ramp", x: 980, y: 90, desc: "码头装卸板飞越主航道，建议时速 220 km/h 以上超跑助跑。" },
    { id: "mk-stunt-02", category: "collectible", region: "雷奥奈达群岛", title: "特技飞跃 #02 · 跨海高速断桥", en: "Keys Broken Span", x: 680, y: -1160, desc: "旧桥坍塌段跳板，西向东满油助跑 300 米飞越 65 米海沟。" },
    { id: "mk-pkg-01", category: "collectible", region: "雷奥奈达群岛", title: "隐藏包裹 #01 · 沉船礁防水箱", en: "Sunken Reef Case", x: 340, y: -1380, desc: "水下 12 米沉船尾舱内，拾取获得 $15,000 现金并计入 100%。" },
    { id: "mk-mag-01", category: "collectible", region: "罪恶海滩", title: "霓虹杂志 #01 · 罪恶之夜创刊号", en: "Vice Nights Issue #1", x: 1385, y: -40, desc: "海滨步道复古唱片店报刊架上，集齐解锁安全屋复古霓虹海报。" },
    { id: "mk-veh-01", category: "vehicle", region: "罪恶海滩", title: "古罗帝 猎豹经典版 · 固定刷新点", en: "Grotti Cheetah Classic", x: 1290, y: 440, desc: "海滨俱乐部代客泊车区夜间高频刷新，4 级防盗建议带信号干扰器。" },
    { id: "mk-veh-02", category: "vehicle", region: "罪恶城中心", title: "冒险家 女妖 GTS · 展厅外坪", en: "Bravado Banshee GTS", x: 720, y: 210, desc: "金融区玻璃超跑展厅北侧贵宾车位，全图 T0 极速梯队超跑。" },
    { id: "mk-veh-03", category: "vehicle", region: "盖尔霍恩港", title: "绝致 郁金香 M-100 · 港口修配厂", en: "Declasse Tulip M-100", x: -880, y: 490, desc: "港口南侧修理厂门口固定刷新，仅 2 级防盗，前期开荒易得。" },
    { id: "mk-veh-04", category: "vehicle", region: "沼泽湿地", title: "湿地风暴气垫船 · 沼泽码头", en: "Everglade Fanboat", x: -540, y: -520, desc: "浅水草滩与泥地高速穿行，探索沼泽湿地全收集必备。" },
    { id: "mk-veh-05", category: "vehicle", region: "雷奥奈达群岛", title: "海洋雀直升机 · 水上机场", en: "Sea Sparrow", x: 960, y: -1020, desc: "水上机场浮筒停机坪常驻刷新，可在海面直接起降。" },
    { id: "mk-heist-01", category: "heist", region: "罪恶城中心", title: "花园银行旗舰金库", en: "Maze Bank Vice Vault", x: 610, y: 85, desc: "双主角大型劫案目标，完美潜行原始战利品超 $2,400,000。" },
    { id: "mk-heist-02", category: "heist", region: "盖尔霍恩港", title: "盖尔霍恩高价当铺", en: "Uncle Jack's Pawn", x: -1120, y: 380, desc: "支持珠宝名表销赃，并可触发快闪抢劫事件。" },
    { id: "mk-heist-03", category: "heist", region: "罪恶海滩", title: "运钞车巡逻路段 · 跨海高速", en: "Armored Convoy Route", x: 1090, y: -310, desc: "每日 09:00–16:00 高频巡逻，粘性炸弹破门夺取现金袋。" },
    { id: "mk-srv-01", category: "service", region: "罪恶城中心", title: "黑市军火车 · 集装箱港区", en: "Gun Van · Container Yard", x: 420, y: -180, desc: "每日轮换黑市军火商，可购战术卡宾 Mk II 与全套消音配件。" },
    { id: "mk-srv-03", category: "service", region: "罪恶海滩", title: "海洋景观安全屋（4车位）", en: "Ocean View Safehouse", x: 1350, y: 110, desc: "支持 4 车位存放、衣柜换装、武器柜与快速存档。" },
    { id: "mk-srv-04", category: "service", region: "罪恶城中心", title: "霓虹改装工坊", en: "Vice Customs", x: 810, y: 410, desc: "提供涡轮、低趴悬挂、底盘霓虹与防弹轮胎改装并可消星。" },
    { id: "mk-wild-01", category: "wildlife", region: "沼泽湿地", title: "巨型白化短吻鳄栖息滩", en: "Albino Swamp Alligator", x: -920, y: -860, desc: "雨天与黎明刷新率最高，拍生态照完成野生图鉴奖杯。" },
    { id: "mk-wild-02", category: "wildlife", region: "雷奥奈达群岛", title: "霓虹粉火烈鸟浅滩", en: "Flamingo Lagoon", x: 1120, y: -1220, desc: "日落黄金时段大批火烈鸟聚集，绝佳拍照打卡地。" },
    { id: "mk-wild-03", category: "wildlife", region: "卡拉加山脉", title: "雷奥奈达黑豹林区", en: "Leonida Panther Ridge", x: 560, y: 1410, desc: "夜间高危掠食动物，建议携高倍镜在高地远距拍摄。" }
  ],
  cheats: [
    { id: "c1", cat: "角色状态", title: "5 分钟无敌模式", en: "5-Minute Invincibility", effect: "免疫子弹、爆炸与坠落伤害，持续 5 分钟。", ps5: ["→","×","→","←","→","R1","→","←","×","△"], xbox: ["→","A","→","←","→","RB","→","←","A","Y"], phone: "1-999-724-654-5537" },
    { id: "c2", cat: "角色状态", title: "满生命值与满护甲", en: "Max Health & Armor", effect: "补满血量与护甲，同时修复当前驾驶载具。", ps5: ["○","L1","△","R2","×","□","○","→","□","L1","L1","L1"], xbox: ["B","LB","Y","RT","A","X","B","→","X","LB","LB","LB"], phone: "1-999-887-853" },
    { id: "c3", cat: "通缉战斗", title: "降低通缉等级 (-1 星)", en: "Lower Wanted Level", effect: "立即消除 1 颗警星，连续输入可完全清星。", ps5: ["R1","R1","○","R2","→","←","→","←","→","←"], xbox: ["RB","RB","B","RT","→","←","→","←","→","←"], phone: "1-999-529-937-87" },
    { id: "c4", cat: "通缉战斗", title: "全套武器与弹药", en: "Give All Weapons", effect: "获得全系列主流武器并补满弹药。", ps5: ["△","R2","←","L1","×","→","△","↓","□","L1","L1","L1"], xbox: ["Y","RT","←","LB","A","→","Y","↓","X","LB","LB","LB"], phone: "1-999-866-587" },
    { id: "c5", cat: "载具生成", title: "生成双门超级跑车", en: "Spawn Supercar", effect: "在角色前方空地空投满改超跑。", ps5: ["R1","○","R2","→","L1","L2","×","×","□","R1"], xbox: ["RB","B","RT","→","LB","LT","A","A","X","RB"], phone: "1-999-266-38" },
    { id: "c6", cat: "载具生成", title: "生成轻型武装直升机", en: "Spawn Attack Chopper", effect: "生成双座轻型直升机，快速跨区探索全图。", ps5: ["○","○","L1","○","○","○","L1","L2","R1","△","○","△"], xbox: ["B","B","LB","B","B","B","LB","LT","RB","Y","B","Y"], phone: "1-999-289-9633" },
    { id: "c7", cat: "世界效果", title: "切换动态天气", en: "Cycle Weather", effect: "循环切换晴天、霓虹雨夜、海雾与飓风。", ps5: ["R2","×","L1","L1","L2","L2","L2","□"], xbox: ["RT","A","LB","LB","LT","LT","LT","X"], phone: "1-999-625-348-7246" },
    { id: "c8", cat: "世界效果", title: "低重力月球模式", en: "Moon Gravity", effect: "大幅降低重力，特技飞跃滞空翻倍。", ps5: ["←","←","L1","R1","L1","→","←","L1","←"], xbox: ["←","←","LB","RB","LB","→","←","LB","←"], phone: "1-999-356-2837" }
  ],
  vehicles: [
    { id: "v1", title: "古罗帝 猎豹经典版", en: "Grotti Cheetah Classic", cat: "经典跑车", kmh: 254, speed: 93, handling: 86, antiTheft: 4, price: "$865,000", tip: "罪恶海滩俱乐部夜间刷新，4 级防盗需信号干扰器。" },
    { id: "v2", title: "冒险家 女妖 GTS", en: "Bravado Banshee GTS", cat: "超级跑车", kmh: 278, speed: 98, handling: 89, antiTheft: 5, price: "$1,450,000", tip: "金融区展厅刷新，全图 T0 极速梯队。" },
    { id: "v3", title: "绝致 郁金香 M-100", en: "Declasse Tulip M-100", cat: "肌肉车", kmh: 214, speed: 79, handling: 74, antiTheft: 2, price: "$145,000", tip: "盖尔霍恩港修配厂常驻，2 级防盗开局必拿。" },
    { id: "v4", title: "湿地风暴 气垫船", en: "Everglade Fanboat", cat: "船艇", kmh: 148, speed: 76, handling: 80, antiTheft: 1, price: "$92,000", tip: "沼泽湿地东南码头免费刷新，无视浅滩草丛。" },
    { id: "v5", title: "海洋雀 水陆直升机", en: "Sea Sparrow", cat: "航空器", kmh: 242, speed: 88, handling: 92, antiTheft: 3, price: "$1,815,000", tip: "群岛水上机场常驻，海面起降跑图神器。" },
    { id: "v6", title: "长崎 忍者霓虹版", en: "Nagasaki Shinobi Neon", cat: "摩托车", kmh: 268, speed: 95, handling: 94, antiTheft: 4, price: "$680,000", tip: "加速 97 顶尖，完成特技飞跃最佳拍档。" }
  ],
  weapons: [
    { id: "w1", title: "战术卡宾步枪 Mk II", en: "Tactical Carbine Mk II", cat: "突击步枪", dmg: 78, rof: 84, acc: 88, price: "$68,500", tip: "集装箱港区黑市军火车购入，推荐穿甲弹 + 全息镜。" },
    { id: "w2", title: "罪恶紧凑冲锋枪", en: "Vice Compact SMG", cat: "冲锋枪", dmg: 58, rof: 94, acc: 70, price: "$24,500", tip: "驾驶位单手射击王者，港口船坞可免费拾取原型。" },
    { id: "w3", title: "重型反器材狙击枪", en: "Heavy Precision Sniper", cat: "狙击枪", dmg: 98, rof: 28, acc: 97, price: "$115,000", tip: "卡拉加林场军火车供应，可一枪瘫痪直升机尾桨。" },
    { id: "w4", title: "清道夫战术连喷", en: "Sweeper Tactical Shotgun", cat: "霰弹枪", dmg: 92, rof: 64, acc: 48, price: "$42,000", tip: "12 发弹鼓近战清房神器，可装龙息弹。" },
    { id: "w5", title: "便携式 EMP 脉冲发射器", en: "Compact EMP Launcher", cat: "重武器", dmg: 45, rof: 30, acc: 78, price: "$165,000", tip: "瘫痪载具电子系统 8 秒，拦运钞车零损耗必备。" }
  ],
  checklist: [
    { id: "chk-1", title: "完成序章：罪恶海滩霓虹夜", weight: 15, markerId: null },
    { id: "chk-2", title: "完成花园银行旗舰金库劫案", weight: 20, markerId: "mk-heist-01" },
    { id: "chk-3", title: "WAiNK 扫描点 #01 · 海景酒店天台", weight: 10, markerId: "mk-waink-01" },
    { id: "chk-4", title: "WAiNK 扫描点 #02 · 跨海断桥观景台", weight: 10, markerId: "mk-waink-02" },
    { id: "chk-5", title: "特技飞跃 #01 · 星光岛游艇跳台", weight: 10, markerId: "mk-stunt-01" },
    { id: "chk-6", title: "沉船礁水下隐藏包裹 #01", weight: 10, markerId: "mk-pkg-01" },
    { id: "chk-7", title: "入手古罗帝 猎豹经典版", weight: 10, markerId: "mk-veh-01" },
    { id: "chk-8", title: "拍摄沼泽巨型白化短吻鳄生态照", weight: 15, markerId: "mk-wild-01" }
  ],
  wallpapers: [
    { id: "wp1", title: "罪恶海滩 · 霓虹日落", en: "Vice Beach Neon Sunset", region: "罪恶海滩 · 9:16 高清", src: "./assets/vice-beach-sunset.jpg" },
    { id: "wp2", title: "沼泽湿地 · 暮色气垫船", en: "Grassrivers Twilight Bayou", region: "沼泽湿地 · 9:16 高清", src: "./assets/grassrivers-airboat.jpg" },
    { id: "wp3", title: "霓虹改装工坊 · 肌肉猛兽", en: "Vice Customs Neon Garage", region: "罪恶城中心 · 9:16 OLED", src: "./assets/vice-neon-garage.jpg" }
  ]
};
