/* GTA8 Xiaohongshu Mini-Tool — ES2017 strict, CSP-safe, zero external network */
(function () {
  "use strict";

  var DATA = window.GTA8_DATA;
  var STORAGE_KEY = "gta8_xhs_progress_v1";

  var state = {
    tab: "map",
    basemap: "satellite",
    mapCategory: "all",
    hideCollected: false,
    selectedMarkerId: null,
    completedMarkers: [],
    completedChecklist: [],
    cheatPlatform: "ps5",
    cheatCat: "全部",
    wikiSub: "vehicles",
    wikiQuery: "",
    heistGross: 2650000,
    heistCrew: 16,
    heistFence: 5,
    heistPlayers: 2,
    heistLeader: 55,
    previewWp: null,
    showClock: true,
    // Map camera
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    dragMoved: false
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function hasMiniToolSdk() {
    return Boolean(window.xhs && window.xhs.miniTool);
  }

  function showToast(msg) {
    var el = byId("toast");
    el.textContent = msg;
    el.classList.remove("is-hidden");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      el.classList.add("is-hidden");
    }, 2200);
  }

  /* Safe area & capsule avoidance (XHS client 9.49+ / 9.55+) */
  function applySafeArea() {
    if (!hasMiniToolSdk() || typeof window.xhs.miniTool.getWindowInfo !== "function") {
      return;
    }
    try {
      Promise.resolve(window.xhs.miniTool.getWindowInfo()).then(function (info) {
        if (!info) return;
        var safeTop = info.safeArea && typeof info.safeArea.top === "number" ? info.safeArea.top : 0;
        var capsuleBottom = 0;
        if (info.menuButtons && info.menuButtons.capsule && typeof info.menuButtons.capsule.bottom === "number") {
          capsuleBottom = info.menuButtons.capsule.bottom;
        }
        var topPad = Math.max(safeTop, capsuleBottom);
        if (topPad > 0) {
          byId("topHeader").style.paddingTop = (topPad + 8) + "px";
        }
        if (info.safeArea && typeof info.safeArea.bottom === "number" && info.safeArea.bottom > 0) {
          byId("bottomNav").style.paddingBottom = (info.safeArea.bottom + 6) + "px";
        }
      }).catch(function () {});
    } catch (e) {}
  }

  /* Persistence strictly via XHS Storage API when inside XHS container */
  function loadProgress() {
    if (!hasMiniToolSdk() || typeof window.xhs.miniTool.getStorage !== "function") {
      return Promise.resolve();
    }
    return Promise.resolve(window.xhs.miniTool.getStorage({ key: STORAGE_KEY }))
      .then(function (res) {
        if (!res || res.data === null || res.data === "" || typeof res.data !== "string") {
          return;
        }
        try {
          var parsed = JSON.parse(res.data);
          if (Array.isArray(parsed.completedMarkers)) {
            state.completedMarkers = parsed.completedMarkers;
          }
          if (Array.isArray(parsed.completedChecklist)) {
            state.completedChecklist = parsed.completedChecklist;
          }
        } catch (err) {}
      })
      .catch(function () {});
  }

  function saveProgress() {
    updateHeaderProgress();
    if (!hasMiniToolSdk() || typeof window.xhs.miniTool.setStorage !== "function") {
      return;
    }
    try {
      var payload = JSON.stringify({
        completedMarkers: state.completedMarkers,
        completedChecklist: state.completedChecklist
      });
      Promise.resolve(
        window.xhs.miniTool.setStorage({ key: STORAGE_KEY, data: payload })
      ).catch(function () {});
    } catch (e) {}
  }

  function updateHeaderProgress() {
    var done = state.completedMarkers.length;
    var total = DATA.markers.length;
    var pct = total > 0 ? Math.round((done / total) * 100) : 0;
    byId("progressSummary").textContent = "已打卡 " + done + "/" + total + " (" + pct + "%) · 离线极速版";
  }

  function isMarkerDone(id) {
    return state.completedMarkers.indexOf(id) !== -1;
  }

  function toggleMarkerDone(id) {
    var idx = state.completedMarkers.indexOf(id);
    if (idx !== -1) {
      state.completedMarkers.splice(idx, 1);
    } else {
      state.completedMarkers.push(id);
    }
    saveProgress();
    renderMapCategories();
    drawMap();
    if (state.selectedMarkerId === id) {
      openMarkerCard(id);
    }
    if (state.tab === "wiki" && state.wikiSub === "checklist") {
      renderWiki();
    }
  }

  /* ===================== MAP CANVAS ENGINE ===================== */
  var canvas = byId("leonidaCanvas");
  var ctx = canvas.getContext("2d");

  function worldToScreen(wx, wy, w, h) {
    var baseScale = Math.min(w, h) / 3600;
    var s = baseScale * state.scale;
    var cx = w / 2 + state.offsetX;
    var cy = h / 2 + state.offsetY;
    return {
      x: cx + wx * s,
      y: cy - wy * s
    };
  }

  function getFilteredMarkers() {
    return DATA.markers.filter(function (m) {
      if (state.mapCategory !== "all" && m.category !== state.mapCategory) {
        return false;
      }
      if (state.hideCollected && isMarkerDone(m.id)) {
        return false;
      }
      return true;
    });
  }

  function getCatColor(catId) {
    for (var i = 0; i < DATA.categories.length; i++) {
      if (DATA.categories[i].id === catId) {
        return DATA.categories[i].color;
      }
    }
    return "#FF2E93";
  }

  function getCatCode(catId) {
    for (var i = 0; i < DATA.categories.length; i++) {
      if (DATA.categories[i].id === catId) {
        return DATA.categories[i].code || "•";
      }
    }
    return "•";
  }

  function resizeCanvas() {
    var stage = byId("mapStage");
    var rect = stage.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawMap();
  }

  function drawPoly(points, w, h) {
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
      var p = worldToScreen(points[i][0], points[i][1], w, h);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
  }

  function drawPolyline(points, w, h) {
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
      var p = worldToScreen(points[i][0], points[i][1], w, h);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
  }

  function drawMap() {
    var rect = byId("mapStage").getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    if (w <= 0 || h <= 0) return;

    var isSat = state.basemap === "satellite";
    ctx.fillStyle = isSat ? "#071322" : "#070A12";
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = isSat ? "rgba(255,255,255,0.04)" : "rgba(0,229,255,0.08)";
    ctx.lineWidth = 1;
    for (var g = -1600; g <= 1600; g += 400) {
      var v1 = worldToScreen(g, -2000, w, h);
      var v2 = worldToScreen(g, 2000, w, h);
      ctx.beginPath();
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v2.x, v2.y);
      ctx.stroke();

      var h1 = worldToScreen(-2000, g, w, h);
      var h2 = worldToScreen(2000, g, w, h);
      ctx.beginPath();
      ctx.moveTo(h1.x, h1.y);
      ctx.lineTo(h2.x, h2.y);
      ctx.stroke();
    }

    // Leonida mainland polygon
    var mainland = [
      [-1350, 1280], [-400, 1680], [900, 1520], [1160, 880], [1100, -280],
      [650, -760], [-250, -980], [-1250, -960], [-1420, -260], [-1360, 620]
    ];
    drawPoly(mainland, w, h);
    ctx.fillStyle = isSat ? "#1A2625" : "#121725";
    ctx.fill();
    ctx.strokeStyle = isSat ? "#2D5259" : "rgba(0,229,255,0.45)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Grassrivers wetlands
    drawPoly([[-1240, -280], [-220, -320], [-260, -920], [-1180, -880]], w, h);
    ctx.fillStyle = isSat ? "#122B22" : "#0F1E1E";
    ctx.fill();

    // Vice Beach barrier island
    drawPoly([[1220, 680], [1460, 600], [1480, -360], [1220, -400]], w, h);
    ctx.fillStyle = isSat ? "#3A352A" : "#1C2133";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,46,147,0.65)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Leonida Keys islands
    var keys = [
      [1220, -850, 120, 48],
      [960, -1020, 130, 46],
      [680, -1160, 125, 44],
      [340, -1380, 115, 42]
    ];
    for (var k = 0; k < keys.length; k++) {
      var kp = worldToScreen(keys[k][0], keys[k][1], w, h);
      var kr = (Math.min(w, h) / 3600) * state.scale;
      ctx.beginPath();
      ctx.ellipse(kp.x, kp.y, keys[k][2] * kr, keys[k][3] * kr, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = isSat ? "#1E2D2C" : "#141B2B";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,229,255,0.5)";
      ctx.stroke();
    }

    // Neon highways
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(2, 2.2 * Math.sqrt(state.scale));
    drawPolyline([[240, 1520], [720, 680], [820, -200], [1240, -850], [960, -1020], [680, -1160], [340, -1380]], w, h);
    ctx.strokeStyle = "rgba(255,46,147,0.78)";
    ctx.stroke();

    drawPolyline([[-1080, 520], [100, 720], [760, 220], [1340, 220]], w, h);
    ctx.strokeStyle = "rgba(0,229,255,0.72)";
    ctx.stroke();

    // District labels
    var labels = [
      { text: "罪恶海滩", x: 1350, y: 120, color: "#FF2E93" },
      { text: "罪恶城中心", x: 640, y: 240, color: "#00E5FF" },
      { text: "雷奥奈达群岛", x: 780, y: -1260, color: "#00E5FF" },
      { text: "沼泽湿地", x: -760, y: -640, color: "#4ADE80" },
      { text: "盖尔霍恩港", x: -960, y: 580, color: "#FFB800" },
      { text: "卡拉加山脉", x: 240, y: 1420, color: "#CBD5E1" }
    ];
    ctx.textAlign = "center";
    ctx.font = "700 11px sans-serif";
    for (var l = 0; l < labels.length; l++) {
      var lp = worldToScreen(labels[l].x, labels[l].y, w, h);
      ctx.fillStyle = labels[l].color;
      ctx.fillText(labels[l].text, lp.x, lp.y);
    }

    // Markers
    var list = getFilteredMarkers();
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      var pt = worldToScreen(m.x, m.y, w, h);
      var color = getCatColor(m.category);
      var done = isMarkerDone(m.id);
      var sel = state.selectedMarkerId === m.id;
      var radius = sel ? 14 : 11;

      ctx.save();
      ctx.globalAlpha = done ? 0.35 : 1;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = sel ? color : "#161922";
      ctx.fill();
      ctx.lineWidth = sel ? 2.5 : 2;
      ctx.strokeStyle = sel ? "#FFFFFF" : color;
      ctx.stroke();

      ctx.fillStyle = sel ? "#0D0F14" : color;
      ctx.font = "900 9px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(done ? "✓" : getCatCode(m.category), pt.x, pt.y + 0.5);
      ctx.restore();
    }
  }

  function handleMapTap(clientX, clientY) {
    var rect = byId("mapStage").getBoundingClientRect();
    var tx = clientX - rect.left;
    var ty = clientY - rect.top;
    var list = getFilteredMarkers();
    var best = null;
    var bestDist = 26;

    for (var i = 0; i < list.length; i++) {
      var pt = worldToScreen(list[i].x, list[i].y, rect.width, rect.height);
      var d = Math.hypot(pt.x - tx, pt.y - ty);
      if (d < bestDist) {
        bestDist = d;
        best = list[i];
      }
    }

    if (best) {
      openMarkerCard(best.id);
    }
  }

  function openMarkerCard(markerId) {
    var found = null;
    for (var i = 0; i < DATA.markers.length; i++) {
      if (DATA.markers[i].id === markerId) {
        found = DATA.markers[i];
        break;
      }
    }
    if (!found) return;
    state.selectedMarkerId = found.id;
    var done = isMarkerDone(found.id);

    byId("markerBadges").innerHTML =
      '<span class="badge">' + found.region + '</span>' +
      '<span class="badge badge-cyan">X ' + found.x + ' · Y ' + found.y + '</span>';
    byId("markerTitle").textContent = found.title;
    byId("markerSub").textContent = found.en;
    byId("markerDesc").textContent = found.desc;

    var btn = byId("toggleMarkerDoneBtn");
    btn.textContent = done ? "已标记为收集（点击取消）" : "标记为已收集（图标降噪）";
    if (done) btn.classList.add("is-done");
    else btn.classList.remove("is-done");

    byId("markerCard").classList.remove("is-hidden");
    byId("mapCoordsHud").textContent = found.region + " · X " + found.x + ", Y " + found.y;
    drawMap();
  }

  function renderMapCategories() {
    var bar = byId("mapCatBar");
    bar.innerHTML = "";
    for (var i = 0; i < DATA.categories.length; i++) {
      (function (cat) {
        var total = 0;
        var done = 0;
        for (var j = 0; j < DATA.markers.length; j++) {
          if (cat.id === "all" || DATA.markers[j].category === cat.id) {
            total++;
            if (isMarkerDone(DATA.markers[j].id)) done++;
          }
        }
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cat-pill" + (state.mapCategory === cat.id ? " is-active" : "");
        btn.textContent = cat.label + " " + done + "/" + total;
        btn.addEventListener("click", function () {
          state.mapCategory = cat.id;
          renderMapCategories();
          drawMap();
        });
        bar.appendChild(btn);
      })(DATA.categories[i]);
    }
  }

  /* ===================== CHEATS TAB ===================== */
  function keyStyle(k) {
    if (k === "△" || k === "A") return "pad-green";
    if (k === "○" || k === "B" || k === "R2" || k === "RT") return "pad-pink";
    if (k === "×" || k === "X" || k === "L2" || k === "LT") return "pad-cyan";
    if (k === "Y") return "pad-amber";
    return "";
  }

  function renderCheats() {
    var cats = ["全部", "角色状态", "通缉战斗", "载具生成", "世界效果"];
    var bar = byId("cheatCatBar");
    bar.innerHTML = "";
    for (var i = 0; i < cats.length; i++) {
      (function (c) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cat-pill" + (state.cheatCat === c ? " is-active" : "");
        btn.textContent = c;
        btn.addEventListener("click", function () {
          state.cheatCat = c;
          renderCheats();
        });
        bar.appendChild(btn);
      })(cats[i]);
    }

    var container = byId("cheatList");
    container.innerHTML = "";
    for (var j = 0; j < DATA.cheats.length; j++) {
      var item = DATA.cheats[j];
      if (state.cheatCat !== "全部" && item.cat !== state.cheatCat) continue;

      var card = document.createElement("div");
      card.className = "info-card";
      var seqHtml = "";
      if (state.cheatPlatform === "phone") {
        seqHtml = '<div class="phone-code">📞 ' + item.phone + '</div>';
      } else {
        var arr = state.cheatPlatform === "ps5" ? item.ps5 : item.xbox;
        for (var k = 0; k < arr.length; k++) {
          seqHtml += '<span class="pad-key ' + keyStyle(arr[k]) + '">' + arr[k] + "</span>";
        }
      }

      card.innerHTML =
        '<div class="card-top"><div><span class="badge">' + item.cat + '</span>' +
        '<h3 class="card-title">' + item.title + '</h3>' +
        '<div class="card-en">' + item.en + '</div></div></div>' +
        '<p class="card-text">' + item.effect + '</p>' +
        '<div class="btn-seq">' + seqHtml + "</div>";
      container.appendChild(card);
    }
  }

  /* ===================== WIKI & HEIST CALC TAB ===================== */
  function formatUsd(n) {
    return "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function renderWiki() {
    var searchWrap = byId("wikiSearchWrap");
    var container = byId("wikiContainer");
    container.innerHTML = "";

    if (state.wikiSub === "vehicles" || state.wikiSub === "weapons") {
      searchWrap.classList.remove("is-hidden");
    } else {
      searchWrap.classList.add("is-hidden");
    }

    var q = state.wikiQuery.trim().toLowerCase();

    if (state.wikiSub === "vehicles") {
      for (var i = 0; i < DATA.vehicles.length; i++) {
        var v = DATA.vehicles[i];
        if (q && v.title.toLowerCase().indexOf(q) === -1 && v.en.toLowerCase().indexOf(q) === -1) continue;
        var vCard = document.createElement("div");
        vCard.className = "info-card";
        vCard.innerHTML =
          '<div class="card-top"><div><span class="badge badge-cyan">' + v.cat + ' · 防盗 Lv.' + v.antiTheft + '</span>' +
          '<h3 class="card-title">' + v.title + '</h3><div class="card-en">' + v.en + '</div></div>' +
          '<div class="price-tag">' + v.kmh + ' km/h<br>' + v.price + '</div></div>' +
          '<div class="stat-row"><span class="stat-lbl">极速</span><div class="stat-track"><div class="stat-fill" style="width:' + v.speed + '%;background:#00E5FF"></div></div><span class="stat-val">' + v.speed + '</span></div>' +
          '<div class="stat-row"><span class="stat-lbl">操控</span><div class="stat-track"><div class="stat-fill" style="width:' + v.handling + '%;background:#FF2E93"></div></div><span class="stat-val">' + v.handling + '</span></div>' +
          '<p class="card-text">' + v.tip + '</p>';
        container.appendChild(vCard);
      }
      return;
    }

    if (state.wikiSub === "weapons") {
      for (var j = 0; j < DATA.weapons.length; j++) {
        var w = DATA.weapons[j];
        if (q && w.title.toLowerCase().indexOf(q) === -1 && w.en.toLowerCase().indexOf(q) === -1) continue;
        var wCard = document.createElement("div");
        wCard.className = "info-card";
        wCard.innerHTML =
          '<div class="card-top"><div><span class="badge">' + w.cat + '</span>' +
          '<h3 class="card-title">' + w.title + '</h3><div class="card-en">' + w.en + '</div></div>' +
          '<div class="price-tag">' + w.price + '</div></div>' +
          '<div class="stat-row"><span class="stat-lbl">伤害</span><div class="stat-track"><div class="stat-fill" style="width:' + w.dmg + '%;background:#FF2E93"></div></div><span class="stat-val">' + w.dmg + '</span></div>' +
          '<div class="stat-row"><span class="stat-lbl">射速</span><div class="stat-track"><div class="stat-fill" style="width:' + w.rof + '%;background:#00E5FF"></div></div><span class="stat-val">' + w.rof + '</span></div>' +
          '<div class="stat-row"><span class="stat-lbl">精准</span><div class="stat-track"><div class="stat-fill" style="width:' + w.acc + '%;background:#A855F7"></div></div><span class="stat-val">' + w.acc + '</span></div>' +
          '<p class="card-text">' + w.tip + '</p>';
        container.appendChild(wCard);
      }
      return;
    }

    if (state.wikiSub === "checklist") {
      var doneW = 0;
      for (var c = 0; c < DATA.checklist.length; c++) {
        var ci = DATA.checklist[c];
        var isDone = ci.markerId ? isMarkerDone(ci.markerId) : state.completedChecklist.indexOf(ci.id) !== -1;
        if (isDone) doneW += ci.weight;
      }
      var sumCard = document.createElement("div");
      sumCard.className = "info-card";
      sumCard.innerHTML =
        '<div class="card-top"><h3 class="card-title">100% 完成度总进度</h3><div class="price-tag">' + doneW + '%</div></div>' +
        '<div class="stat-row"><div class="stat-track" style="margin:6px 0 0 0;height:8px"><div class="stat-fill" style="width:' + doneW + '%;background:linear-gradient(90deg,#FF2E93,#00E5FF)"></div></div></div>';
      container.appendChild(sumCard);

      for (var k = 0; k < DATA.checklist.length; k++) {
        (function (item) {
          var checked = item.markerId ? isMarkerDone(item.markerId) : state.completedChecklist.indexOf(item.id) !== -1;
          var row = document.createElement("div");
          row.className = "info-card chk-item";

          var left = document.createElement("div");
          left.style.display = "flex";
          left.style.alignItems = "flex-start";

          var chkBtn = document.createElement("button");
          chkBtn.type = "button";
          chkBtn.className = "chk-btn" + (checked ? " is-done" : "");
          chkBtn.textContent = checked ? "✓" : "";
          chkBtn.addEventListener("click", function () {
            if (item.markerId) {
              toggleMarkerDone(item.markerId);
            } else {
              var idx = state.completedChecklist.indexOf(item.id);
              if (idx !== -1) state.completedChecklist.splice(idx, 1);
              else state.completedChecklist.push(item.id);
              saveProgress();
              renderWiki();
            }
          });

          var txt = document.createElement("div");
          txt.innerHTML =
            '<div class="card-title ' + (checked ? "chk-title-done" : "") + '">' + item.title + '</div>' +
            '<div class="card-en">' + (item.markerId ? "与大地图双向联动 · +" : "主线进度 · +") + item.weight + '%</div>';

          left.appendChild(chkBtn);
          left.appendChild(txt);
          row.appendChild(left);
          container.appendChild(row);
        })(DATA.checklist[k]);
      }
      return;
    }

    // Heist Payout Calculator
    var netPool = Math.max(
      0,
      Math.round(state.heistGross * (1 - (state.heistCrew + state.heistFence) / 100) - 45000)
    );
    var leader = state.heistPlayers === 1 ? netPool : Math.round(netPool * (state.heistLeader / 100));
    var partner = state.heistPlayers > 1 ? Math.round((netPool - leader) / (state.heistPlayers - 1)) : leader;

    var calc = document.createElement("div");
    calc.className = "info-card";
    calc.innerHTML =
      '<h3 class="card-title">雷奥奈达抢劫收益速算器</h3>' +
      '<p class="card-text" style="margin-bottom:10px">扣除 NPC 团队抽成、黑市销赃费与 $45,000 前置成本后的净收益</p>' +
      '<div class="calc-field"><div class="calc-label"><span>原始战利品总额 (USD)</span></div><input id="calcGross" class="calc-input" type="number" step="50000" value="' + state.heistGross + '"></div>' +
      '<div class="calc-field"><div class="calc-label"><span>NPC 团队抽成</span><span id="lblCrew">' + state.heistCrew + '%</span></div><input id="calcCrew" class="calc-range" type="range" min="5" max="35" value="' + state.heistCrew + '"></div>' +
      '<div class="calc-field"><div class="calc-label"><span>队长分红比例 (' + state.heistPlayers + '人)</span><span id="lblLeader">' + state.heistLeader + '%</span></div><input id="calcLeader" class="calc-range" type="range" min="25" max="85" step="5" value="' + state.heistLeader + '"></div>' +
      '<div class="calc-result"><div class="card-en">团队净到手总收益</div><div id="calcNetVal" class="calc-big">' + formatUsd(netPool) + '</div>' +
      '<div class="calc-split-grid"><div class="calc-split-box"><div class="card-en">主策划到手</div><div id="calcLeaderVal" class="price-tag" style="font-size:15px;margin-top:2px">' + formatUsd(leader) + '</div></div>' +
      '<div class="calc-split-box"><div class="card-en">队友每人</div><div id="calcPartnerVal" class="price-tag" style="font-size:15px;margin-top:2px;color:#FF2E93">' + formatUsd(partner) + '</div></div></div></div>';
    container.appendChild(calc);

    function recalc() {
      var g = Math.max(0, Number(byId("calcGross").value) || 0);
      var cr = Number(byId("calcCrew").value) || 16;
      var ld = Number(byId("calcLeader").value) || 55;
      state.heistGross = g;
      state.heistCrew = cr;
      state.heistLeader = ld;
      byId("lblCrew").textContent = cr + "%";
      byId("lblLeader").textContent = ld + "%";
      var pool = Math.max(0, Math.round(g * (1 - (cr + state.heistFence) / 100) - 45000));
      var lNet = Math.round(pool * (ld / 100));
      var pNet = Math.max(0, pool - lNet);
      byId("calcNetVal").textContent = formatUsd(pool);
      byId("calcLeaderVal").textContent = formatUsd(lNet);
      byId("calcPartnerVal").textContent = formatUsd(pNet);
    }

    byId("calcGross").addEventListener("input", recalc);
    byId("calcCrew").addEventListener("input", recalc);
    byId("calcLeader").addEventListener("input", recalc);
  }

  /* ===================== WALLPAPERS TAB & NATIVE SAVE ===================== */
  function saveWallpaperToAlbum(wp) {
    if (!hasMiniToolSdk() || typeof window.xhs.miniTool.writeTempFile !== "function" || typeof window.xhs.miniTool.saveImageToPhotosAlbum !== "function") {
      showToast("请在小红书 App 内点击保存至手机相册");
      return;
    }
    showToast("正在导出高清原图...");
    var img = new Image();
    img.onload = function () {
      try {
        var off = document.createElement("canvas");
        off.width = img.naturalWidth;
        off.height = img.naturalHeight;
        var octx = off.getContext("2d");
        octx.drawImage(img, 0, 0);
        var dataUrl = off.toDataURL("image/jpeg", 0.94);
        var base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
        Promise.resolve(
          window.xhs.miniTool.writeTempFile({
            fileName: wp.id + ".jpg",
            data: base64,
            encoding: "base64"
          })
        )
          .then(function (res) {
            var filePath = res && (res.filePath || res.tempFilePath || res.path);
            if (!filePath) throw new Error("no path");
            return window.xhs.miniTool.saveImageToPhotosAlbum({ filePath: filePath });
          })
          .then(function () {
            showToast("高清壁纸已保存至手机相册！");
          })
          .catch(function () {
            showToast("保存失败，请检查相册权限");
          });
      } catch (e) {
        showToast("导出失败，请重试");
      }
    };
    img.onerror = function () {
      showToast("图片读取失败");
    };
    img.src = wp.src;
  }

  function openWallpaperModal(wp) {
    state.previewWp = wp;
    state.showClock = true;
    byId("wpModalImg").src = wp.src;
    byId("wpModalTitle").textContent = wp.title;
    byId("wpModalSub").textContent = wp.region;
    byId("wpClockOverlay").classList.remove("is-hidden");
    byId("wpToggleClockBtn").textContent = "隐藏时钟";
    byId("wpModal").classList.remove("is-hidden");
  }

  function renderWallpapers() {
    var grid = byId("wallpaperGrid");
    grid.innerHTML = "";
    for (var i = 0; i < DATA.wallpapers.length; i++) {
      (function (wp) {
        var card = document.createElement("div");
        card.className = "wp-card";

        var thumbWrap = document.createElement("div");
        thumbWrap.className = "wp-thumb-wrap";
        var img = document.createElement("img");
        img.src = wp.src;
        img.alt = wp.title;
        thumbWrap.appendChild(img);
        thumbWrap.addEventListener("click", function () {
          openWallpaperModal(wp);
        });

        var meta = document.createElement("div");
        meta.className = "wp-meta";
        meta.innerHTML =
          '<div class="card-title">' + wp.title + '</div>' +
          '<div class="card-en">' + wp.en + ' · ' + wp.region + '</div>';

        var row = document.createElement("div");
        row.className = "wp-btn-row";

        var previewBtn = document.createElement("button");
        previewBtn.type = "button";
        previewBtn.className = "chip-btn";
        previewBtn.textContent = "锁屏预览";
        previewBtn.addEventListener("click", function () {
          openWallpaperModal(wp);
        });

        var saveBtn = document.createElement("button");
        saveBtn.type = "button";
        saveBtn.className = "primary-btn";
        saveBtn.textContent = "存到相册";
        saveBtn.addEventListener("click", function () {
          saveWallpaperToAlbum(wp);
        });

        row.appendChild(previewBtn);
        row.appendChild(saveBtn);
        meta.appendChild(row);
        card.appendChild(thumbWrap);
        card.appendChild(meta);
        grid.appendChild(card);
      })(DATA.wallpapers[i]);
    }
  }

  /* ===================== NAVIGATION & EVENTS ===================== */
  function switchTab(tabName) {
    state.tab = tabName;
    var panels = document.querySelectorAll(".tab-panel");
    for (var i = 0; i < panels.length; i++) {
      panels[i].classList.remove("is-active");
    }
    byId("panel-" + tabName).classList.add("is-active");

    var btns = document.querySelectorAll("#bottomNav .nav-item");
    for (var j = 0; j < btns.length; j++) {
      if (btns[j].getAttribute("data-tab") === tabName) {
        btns[j].classList.add("is-active");
      } else {
        btns[j].classList.remove("is-active");
      }
    }
    if (tabName === "map") {
      setTimeout(resizeCanvas, 20);
    }
  }

  function bindEvents() {
    // Bottom navigation
    var navBtns = document.querySelectorAll("#bottomNav .nav-item");
    for (var i = 0; i < navBtns.length; i++) {
      navBtns[i].addEventListener("click", function () {
        switchTab(this.getAttribute("data-tab"));
      });
    }

    // Native XHS share card
    byId("shareBtn").addEventListener("click", function () {
      if (hasMiniToolSdk() && typeof window.xhs.miniTool.share === "function") {
        Promise.resolve(window.xhs.miniTool.share({ type: "card" })).catch(function () {
          showToast("请点击右上角 ··· 分享给好友");
        });
      } else {
        showToast("请在小红书内点击分享小工具卡片");
      }
    });

    // Basemap switch
    var bmBtns = document.querySelectorAll("#basemapSwitch .seg-btn");
    for (var b = 0; b < bmBtns.length; b++) {
      bmBtns[b].addEventListener("click", function () {
        for (var x = 0; x < bmBtns.length; x++) bmBtns[x].classList.remove("is-active");
        this.classList.add("is-active");
        state.basemap = this.getAttribute("data-basemap");
        drawMap();
      });
    }

    byId("toggleCollectedBtn").addEventListener("click", function () {
      state.hideCollected = !state.hideCollected;
      this.classList.toggle("is-active", state.hideCollected);
      this.textContent = state.hideCollected ? "显示全部" : "隐藏已收集";
      drawMap();
    });

    byId("resetMapBtn").addEventListener("click", function () {
      state.scale = 1;
      state.offsetX = 0;
      state.offsetY = 0;
      drawMap();
    });

    byId("zoomInBtn").addEventListener("click", function () {
      state.scale = Math.min(3.4, state.scale * 1.28);
      drawMap();
    });

    byId("zoomOutBtn").addEventListener("click", function () {
      state.scale = Math.max(0.75, state.scale / 1.28);
      drawMap();
    });

    byId("closeMarkerBtn").addEventListener("click", function () {
      state.selectedMarkerId = null;
      byId("markerCard").classList.add("is-hidden");
      drawMap();
    });

    byId("toggleMarkerDoneBtn").addEventListener("click", function () {
      if (state.selectedMarkerId) {
        toggleMarkerDone(state.selectedMarkerId);
      }
    });

    // Touch / pointer pan & tap on map canvas
    var stage = byId("mapStage");
    var startPan = function (x, y) {
      state.dragging = true;
      state.dragMoved = false;
      state.lastX = x;
      state.lastY = y;
    };
    var movePan = function (x, y) {
      if (!state.dragging) return;
      var dx = x - state.lastX;
      var dy = y - state.lastY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) state.dragMoved = true;
      state.offsetX += dx;
      state.offsetY += dy;
      state.lastX = x;
      state.lastY = y;
      drawMap();
    };
    var endPan = function (x, y) {
      if (!state.dragging) return;
      state.dragging = false;
      if (!state.dragMoved) {
        handleMapTap(x, y);
      }
    };

    stage.addEventListener("mousedown", function (e) { startPan(e.clientX, e.clientY); });
    window.addEventListener("mousemove", function (e) { movePan(e.clientX, e.clientY); });
    window.addEventListener("mouseup", function (e) { endPan(e.clientX, e.clientY); });

    stage.addEventListener("touchstart", function (e) {
      if (e.touches.length === 1) {
        startPan(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    stage.addEventListener("touchmove", function (e) {
      if (e.touches.length === 1) {
        movePan(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      var t = e.changedTouches[0];
      if (t) endPan(t.clientX, t.clientY);
    }, { passive: true });

    // Cheats platform switch
    var platBtns = document.querySelectorAll("#platformSwitch .seg-btn");
    for (var p = 0; p < platBtns.length; p++) {
      platBtns[p].addEventListener("click", function () {
        for (var x = 0; x < platBtns.length; x++) platBtns[x].classList.remove("is-active");
        this.classList.add("is-active");
        state.cheatPlatform = this.getAttribute("data-platform");
        renderCheats();
      });
    }

    // Wiki sub-tab switch
    var wikiBtns = document.querySelectorAll("#wikiSubSwitch .seg-btn");
    for (var w = 0; w < wikiBtns.length; w++) {
      wikiBtns[w].addEventListener("click", function () {
        for (var x = 0; x < wikiBtns.length; x++) wikiBtns[x].classList.remove("is-active");
        this.classList.add("is-active");
        state.wikiSub = this.getAttribute("data-wiki");
        renderWiki();
      });
    }

    byId("wikiSearchInput").addEventListener("input", function () {
      state.wikiQuery = this.value;
      renderWiki();
    });

    // Wallpaper modal controls
    byId("wpModalClose").addEventListener("click", function () {
      byId("wpModal").classList.add("is-hidden");
    });
    byId("wpToggleClockBtn").addEventListener("click", function () {
      state.showClock = !state.showClock;
      byId("wpClockOverlay").classList.toggle("is-hidden", !state.showClock);
      this.textContent = state.showClock ? "隐藏时钟" : "显示时钟";
    });
    byId("wpSaveBtn").addEventListener("click", function () {
      if (state.previewWp) saveWallpaperToAlbum(state.previewWp);
    });

    window.addEventListener("resize", resizeCanvas);
  }

  /* ===================== BOOTSTRAP ===================== */
  function init() {
    applySafeArea();
    bindEvents();
    loadProgress().then(function () {
      updateHeaderProgress();
      renderMapCategories();
      renderCheats();
      renderWiki();
      renderWallpapers();
      resizeCanvas();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
