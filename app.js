/* ==========================================================================
   Aomori Choropleth Studio - Application Engine
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. Master List of 40 Municipalities in Aomori Prefecture ---
  const AOMORI_MUNICIPALITIES = [
    { name: "青森市", code: "02201", type: "市", region: "tsugaru" },
    { name: "弘前市", code: "02202", type: "市", region: "tsugaru" },
    { name: "八戸市", code: "02203", type: "市", region: "nanbu" },
    { name: "黒石市", code: "02204", type: "市", region: "tsugaru" },
    { name: "五所川原市", code: "02205", type: "市", region: "tsugaru" },
    { name: "十和田市", code: "02206", type: "市", region: "nanbu" },
    { name: "三沢市", code: "02207", type: "市", region: "nanbu" },
    { name: "むつ市", code: "02208", type: "市", region: "shimokita" },
    { name: "つがる市", code: "02209", type: "市", region: "tsugaru" },
    { name: "平川市", code: "02210", type: "市", region: "tsugaru" },
    { name: "平内町", code: "02301", type: "町", region: "tsugaru" },
    { name: "今別町", code: "02303", type: "町", region: "tsugaru" },
    { name: "蓬田村", code: "02304", type: "村", region: "tsugaru" },
    { name: "外ヶ浜町", code: "02307", type: "町", region: "tsugaru" },
    { name: "鰺ヶ沢町", code: "02321", type: "町", region: "tsugaru" },
    { name: "深浦町", code: "02323", type: "町", region: "tsugaru" },
    { name: "西目屋村", code: "02343", type: "村", region: "tsugaru" },
    { name: "藤崎町", code: "02361", type: "町", region: "tsugaru" },
    { name: "大鰐町", code: "02362", type: "町", region: "tsugaru" },
    { name: "田舎館村", code: "02367", type: "村", region: "tsugaru" },
    { name: "板柳町", code: "02381", type: "町", region: "tsugaru" },
    { name: "鶴田町", code: "02384", type: "町", region: "tsugaru" },
    { name: "中泊町", code: "02387", type: "町", region: "tsugaru" },
    { name: "野辺地町", code: "02401", type: "町", region: "nanbu" },
    { name: "七戸町", code: "02402", type: "町", region: "nanbu" },
    { name: "六戸町", code: "02405", type: "町", region: "nanbu" },
    { name: "横浜町", code: "02406", type: "町", region: "shimokita" },
    { name: "東北町", code: "02408", type: "町", region: "nanbu" },
    { name: "六ヶ所村", code: "02411", type: "村", region: "nanbu" },
    { name: "おいらせ町", code: "02412", type: "町", region: "nanbu" },
    { name: "大間町", code: "02423", type: "町", region: "shimokita" },
    { name: "東通村", code: "02424", type: "村", region: "shimokita" },
    { name: "風間浦村", code: "02425", type: "村", region: "shimokita" },
    { name: "佐井村", code: "02426", type: "村", region: "shimokita" },
    { name: "三戸町", code: "02441", type: "町", region: "nanbu" },
    { name: "五戸町", code: "02442", type: "町", region: "nanbu" },
    { name: "田子町", code: "02443", type: "町", region: "nanbu" },
    { name: "南部町", code: "02445", type: "町", region: "nanbu" },
    { name: "階上町", code: "02446", type: "町", region: "nanbu" },
    { name: "新郷村", code: "02450", type: "村", region: "nanbu" }
  ];

  // Removed hardcoded centroids and leader line offsets. They are now calculated dynamically.

  // Region Bounding Boxes (Tuned for A4 landscape paper zoom)
  const REGION_BOUNDS = {
    "all": [[40.186, 139.477], [41.706, 142.028]],
    "tsugaru": [[40.350, 139.450], [41.300, 141.120]],
    "sanpachi": [[40.180, 140.900], [40.640, 141.720]],
    "kamikita": [[40.380, 140.800], [41.200, 141.520]],
    "shimokita": [[41.050, 140.720], [41.600, 141.520]],
    "nanbu": [[40.180, 140.800], [41.200, 141.720]]
  };

  // --- 2. Color Palettes Configuration ---
  const PALETTES = {
    viridis: ["#440154", "#414487", "#2a788e", "#22a884", "#7ad151", "#fde725"],
    cividis: ["#002051", "#2c406e", "#576189", "#8384a4", "#b4abaf", "#e8d799"],
    blues: ["transparent", "#bfdbfe", "#60a5fa", "#2563eb", "#1e40af", "#172554"],
    greens: ["transparent", "#bbf7d0", "#4ade80", "#16a34a", "#15803d", "#052e16"],
    oranges: ["transparent", "#fed7aa", "#fb923c", "#ea580c", "#c2410c", "#431407"],
    reds: ["transparent", "#fca5a5", "#ef4444", "#dc2626", "#991b1b", "#450a0a"],
    purples: ["transparent", "#e9d5ff", "#c084fc", "#9333ea", "#6b21a8", "#3b0764"],
    ylorrd: ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"],
    grayscale: ["transparent", "#cbd5e1", "#94a3b8", "#64748b", "#334155", "#0f172a"],
    spectral: ["#5e4fa2", "#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#fee08b", "#fdae61", "#f46d43", "#d53e4f", "#9e0142"],
    plasma: ["#0d0887", "#6a00a8", "#b12a90", "#e16462", "#fca636", "#f0f921"],
    magma: ["#000004", "#3b0f70", "#8c2981", "#de4968", "#fe9f6d", "#fcfdbf"],
    paired: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],
    set1: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf"],
    patterns: ["url(#pat-0)", "url(#pat-1)", "url(#pat-2)", "url(#pat-3)", "url(#pat-4)", "url(#pat-5)", "url(#pat-6)", "url(#pat-7)"]
  };

  // --- 4. Application State ---

  const state = {
    geojsonData: null,
    baselinePopulation: {},
    isPerCapitaMode: false,
    activeVariableKey: null, // Initialized as null (empty state)
    variables: {}, // key -> variable config { id, name, label, unit, title, subtitle, remarks, palette, data }
    currentValues: {}, // key: municipal name, val: number
    title: "",
    subtitle: "",
    unit: "",
    remarks: "",
    paletteKey: "blues",
    useCustomGradient: false,
    customStartColor: "#eff6ff",
    customEndColor: "#1e3a8a",
    invertPalette: false,
    binningMode: "equal", // 'equal' | 'jenks' | 'quantile' | 'custom'
    stepCount: 5,
    customBreaks: [],
    mapBg: "none",
    strokeOpacity: 0.8,
    strokeColor: "auto",
    labelMode: "none",
    labelContent: "name_val",
    legendPosition: "rightmiddle",
    exportScale: 3,
    activeRegion: "all",
    leafletMap: null,
    geojsonLayer: null,
    labelGroup: null,
    dynamicCentroids: {},
    computedBreaks: [],
    selectedMuni: null
  };

  // --- 5. Variable Store Management & Multi-Variable Modal ---
  function initEmptyState() {
    state.activeVariableKey = null;
    state.variables = {};
    state.currentValues = {};
    state.title = "";
    state.subtitle = "";
    state.unit = "";
    state.remarks = "";

    // Clear inputs in DOM
    const titleInput = document.getElementById("map-title-input");
    const subTitleInput = document.getElementById("map-subtitle-input");
    const unitInput = document.getElementById("map-unit-input");
    const remarksInput = document.getElementById("map-remarks-input");

    if (titleInput) titleInput.value = "";
    if (subTitleInput) subTitleInput.value = "";
    if (unitInput) unitInput.value = "";
    if (remarksInput) remarksInput.value = "";

    const displayTitle = document.getElementById("display-map-title");
    const displaySubtitle = document.getElementById("display-map-subtitle");
    const displayUnit = document.getElementById("display-legend-unit");
    const displayRemarks = document.getElementById("display-map-remarks");

    if (displayTitle) displayTitle.textContent = "青森県 市町村別統計マップ";
    if (displaySubtitle) displaySubtitle.textContent = "データを読み込むと作図が始まります";
    if (displayUnit) displayUnit.textContent = "";
    if (displayRemarks) displayRemarks.textContent = "";

    const card = document.getElementById("variable-select-card");
    if (card) card.classList.add("hidden");

    populateVariableDropdowns();
    updateDataTable();
    renderGeoJSONLayer();
    updateStatsSummary();
  }

  // Load e-Stat sample dataset
  function loadEstatSampleData() {
    fetch("./data/sugata2026.csv")
      .then(res => {
        if (!res.ok) throw new Error("Sample data load failed");
        return res.text();
      })
      .then(text => {
        parseRawText(text);
        showToast("「統計でみる市区町村のすがた 2026」データを読み込みました。", "info");
      })
      .catch(err => {
        console.error(err);
        showToast("サンプルデータの読み込みに失敗しました", "error");
      });
  }
  
  function getEffectiveValues() {
    if (!state.isPerCapitaMode) return state.currentValues;
    let eff = {};
    for (let key in state.currentValues) {
      let val = state.currentValues[key];
      let base = state.baselinePopulation[key];
      if (typeof val === 'number' && typeof base === 'number' && base > 0) {
        // Compute per 100,000 population
        eff[key] = (val / base) * 100000;
      } else {
        eff[key] = val; // fallback
      }
    }
    return eff;
  }


  function openVariableModal(preselectKey = null) {
    const modal = document.getElementById("variable-modal");
    const listEl = document.getElementById("modal-variable-list");
    const countEl = document.getElementById("modal-var-count");
    if (!modal || !listEl) return;

    const keys = Object.keys(state.variables);
    if (keys.length === 0) return;

    if (countEl) countEl.textContent = `全 ${keys.length} 項目を検出`;

    listEl.innerHTML = "";
    const activeKey = preselectKey || state.activeVariableKey || keys[0];

    keys.forEach(key => {
      const v = state.variables[key];
      const vals = Object.values(v.data || {}).filter(x => typeof x === 'number' && !isNaN(x));
      const count = vals.length;
      const min = count > 0 ? Math.min(...vals) : 0;
      const max = count > 0 ? Math.max(...vals) : 0;
      const unitStr = v.unit ? ` (${v.unit})` : '';

      const card = document.createElement("label");
      card.className = `var-radio-card ${key === activeKey ? 'active' : ''}`;
      card.innerHTML = `
        <input type="radio" name="modal-selected-var" value="${key}" ${key === activeKey ? 'checked' : ''}>
        <div class="var-card-content">
          <div class="var-card-title">
            <span>${v.label || (v.name + unitStr)}</span>
          </div>
          <div class="var-card-meta">
            ${count} 自治体のデータ | 範囲: ${min.toLocaleString()} 〜 ${max.toLocaleString()} ${v.unit || ''}
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        document.querySelectorAll(".var-radio-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });

      listEl.appendChild(card);
    });

    modal.classList.remove("hidden");
  }

  function closeVariableModal() {
    const modal = document.getElementById("variable-modal");
    if (modal) modal.classList.add("hidden");
  }

  function confirmVariableModal() {
    const checked = document.querySelector('input[name="modal-selected-var"]:checked');
    if (checked && checked.value) {
      switchActiveVariable(checked.value, true);
    }
    closeVariableModal();
  }

  function populateVariableDropdowns() {
    const dropdowns = [
      document.getElementById("select-variable-step1"),
      document.getElementById("select-variable-step2"),
      document.getElementById("select-variable-header")
    ].filter(Boolean);

    const keys = Object.keys(state.variables);

    dropdowns.forEach(dd => {
      dd.innerHTML = "";
      if (keys.length === 0) {
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "（データ未読み込み）";
        opt.disabled = true;
        opt.selected = true;
        dd.appendChild(opt);
        dd.disabled = true;
      } else {
        dd.disabled = false;
        keys.forEach(key => {
          const v = state.variables[key];
          const opt = document.createElement("option");
          opt.value = key;
          opt.textContent = v.label || (v.name + (v.unit ? ` (${v.unit})` : ''));
          if (key === state.activeVariableKey) opt.selected = true;
          dd.appendChild(opt);
        });
        if (state.activeVariableKey) dd.value = state.activeVariableKey;
      }
    });
  }

  function switchActiveVariable(key, notify = true) {
    if (!key || !state.variables[key]) return;
    const v = state.variables[key];
    state.activeVariableKey = key;

    // Show Variable Selection Card in Step 1
    const card = document.getElementById("variable-select-card");
    if (card) card.classList.remove("hidden");

    // Synchronize all variable dropdowns
    ["select-variable-step1", "select-variable-step2", "select-variable-header"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.disabled = false;
        el.value = key;
      }
    });

    state.currentValues = Object.assign({}, v.data);
    state.title = v.title || `青森県 市町村別 ${v.name}`;
    state.subtitle = v.subtitle || "";
    state.unit = v.unit ? `単位：${v.unit}` : "";
    state.remarks = v.remarks || "";
    if (v.palette) state.paletteKey = v.palette;

    // Update Palette Buttons Active State
    document.querySelectorAll(".palette-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-palette") === state.paletteKey);
    });

    // Update Text Inputs & Displays
    const titleInput = document.getElementById("map-title-input");
    const subTitleInput = document.getElementById("map-subtitle-input");
    const unitInput = document.getElementById("map-unit-input");
    const remarksInput = document.getElementById("map-remarks-input");

    if (titleInput) titleInput.value = state.title;
    if (subTitleInput) subTitleInput.value = state.subtitle;
    if (unitInput) unitInput.value = state.unit;
    if (remarksInput) remarksInput.value = state.remarks;

    const displayTitle = document.getElementById("display-map-title");
    const displaySubtitle = document.getElementById("display-map-subtitle");
    const displayUnit = document.getElementById("display-legend-unit");
    const displayRemarks = document.getElementById("display-map-remarks");

    if (displayTitle) displayTitle.textContent = state.title;
    if (displaySubtitle) displaySubtitle.textContent = state.subtitle;
    if (displayUnit) displayUnit.textContent = state.unit;
    if (displayRemarks) displayRemarks.textContent = state.remarks;

    // Update Meta Badge & Table Column Header
    const badge = document.getElementById("variable-meta-badge");
    if (badge) {
      badge.textContent = `${state.unit ? state.unit + ' | ' : ''}全40自治体データ読込済`;
    }

    const thVal = document.getElementById("th-val-col");
    if (thVal) {
      thVal.textContent = `${v.name || '数値'}（${v.unit || '入力'}）`;
    }

    updateDataTable();
    renderGeoJSONLayer();
    updateStatsSummary();

    if (notify) {
      showToast(`作図項目を「${v.name || v.title}」に設定しました`, "info");
    }
  }

  // --- 6. Name Normalizer & Fuzzy Matcher ---
  function normalizeName(inputName) {
    if (!inputName) return "";
    let s = String(inputName).trim()
      .replace(/^青森県/, "")
      .replace(/\s+/g, "");
    
    // Check by municipality code (e.g., "02201" or "2201")
    for (let m of AOMORI_MUNICIPALITIES) {
      if (m.code === s || m.code === "0" + s || m.code.slice(1) === s) {
        return m.name;
      }
    }

    // Direct match check
    for (let m of AOMORI_MUNICIPALITIES) {
      if (m.name === s) return m.name;
    }

    // Match without '市', '町', '村' suffix (only exact match)
    for (let m of AOMORI_MUNICIPALITIES) {
      let base = m.name.replace(/[市町村]$/, "");
      if (s === base || s === base + "市" || s === base + "町" || s === base + "村") return m.name;
    }

    return null;
  }

  // --- 6. Jenks Natural Breaks Algorithm (Fisher-Jenks in JS) ---
  function getJenksBreaks(dataList, numClasses) {
    let list = dataList.filter(v => typeof v === 'number' && !isNaN(v)).sort((a, b) => a - b);
    if (list.length === 0) return [];
    if (numClasses >= list.length) {
      return [...new Set(list)];
    }

    let n = list.length;
    let k = numClasses;
    
    // Matrices for dynamic programming
    let mat1 = Array.from({ length: n + 1 }, () => Array(k + 1).fill(0));
    let mat2 = Array.from({ length: n + 1 }, () => Array(k + 1).fill(0));

    for (let y = 1; y <= k; y++) {
      mat1[1][y] = 1;
      mat2[1][y] = 0;
      for (let t = 2; t <= n; t++) {
        mat2[t][y] = Infinity;
      }
    }

    let v = 0;
    for (let l = 2; l <= n; l++) {
      let s1 = 0;
      let s2 = 0;
      let w = 0;
      for (let m = 1; m <= l; m++) {
        let i3 = l - m + 1;
        let val = list[i3 - 1];
        s2 += val * val;
        s1 += val;
        w++;
        v = s2 - (s1 * s1) / w;
        let i4 = i3 - 1;
        if (i4 !== 0) {
          for (let j = 2; j <= k; j++) {
            if (mat2[l][j] >= (v + mat2[i4][j - 1])) {
              mat1[l][j] = i3;
              mat2[l][j] = v + mat2[i4][j - 1];
            }
          }
        }
      }
      mat1[l][1] = 1;
      mat2[l][1] = v;
    }

    let kclass = Array(k + 1).fill(0);
    kclass[k] = list[list.length - 1];
    kclass[0] = list[0];
    let count = k;
    let last = n;

    while (count >= 2) {
      let id = parseInt(mat1[last][count], 10) - 2;
      if (id >= 0 && id < list.length) {
        kclass[count - 1] = list[id];
      } else {
        kclass[count - 1] = list[0];
      }
      last = parseInt(mat1[last][count], 10) - 1;
      count--;
    }

    return kclass;
  }

  // --- 7. Initialization ---
  document.addEventListener("DOMContentLoaded", () => {
    initLeafletMap();
    loadGeoJSON();
    bindEvents();
    initEmptyState();
    
    // Fetch baseline population
    fetch("./data/baseline_population.csv")
      .then(res => res.text())
      .then(text => {
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        for(let i=1; i<lines.length; i++) {
          const parts = lines[i].split(",");
          if (parts.length >= 3) {
            state.baselinePopulation[parts[1]] = parseFloat(parts[2]);
          }
        }
        console.log("Baseline population loaded.");
      })
      .catch(err => console.error("Failed to load baseline population", err));
  });

  // --- 8. Leaflet Map Setup ---
  function initLeafletMap() {
    if (state.leafletMap) return;
    const mapEl = document.getElementById("leaflet-map");
    if (!mapEl) return;

    state.leafletMap = L.map("leaflet-map", {
      zoomControl: false,
      attributionControl: false,
      preferCanvas: false,
      center: [40.946, 140.7526],
      zoom: 9,
      zoomSnap: 0.1,
      zoomDelta: 0.25
    });

    let zoomTimeout;
    state.leafletMap.on('zoomend', () => {
      clearTimeout(zoomTimeout);
      zoomTimeout = setTimeout(() => {
        renderLabelsLayer();
      }, 200);
    });

    L.control.zoom({ position: 'topleft' }).addTo(state.leafletMap);
    updateMapBackgroundTile();
  }

  function updateMapBackgroundTile() {
    if (!state.leafletMap) return;
    state.leafletMap.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        state.leafletMap.removeLayer(layer);
      }
    });

    const frame = document.getElementById("export-map-frame");
    if (!frame) return;

    if (state.mapBg === "transparent") {
      frame.className = "map-export-frame theme-light";
      frame.style.backgroundColor = "transparent";
    } else if (state.mapBg === "minimal-dark") {
      frame.className = "map-export-frame theme-dark";
      frame.style.backgroundColor = "#0f172a";
    } else if (state.mapBg === "minimal-light") {
      frame.className = "map-export-frame theme-light";
      frame.style.backgroundColor = "#f8fafc";
    } else {
      // Pure White Canvas
      frame.className = "map-export-frame theme-light";
      frame.style.backgroundColor = "#ffffff";
    }
  }

  function getPolygonArea(ring) {
    let area = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      let p1 = ring[i];
      let p2 = ring[i + 1];
      area += (p1[0] * p2[1] - p2[0] * p1[1]);
    }
    return Math.abs(area) / 2;
  }

  function getPolygonCentroid(ring) {
    let cx = 0, cy = 0, area = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      let p1 = ring[i];
      let p2 = ring[i + 1];
      let f = p1[0] * p2[1] - p2[0] * p1[1];
      cx += (p1[0] + p2[0]) * f;
      cy += (p1[1] + p2[1]) * f;
      area += f;
    }
    area = area / 2;
    if (area === 0) return [ring[0][1], ring[0][0]];
    cx = cx / (6 * area);
    cy = cy / (6 * area);
    return [cy, cx];
  }

  function calculateDynamicCentroids(geojsonData) {
    const centroids = {};
    geojsonData.features.forEach(f => {
      let rawName = f.properties.name || f.properties.N03_004;
      let name = normalizeName(rawName) || rawName;
      
      let geomType = f.geometry.type;
      let coords = f.geometry.coordinates;
      
      let largestRing = null;
      let maxArea = -1;
      
      if (geomType === "Polygon") {
        largestRing = coords[0];
      } else if (geomType === "MultiPolygon") {
        coords.forEach(polygon => {
          let ring = polygon[0];
          let area = getPolygonArea(ring);
          if (area > maxArea) {
            maxArea = area;
            largestRing = ring;
          }
        });
      }
      
      if (largestRing) {
        centroids[name] = getPolygonCentroid(largestRing);
      }
    });
    return centroids;
  }

  // Load Aomori Municipality GeoJSON File
  function loadGeoJSON() {
    fetch("./data/aomori_municipalities.geojson")
      .then(res => {
        if (!res.ok) throw new Error("GeoJSON load failed");
        return res.json();
      })
      .then(data => {
        state.geojsonData = data;
        state.dynamicCentroids = calculateDynamicCentroids(data);
        renderGeoJSONLayer();
        fitMapToBounds();
      })
      .catch(err => {
        console.error("GeoJSON error:", err);
        showToast("境界データ(GeoJSON)の読み込みに失敗しました", "error");
      });
  }

  function fitMapToBounds(bounds) {
    if (!state.leafletMap) return;
    const size = state.leafletMap.getSize();
    if (!size || size.x <= 0 || size.y <= 0) return; // Prevent corrupting map zoom when container is hidden

    let b = null;
    if (bounds) {
      b = L.latLngBounds(bounds);
    } else {
      b = L.latLngBounds(REGION_BOUNDS.all);
    }

    if (b && b.isValid && b.isValid()) {
      state.leafletMap.fitBounds(b, { padding: [10, 10], animate: true });
    }
  }

  // --- 9. Classification & Color Engine ---
  function computeBreaks() {
    const vals = Object.values(getEffectiveValues()).filter(v => typeof v === 'number' && !isNaN(v));
    if (vals.length === 0) {
      state.computedBreaks = [];
      return;
    }

    const min = Math.min(...vals);
    const max = Math.max(...vals);

    if (min === max) {
      state.computedBreaks = [min, max + 1];
      return;
    }

    if (state.binningMode === "custom" && state.customBreaks.length > 0) {
      let b = [...state.customBreaks].sort((a, b) => a - b);
      if (b[0] > min) b.unshift(min);
      if (b[b.length - 1] < max) b.push(max);
      state.computedBreaks = b;
      return;
    }

    const k = parseInt(state.stepCount, 10);
    state.computedBreaks = [];

    if (state.binningMode === "jenks") {
      // Jenks Natural Breaks
      state.computedBreaks = getJenksBreaks(vals, k);
    } else if (state.binningMode === "quantile") {
      // Quantile classification
      let sorted = [...vals].sort((a, b) => a - b);
      state.computedBreaks.push(sorted[0]);
      for (let i = 1; i < k; i++) {
        let qIndex = Math.floor((i / k) * (sorted.length - 1));
        state.computedBreaks.push(sorted[qIndex]);
      }
      state.computedBreaks.push(sorted[sorted.length - 1]);
    } else {
      // Equal Interval (default)
      let step = (max - min) / k;
      for (let i = 0; i <= k; i++) {
        state.computedBreaks.push(min + step * i);
      }
    }
  }

  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    let num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  function interpolateColors(color1, color2, factor) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const result = rgb1.map((c, i) => c + factor * (rgb2[i] - c));
    return rgbToHex(result[0], result[1], result[2]);
  }

  function darkenHex(hex, factor = 0.5) {
    const rgb = hexToRgb(hex);
    const r = Math.round(rgb[0] * factor);
    const g = Math.round(rgb[1] * factor);
    const b = Math.round(rgb[2] * factor);
    return rgbToHex(r, g, b);
  }

  // Determine optimal stroke color and weight per feature based on brightness/color
  function getBorderStrokeForFeature(fillColor) {
    if (fillColor && fillColor.startsWith("url")) {
      return { color: "#000000", weight: 1.5 };
    }
    
    let mode = state.strokeColor || "auto";
    if (mode === "none") {
      return { color: "transparent", weight: 0 };
    }
    if (mode === "white") {
      return { color: "#ffffff", weight: 1.2 };
    }
    if (mode === "dark") {
      return { color: "#475569", weight: 1.2 };
    }
    if (mode === "black") {
      return { color: "#0f172a", weight: 1.6 };
    }
    if (mode === "match_palette") {
      return { color: darkenHex(fillColor, 0.45), weight: 1.3 };
    }

    // Default: "auto" (Adaptive Brightness / Contrast)
    // For light/bright polygons -> use dark crisp slate border (#475569) so boundaries are clearly visible!
    // For dark/saturated polygons -> use crisp clean white border (#ffffff)
    const rgb = hexToRgb(fillColor);
    const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
    if (lum > 165) {
      return { color: "#475569", weight: 1.3 };
    } else {
      return { color: "#ffffff", weight: 1.2 };
    }
  }

  function getColorForValue(val) {
    if (val === undefined || val === null || isNaN(val)) {
      return "#f1f5f9"; // Neutral light slate for unentered data
    }

    const breaks = state.computedBreaks;
    if (!breaks || breaks.length < 2) return "#f1f5f9";

    const numClasses = breaks.length - 1;
    let colors = [];

    if (state.useCustomGradient) {
      let startC = state.customStartColor || "#eff6ff";
      let endC = state.customEndColor || "#1e3a8a";
      for (let i = 0; i < numClasses; i++) {
        let factor = (numClasses === 1) ? 0.5 : (i / (numClasses - 1));
        colors.push(interpolateColors(startC, endC, factor));
      }
    } else {
      let rawPalette = PALETTES[state.paletteKey] || PALETTES.blues;
      for (let i = 0; i < numClasses; i++) {
        let idx = Math.floor((i / (numClasses - 1 || 1)) * (rawPalette.length - 1));
        colors.push(rawPalette[idx]);
      }
    }

    if (state.invertPalette) {
      colors = [...colors].reverse();
    }

    for (let i = 0; i < numClasses; i++) {
      if (i === numClasses - 1) {
        if (val >= breaks[i] && val <= breaks[i + 1]) return colors[i];
      } else {
        if (val >= breaks[i] && val < breaks[i + 1]) return colors[i];
      }
    }

    if (val < breaks[0]) return colors[0];
    return colors[numClasses - 1];
  }

  // --- 10. Map Layer Rendering ---
  function renderGeoJSONLayer() {
    if (!state.geojsonData || !state.leafletMap) return;

    computeBreaks();

    if (state.geojsonLayer) {
      state.leafletMap.removeLayer(state.geojsonLayer);
    }

    state.geojsonLayer = L.geoJSON(state.geojsonData, {
      style: (feature) => {
        let name = feature.properties.name || feature.properties.N03_004;
        let matchedName = normalizeName(name);
        let val = matchedName ? getEffectiveValues()[matchedName] : null;
        let fillColor = getColorForValue(val);
        let strokeInfo = getBorderStrokeForFeature(fillColor);

        return {
          fillColor: fillColor,
          fillOpacity: 0.92,
          color: strokeInfo.color,
          weight: strokeInfo.weight,
          opacity: parseFloat(state.strokeOpacity)
        };
      },
      onEachFeature: (feature, layer) => {
        let rawName = feature.properties.name || feature.properties.N03_004;
        let matchedName = normalizeName(rawName) || rawName;
        let val = getEffectiveValues()[matchedName];
        let hasVal = (val !== undefined && val !== null && !isNaN(val));
        let displayVal = hasVal ? val.toLocaleString() : "データなし";

        // Interactive hover tooltip
        layer.bindTooltip(`
          <div style="font-weight:700; font-size:0.9rem;">${matchedName}</div>
          <div style="color:#60a5fa; font-size:0.82rem; margin-top:2px;">
            ${displayVal} <small style="color:#cbd5e1">${state.unit}</small>
          </div>
        `, { sticky: true, direction: 'top', offset: [0, -10] });

        layer.on({
          mouseover: (e) => {
            let l = e.target;
            l.setStyle({
              weight: strokeWeight + 2,
              color: "#38bdf8",
              fillOpacity: 1.0
            });
            l.bringToFront();
          },
          mouseout: (e) => {
            state.geojsonLayer.resetStyle(e.target);
          },
          click: (e) => {
            showMunicipalityDetail(matchedName);
          }
        });
      }
    }).addTo(state.leafletMap);

    renderLabelsLayer();
    renderLegend();
    updateStatsSummary();
  }

  // Permanent Static Label Marker Layer with Dynamic Overlap Resolution
  function renderLabelsLayer() {
    if (!state.leafletMap || !state.dynamicCentroids || Object.keys(state.dynamicCentroids).length === 0) return;

    if (!state.labelGroup) {
      state.labelGroup = L.layerGroup().addTo(state.leafletMap);
    }
    state.labelGroup.clearLayers();

    if (state.labelMode === "none") return;

    const CITIES_LIST = ["青森市", "弘前市", "八戸市", "黒石市", "五所川原市", "十和田市", "三沢市", "むつ市", "つがる市", "平川市"];
    let labels = [];

    AOMORI_MUNICIPALITIES.forEach(m => {
      if (state.labelMode === "cities_only" && !CITIES_LIST.includes(m.name)) return;

      let centroid = state.dynamicCentroids[m.name];
      if (!centroid) return;

      let val = getEffectiveValues()[m.name];
      let hasVal = (val !== undefined && val !== null && !isNaN(val));
      let shortVal = hasVal ? formatNumber(val) : "";

      let labelHTML = "";
      
      // Calculate approximate text width
      let textLen = m.name.length;
      if (state.labelContent === "name_val" && hasVal) {
        textLen += shortVal.length + 1; // +1 for some spacing
      }
      
      let w = 40 + (textLen * 12); // Base width + approx char width
      let h = 36;
      
      if (state.labelMode === "compact") {
        labelHTML = `<div class="static-label-compact">${m.name}${state.labelContent === "name_val" ? `<span>${shortVal}</span>` : ""}</div>`;
        w = 30 + (textLen * 10);
        h = 24;
      } else {
        labelHTML = `<div class="static-label-name">${m.name}</div>${state.labelContent === "name_val" ? `<div class="static-label-val">${shortVal}</div>` : ""}`;
      }

      let pt = state.leafletMap.latLngToLayerPoint(centroid);
      labels.push({
        name: m.name,
        latlng: centroid,
        x: pt.x,
        y: pt.y,
        origX: pt.x,
        origY: pt.y,
        w: w,
        h: h,
        html: labelHTML
      });
    });

    // Force-directed layout for overlap resolution
    const ITERATIONS = 50;
    const REPULSION = 0.5;
    const SPRING = 0.05;

    for (let i = 0; i < ITERATIONS; i++) {
      for (let a = 0; a < labels.length; a++) {
        for (let b = a + 1; b < labels.length; b++) {
          let la = labels[a];
          let lb = labels[b];
          
          let dx = la.x - lb.x;
          let dy = la.y - lb.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          
          let minDistX = (la.w + lb.w) / 2 + 5; // 5px padding
          let minDistY = (la.h + lb.h) / 2 + 5;
          
          if (Math.abs(dx) < minDistX && Math.abs(dy) < minDistY) {
            if (dist === 0) { dx = (Math.random()-0.5); dy = (Math.random()-0.5); dist = Math.sqrt(dx*dx+dy*dy); }
            let pushX = (dx / dist) * REPULSION * (minDistX - Math.abs(dx));
            let pushY = (dy / dist) * REPULSION * (minDistY - Math.abs(dy));
            la.x += pushX;
            la.y += pushY;
            lb.x -= pushX;
            lb.y -= pushY;
          }
        }
      }
      labels.forEach(l => {
        l.x += (l.origX - l.x) * SPRING;
        l.y += (l.origY - l.y) * SPRING;
      });
    }

    labels.forEach(l => {
      let finalPt = L.point(l.x, l.y);
      let targetPos = state.leafletMap.layerPointToLatLng(finalPt);
      
      let distFromOrig = Math.sqrt(Math.pow(l.x - l.origX, 2) + Math.pow(l.y - l.origY, 2));
      let hasMoved = distFromOrig > 12; // 12px threshold for drawing leader line
      
      if (hasMoved) {
        L.polyline([l.latlng, targetPos], {
          color: "#2563eb",
          weight: 1.5,
          opacity: 0.85,
          dashArray: "3,3",
          interactive: false
        }).addTo(state.labelGroup);
      }
      
      let cardClass = hasMoved ? "leader-marker-card" : (state.labelMode === "compact" ? "static-marker-card compact" : "static-marker-card");
      let icon = L.divIcon({
        className: "static-map-marker",
        html: `<div class="${cardClass}">${l.html}</div>`,
        iconSize: [l.w, l.h],
        iconAnchor: [l.w/2, l.h/2]
      });
      L.marker(targetPos, { icon: icon, interactive: false }).addTo(state.labelGroup);
    });
  }

  // --- 11. Legend Renderer ---
  function renderLegend() {
    const container = document.getElementById("legend-items-container");
    const unitEl = document.getElementById("display-legend-unit");
    unitEl.textContent = state.unit;
    container.innerHTML = "";

    const breaks = state.computedBreaks;
    if (!breaks || breaks.length < 2) {
      container.innerHTML = `<div class="text-muted p-2" style="font-size:0.8rem; text-align:center;">データ未読み込み</div>`;
      return;
    }

    const numClasses = breaks.length - 1;

    for (let i = 0; i < numClasses; i++) {
      let bMin = breaks[i];
      let bMax = breaks[i + 1];

      let strMin = formatNumber(bMin);
      let strMax = formatNumber(bMax);
      let rangeLabel = `${strMin} ～ ${strMax}`;

      let midVal = (bMin + bMax) / 2;
      let color = getColorForValue(midVal);

      // Count municipalities in this range
      let count = 0;
      Object.values(getEffectiveValues()).forEach(v => {
        if (typeof v === 'number' && !isNaN(v)) {
          if (i === numClasses - 1) {
            if (v >= bMin && v <= bMax) count++;
          } else {
            if (v >= bMin && v < bMax) count++;
          }
        }
      });

      let itemDiv = document.createElement("div");
      itemDiv.className = "legend-item";
      itemDiv.innerHTML = `
        <div class="legend-swatch-label">
          <span class="legend-swatch" style="overflow:hidden;">
            <svg width="100%" height="100%" style="display:block;"><rect width="100%" height="100%" fill="${color}" /></svg>
          </span>
          <span class="legend-range-text">${rangeLabel}</span>
        </div>
        <span class="legend-count-badge">${count}</span>
      `;
      container.appendChild(itemDiv);
    }
  }

  function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return "-";
    if (Math.abs(num) >= 10000) {
      let val = (num / 10000);
      return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)) + "万";
    }
    if (Math.abs(num) < 10 && num % 1 !== 0) {
      return num.toFixed(2);
    }
    return (num % 1 === 0) ? num.toLocaleString() : num.toFixed(1);
  }

  // --- 12. Statistics Engine ---
  function updateStatsSummary() {
    const vals = Object.entries(getEffectiveValues())
      .filter(([name, v]) => typeof v === 'number' && !isNaN(v));

    const countEl = document.getElementById("stat-count");
    const sumEl = document.getElementById("stat-sum");
    const meanEl = document.getElementById("stat-mean");
    const medianEl = document.getElementById("stat-median");
    const maxEl = document.getElementById("stat-max");
    const minEl = document.getElementById("stat-min");

    countEl.textContent = `${vals.length} / 40`;
    countEl.className = vals.length === 40 ? "stat-value text-blue" : "stat-value text-orange";

    if (vals.length === 0) {
      sumEl.textContent = "-";
      meanEl.textContent = "-";
      medianEl.textContent = "-";
      maxEl.textContent = "-";
      minEl.textContent = "-";
      return;
    }

    const numList = vals.map(v => v[1]).sort((a, b) => a - b);
    const sum = numList.reduce((a, b) => a + b, 0);
    const mean = sum / numList.length;
    
    let median = 0;
    let mid = Math.floor(numList.length / 2);
    if (numList.length % 2 === 0) {
      median = (numList[mid - 1] + numList[mid]) / 2;
    } else {
      median = numList[mid];
    }

    // Find max & min municipalities
    let maxEntry = vals.reduce((prev, curr) => (curr[1] > prev[1]) ? curr : prev, vals[0]);
    let minEntry = vals.reduce((prev, curr) => (curr[1] < prev[1]) ? curr : prev, vals[0]);

    sumEl.textContent = formatNumber(sum);
    meanEl.textContent = formatNumber(mean);
    medianEl.textContent = formatNumber(median);
    
    maxEl.textContent = `${formatNumber(maxEntry[1])} (${maxEntry[0]})`;
    maxEl.title = `${maxEntry[0]}: ${maxEntry[1].toLocaleString()}`;
    
    minEl.textContent = `${formatNumber(minEntry[1])} (${minEntry[0]})`;
    minEl.title = `${minEntry[0]}: ${minEntry[1].toLocaleString()}`;
  }

  // --- 13. Municipality Detail Popup Card ---
  function showMunicipalityDetail(muniName) {
    const card = document.getElementById("municipality-detail-card");
    const nameEl = document.getElementById("detail-muni-name");
    const valEl = document.getElementById("detail-muni-val");
    const unitEl = document.getElementById("detail-muni-unit");
    const extraEl = document.getElementById("detail-muni-extra");

    const val = getEffectiveValues()[muniName];
    if (val === undefined || val === null || isNaN(val)) {
      nameEl.textContent = muniName;
      valEl.innerHTML = `データなし`;
      extraEl.textContent = "未入力";
      card.classList.remove("hidden");
      return;
    }

    // Calculate Rank and Percentage of Total
    const allVals = Object.entries(getEffectiveValues())
      .filter(([n, v]) => typeof v === 'number' && !isNaN(v))
      .sort((a, b) => b[1] - a[1]);

    let rank = allVals.findIndex(item => item[0] === muniName) + 1;
    let total = allVals.reduce((acc, curr) => acc + curr[1], 0);
    let pct = total > 0 ? ((val / total) * 100).toFixed(1) : "0";

    nameEl.textContent = muniName;
    valEl.innerHTML = `${val.toLocaleString()} <small id="detail-muni-unit">${state.unit}</small>`;
    extraEl.textContent = `順位: ${rank}位 / ${allVals.length}自治体 (構成比: ${pct}%)`;

    card.classList.remove("hidden");

    // Also highlight corresponding row in table if visible
    document.querySelectorAll(".data-table tr").forEach(tr => {
      if (tr.getAttribute("data-name") === muniName) {
        tr.classList.add("highlighted");
        tr.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        tr.classList.remove("highlighted");
      }
    });
  }

  // --- 14. Data Table Inline Editor ---
  function updateDataTable() {
    const tbody = document.getElementById("data-table-body");
    tbody.innerHTML = "";

    let matchedCount = 0;
    const filterQuery = (document.getElementById("table-search")?.value || "").trim().toLowerCase();

    let visibleCount = 0;

    AOMORI_MUNICIPALITIES.forEach(m => {
      let isVisible = true;
      if (filterQuery) {
        let matchName = m.name.toLowerCase().includes(filterQuery);
        let matchCode = m.code.includes(filterQuery);
        let matchType = m.type.includes(filterQuery);
        isVisible = matchName || matchCode || matchType;
      }

      let val = getEffectiveValues()[m.name];
      let hasVal = (val !== undefined && val !== null && !isNaN(val));
      if (hasVal) matchedCount++;

      let tr = document.createElement("tr");
      tr.setAttribute("data-name", m.name);
      if (!isVisible) {
        tr.style.display = "none";
      } else {
        visibleCount++;
      }

      let valInputStr = hasVal ? val : "";

      tr.innerHTML = `
        <td style="text-align:center;">
          ${hasVal ? '<i class="fa-solid fa-circle-check text-green" title="入力済"></i>' : '<i class="fa-solid fa-circle-minus text-muted" title="未入力"></i>'}
        </td>
        <td style="font-family:var(--font-mono); color:#64748b; font-size:0.75rem;">${m.code}</td>
        <td>
          <strong>${m.name}</strong>
        </td>
        <td style="text-align:center;">
          <span class="badge ${m.type === '市' ? 'badge-primary' : 'badge-secondary'}" style="background:#f1f5f9; color:#475569; border:1px solid #e2e8f0;">${m.type}</span>
        </td>
        <td style="text-align:right;">
          <input type="text" inputmode="decimal" class="cell-val-input ${hasVal ? '' : 'is-empty'}" data-name="${m.name}" value="${valInputStr}" placeholder="未入力">
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Bind real-time input change to each cell
    tbody.querySelectorAll(".cell-val-input").forEach(input => {
      input.addEventListener("input", (e) => {
        let name = e.target.getAttribute("data-name");
        let rawVal = e.target.value.replace(/,/g, "").trim();
        if (rawVal === "") {
          delete state.currentValues[name];
          e.target.classList.add("is-empty");
        } else {
          let num = parseFloat(rawVal);
          if (!isNaN(num)) {
            state.currentValues[name] = num;
            e.target.classList.remove("is-empty");
          }
        }
        renderGeoJSONLayer();
        updateTableStatusBadges();
        updateStatsSummary();
      });
    });

    const badge = document.getElementById("match-badge");
    if (badge) {
      badge.textContent = `${matchedCount} / 40 入力済`;
      badge.className = matchedCount === 40 ? "badge badge-success" : "badge badge-warning";
    }

    const filterLabel = document.getElementById("filtered-count-label");
    if (filterLabel) {
      filterLabel.textContent = filterQuery ? `絞り込み結果: ${visibleCount} / 40 自治体` : `全40自治体を表示中`;
    }
  }

  function updateTableStatusBadges() {
    let matchedCount = 0;
    document.querySelectorAll(".data-table tbody tr").forEach(tr => {
      let name = tr.getAttribute("data-name");
      let val = state.currentValues[name];
      let hasVal = (val !== undefined && val !== null && !isNaN(val));
      if (hasVal) matchedCount++;

      let statusTd = tr.querySelector("td:first-child");
      if (statusTd) {
        statusTd.innerHTML = hasVal 
          ? '<i class="fa-solid fa-circle-check text-green" title="入力済"></i>' 
          : '<i class="fa-solid fa-circle-minus text-muted" title="未入力"></i>';
      }
    });

    const badge = document.getElementById("match-badge");
    if (badge) {
      badge.textContent = `${matchedCount} / 40 入力済`;
      badge.className = matchedCount === 40 ? "badge badge-success" : "badge badge-warning";
    }
  }

  // --- 16. CSV Parsing & Multi-Variable Importing ---
  function parseCSVFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      parseRawText(e.target.result);
    };
    reader.readAsText(file, "utf-8");
  }

  function parseRawText(rawText) {
    if (!rawText || !rawText.trim()) return;
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    // Check if first line is a CSV header with multiple columns
    let firstLine = lines[0];
    let sep = firstLine.includes("\t") ? "\t" : ",";
    let headerParts = firstLine.split(sep).map(s => s.trim().replace(/^["']|["']$/g, ""));

    // Check if header contains municipality column
    let nameColIdx = headerParts.findIndex(h => /市町村|自治体|名称|市区町村|name/i.test(h));
    if (nameColIdx === -1) {
      nameColIdx = headerParts.length > 1 && /コード|code|id/i.test(headerParts[0]) ? 1 : 0;
    }

    // Determine value columns (excluding Code, Type, etc.)
    let valCols = [];
    headerParts.forEach((colName, idx) => {
      if (idx !== nameColIdx && !/コード|code|id|区分|type/i.test(colName)) {
        valCols.push({ idx: idx, name: colName });
      }
    });

    if (valCols.length > 1) {
      // Multi-variable CSV detected!
      let addedKeys = [];
      valCols.forEach(col => {
        let varKey = "custom_" + col.name.replace(/[^a-zA-Z0-9_\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/g, "_");
        let varData = {};
        for (let i = 1; i < lines.length; i++) {
          let parts = lines[i].split(sep).map(s => s.trim().replace(/[,\s"']/g, ""));
          let nameCand = parts[nameColIdx];
          let matched = normalizeName(nameCand);
          if (matched && parts[col.idx] !== undefined) {
            let num = parseFloat(parts[col.idx]);
            if (!isNaN(num)) varData[matched] = num;
          }
        }
        if (Object.keys(varData).length > 0) {
          state.variables[varKey] = {
            id: varKey,
            name: col.name,
            label: `📁 ${col.name}`,
            unit: "",
            title: `青森県 市町村別 ${col.name}`,
            subtitle: "CSV取り込みデータに基づく可視化",
            remarks: "※ 出典：インポートされたCSVデータ",
            palette: "blues",
            data: varData
          };
          addedKeys.push(varKey);
        }
      });

      if (addedKeys.length > 0) {
        populateVariableDropdowns();
        openVariableModal(addedKeys[0]);
        showToast(`${addedKeys.length} 項目の変数を検出しました。作図する項目を選択してください。`, "info");
        return;
      }
    }

    // Single variable import (standard two-column list or line-by-line)
    const newVals = {};
    let count = 0;
    lines.forEach(line => {
      let parts = line.split(/[\t,;]+/);
      if (parts.length >= 2) {
        let nameCandidate = parts[0].trim();
        let valCandidate = parts[1].trim().replace(/[,\s"']/g, "");
        let matched = normalizeName(nameCandidate);
        let num = parseFloat(valCandidate);

        if (!matched && isNaN(num) && parts.length >= 2) {
          let altName = parts[1].trim();
          let altVal = parts[0].trim().replace(/[,\s"']/g, "");
          matched = normalizeName(altName);
          num = parseFloat(altVal);
        }

        if (matched && !isNaN(num)) {
          newVals[matched] = num;
          count++;
        }
      }
    });

    if (count > 0) {
      const varKey = "custom_data";
      state.variables = {};
      state.variables[varKey] = {
        id: varKey,
        name: "取り込みデータ",
        label: "📁 取り込みデータ",
        unit: "",
        title: "青森県 市町村別統計マップ",
        subtitle: "取り込みデータに基づく可視化",
        remarks: "※ ユーザー入力データ",
        palette: "blues",
        data: newVals
      };
      populateVariableDropdowns();
      switchActiveVariable(varKey, false);
      showToast(`${count} 自治体の数値を取り込みました`, "success");
    } else {
      showToast("市町村名と数値の解析に失敗しました。フォーマットをご確認ください。", "error");
    }
  }

  // Download Empty Template CSV with UTF-8 BOM
  function downloadCSVTemplate() {
    let csv = "\uFEFF自治体コード,市町村名,区分,数値\n";
    AOMORI_MUNICIPALITIES.forEach(m => {
      csv += `${m.code},${m.name},${m.type},\n`;
    });

    triggerFileDownload(csv, "aomori_municipalities_template.csv", "text/csv;charset=utf-8;");
    showToast("CSVテンプレートをダウンロードしました", "success");
  }

  // Export Current Data as CSV
  function exportCurrentCSV() {
    const curVar = state.variables[state.activeVariableKey];
    const colName = curVar ? curVar.name : "数値";
    let csv = `\uFEFF自治体コード,市町村名,区分,${colName}\n`;
    AOMORI_MUNICIPALITIES.forEach(m => {
      let v = getEffectiveValues()[m.name];
      let valStr = (v !== undefined && v !== null && !isNaN(v)) ? v : "";
      csv += `${m.code},${m.name},${m.type},${valStr}\n`;
    });

    const filename = `aomori_${state.activeVariableKey}_${Date.now()}.csv`;
    triggerFileDownload(csv, filename, "text/csv;charset=utf-8;");
    showToast("現在のデータをCSVで書き出しました", "success");
  }

  function triggerFileDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- 17. PNG Image Exporter & Clipboard API ---
  async function generateMapPNGData() {
    const frame = document.getElementById("export-map-frame");
    const chkLabels = document.getElementById("chk-export-labels");
    const chkLegend = document.getElementById("chk-export-legend");
    const legendBox = document.getElementById("map-legend");
    const zoomControls = document.querySelectorAll(".leaflet-control-zoom");
    const detailCard = document.getElementById("municipality-detail-card");

    const includeLabels = chkLabels ? chkLabels.checked : true;
    const includeLegend = chkLegend ? chkLegend.checked : true;

    const prevLabelMode = state.labelMode;

    // Temporarily hide UI controls from image
    zoomControls.forEach(el => el.style.display = "none");
    if (detailCard) detailCard.classList.add("hidden");

    try {
      if (!includeLabels) {
        if (state.labelGroup) state.labelGroup.clearLayers();
      }

      if (!includeLegend && legendBox) legendBox.style.display = "none";

      if (state.geojsonLayer && state.leafletMap) {
        state.leafletMap.invalidateSize({ animate: false });
      }

      await new Promise(resolve => setTimeout(resolve, 200));

      const scale = parseInt(state.exportScale, 10) || 3;
      const bgColor = (state.mapBg === "transparent") ? null : (state.mapBg === "minimal-dark" ? "#0f172a" : "#ffffff");

      // Standard A4 Landscape dimensions (297:210)
      // Scale 3: 3508 x 2480 px (300 DPI print quality)
      // Scale 2: 1754 x 1240 px (150 DPI presentation quality)
      // Scale 1: 1188 x 840 px (72 DPI screen quality)
      const frameRect = frame.getBoundingClientRect();
      const targetWidth = (scale === 3) ? 3508 : (scale === 2 ? 1754 : 1188);
      const pixelRatio = (frameRect.width > 0) ? (targetWidth / frameRect.width) : scale;

      let dataUrl = "";
      let blob = null;

      if (window.htmlToImage) {
        dataUrl = await window.htmlToImage.toPng(frame, {
          pixelRatio: pixelRatio,
          skipFonts: true,
          backgroundColor: bgColor,
          filter: (node) => {
            if (node.classList && (
              node.classList.contains("leaflet-control-zoom") ||
              node.classList.contains("floating-map-controls") ||
              node.classList.contains("municipality-detail-card")
            )) {
              return false;
            }
            return true;
          }
        });
        blob = await window.htmlToImage.toBlob(frame, {
          pixelRatio: pixelRatio,
          skipFonts: true,
          backgroundColor: bgColor,
          filter: (node) => {
            if (node.classList && (
              node.classList.contains("leaflet-control-zoom") ||
              node.classList.contains("floating-map-controls") ||
              node.classList.contains("municipality-detail-card")
            )) {
              return false;
            }
            return true;
          }
        });
      } else if (window.html2canvas) {
        const canvas = await window.html2canvas(frame, {
          scale: pixelRatio,
          useCORS: true,
          logging: false,
          backgroundColor: bgColor
        });
        dataUrl = canvas.toDataURL("image/png");
        blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      } else {
        throw new Error("画像生成ライブラリ (html-to-image) が読み込まれていません");
      }

      return { dataUrl, blob };
    } finally {
      zoomControls.forEach(el => el.style.display = "");
      if (legendBox) legendBox.style.display = "";
      if (state.labelMode !== prevLabelMode) state.labelMode = prevLabelMode;
      renderLabelsLayer();
    }
  }

  async function exportMapPNG() {
    const exportBtns = [
      document.getElementById("btn-export-png-header"),
      document.getElementById("btn-export-png-tab")
    ].filter(Boolean);

    exportBtns.forEach(b => {
      b.disabled = true;
      b.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 生成中...`;
    });

    try {
      const { dataUrl } = await generateMapPNGData();
      const filename = `Aomori_Choropleth_${Date.now()}.png`;
      
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("PNG画像を保存しました", "success");
    } catch (err) {
      console.error("PNG export error:", err);
      showToast("PNG画像の保存に失敗しました: " + err.message, "error");
    } finally {
      exportBtns.forEach(b => {
        b.disabled = false;
        b.innerHTML = `<i class="fa-solid fa-download"></i> マップ保存 (PNG)`;
      });
    }
  }

  async function copyMapPNGToClipboard() {
    const copyBtns = [
      document.getElementById("btn-copy-png-header"),
      document.getElementById("btn-copy-png-tab")
    ].filter(Boolean);

    copyBtns.forEach(b => {
      b.disabled = true;
      b.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> コピー中...`;
    });

    try {
      const { blob } = await generateMapPNGData();
      
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast("PNG画像をクリップボードにコピーしました！ WordやPowerPointにそのまま貼り付けできます", "success");
      } else {
        throw new Error("お使いのブラウザはクリップボード画像コピーに対応していません");
      }
    } catch (err) {
      console.error("Clipboard copy error:", err);
      showToast("クリップボードへのコピーに失敗しました: " + err.message, "error");
    } finally {
      copyBtns.forEach(b => {
        b.disabled = false;
        b.innerHTML = `<i class="fa-regular fa-copy"></i> 画像コピー`;
      });
    }
  }

  // --- 18. Toast Notifications ---
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "fa-circle-info";
    if (type === "success") icon = "fa-circle-check";
    if (type === "error") icon = "fa-circle-exclamation";

    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- 19. Event Bindings ---
  function bindEvents() {
    // Step navigation
    document.getElementById("btn-next-step").addEventListener("click", () => {
      document.getElementById("step1-data").style.display = "none";
      const step2 = document.getElementById("step2-map");
      step2.style.display = "flex";
      step2.style.flex = "1";
      step2.style.width = "100%";
      step2.style.height = "100%";

      // Initialize map if not yet created, or resize and re-fit
      requestAnimationFrame(() => {
        if (!state.leafletMap) {
          initLeafletMap();
        } else {
          state.leafletMap.invalidateSize({ animate: false });
        }
        renderGeoJSONLayer();
        
        setTimeout(() => {
          if (state.leafletMap) {
            state.leafletMap.invalidateSize({ animate: false });
            fitMapToBounds(REGION_BOUNDS[state.activeRegion] || REGION_BOUNDS.all);
          }
        }, 50);
      });
    });

    document.getElementById("btn-prev-step").addEventListener("click", () => {
      document.getElementById("step2-map").style.display = "none";
      document.getElementById("step1-data").style.display = "block";
      updateDataTable();
    });

    // Panel Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-page").forEach(p => p.classList.remove("active"));

        let tabId = btn.getAttribute("data-tab");
        btn.classList.add("active");
        let page = document.getElementById(tabId);
        if (page) page.classList.add("active");
      });
    });

    // Variable Selection Synchronization (Step 1, Step 2, and Header)
    ["select-variable-step1", "select-variable-step2", "select-variable-header"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", (e) => {
          if (e.target.value) {
            switchActiveVariable(e.target.value, true);
          }
        });
      }
    });

    // Subtle Verification Preset Button in CSV card
    const btnPresetSubtle = document.getElementById("btn-load-preset-subtle");
    if (btnPresetSubtle) {
      btnPresetSubtle.addEventListener("click", loadEstatSampleData);
    }

    // Step 1 Modal Open Button
    const btnOpenModal = document.getElementById("btn-open-var-modal-step1");
    if (btnOpenModal) {
      btnOpenModal.addEventListener("click", () => openVariableModal());
    }

    // Variable Modal Close & Confirm
    const btnCloseModal = document.getElementById("btn-close-var-modal");
    if (btnCloseModal) {
      btnCloseModal.addEventListener("click", closeVariableModal);
    }

    const btnConfirmModal = document.getElementById("btn-confirm-var-modal");
    if (btnConfirmModal) {
      btnConfirmModal.addEventListener("click", confirmVariableModal);
    }

    // Header Reset Button (Restores Initial Empty State)
    const resetBtn = document.getElementById("btn-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        initEmptyState();
        showToast("初期状態（未読み込み）にリセットしました", "info");
      });
    }

    // Table Search Filter
    const searchInput = document.getElementById("table-search");
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        updateDataTable();
      });
    }

    // Clear values
    document.getElementById("btn-clear-values").addEventListener("click", () => {
      state.currentValues = {};
      updateDataTable();
      renderGeoJSONLayer();
      showToast("すべての数値をクリアしました", "info");
    });

    // Template & CSV Exports
    document.getElementById("btn-dl-template").addEventListener("click", downloadCSVTemplate);
    document.getElementById("btn-export-csv").addEventListener("click", exportCurrentCSV);
    const exportCsvTab = document.getElementById("btn-export-csv-tab");
    if (exportCsvTab) exportCsvTab.addEventListener("click", exportCurrentCSV);
    const chkPerCapita = document.getElementById("chk-per-capita");
    if (chkPerCapita) {
      chkPerCapita.addEventListener("change", (e) => {
        state.isPerCapitaMode = e.target.checked;
        if (state.isPerCapitaMode) {
          state.unit = state.unit ? state.unit.replace("単位：", "単位：") + " (10万人あたり)" : "単位：人/10万人";
        } else {
          const v = state.variables[state.activeVariableKey];
          state.unit = v && v.unit ? `単位：${v.unit}` : "";
        }
        const displayUnit = document.getElementById("display-legend-unit");
        const unitInput = document.getElementById("map-unit-input");
        if (displayUnit) displayUnit.textContent = state.unit;
        if (unitInput) unitInput.value = state.unit;
        
        updateDataTable();
        renderGeoJSONLayer();
        updateStatsSummary();
      });
    }

    // File Drag & Drop
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");

    dropZone.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) {
        parseCSVFile(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        parseCSVFile(e.target.files[0]);
      }
    });

    // Paste Text Apply
    document.getElementById("btn-apply-paste").addEventListener("click", () => {
      let text = document.getElementById("raw-paste-input").value;
      parseRawText(text);
    });

    // Palette Selector
    document.querySelectorAll(".palette-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".palette-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.paletteKey = btn.getAttribute("data-palette");
        state.useCustomGradient = false;
        document.getElementById("chk-use-custom-gradient").checked = false;
        document.getElementById("custom-color-pickers").classList.add("hidden");
        renderGeoJSONLayer();
      });
    });

    // Custom Gradient
    const chkCustomGrad = document.getElementById("chk-use-custom-gradient");
    const customPickers = document.getElementById("custom-color-pickers");
    chkCustomGrad.addEventListener("change", (e) => {
      state.useCustomGradient = e.target.checked;
      customPickers.classList.toggle("hidden", !state.useCustomGradient);
      if (state.useCustomGradient) {
        document.querySelectorAll(".palette-btn").forEach(b => b.classList.remove("active"));
      }
      renderGeoJSONLayer();
    });

    const startColorInput = document.getElementById("color-picker-start");
    const endColorInput = document.getElementById("color-picker-end");
    startColorInput.addEventListener("input", (e) => {
      state.customStartColor = e.target.value;
      if (state.useCustomGradient) renderGeoJSONLayer();
    });
    endColorInput.addEventListener("input", (e) => {
      state.customEndColor = e.target.value;
      if (state.useCustomGradient) renderGeoJSONLayer();
    });

    // Palette Invert
    document.getElementById("chk-invert-palette").addEventListener("change", (e) => {
      state.invertPalette = e.target.checked;
      renderGeoJSONLayer();
    });

    // Binning Mode Radios
    document.querySelectorAll('input[name="binning-mode"]').forEach(radio => {
      radio.addEventListener("change", (e) => {
        state.binningMode = e.target.value;
        const stepWrapper = document.getElementById("step-count-wrapper");
        const customWrapper = document.getElementById("custom-breaks-wrapper");

        if (state.binningMode === "custom") {
          stepWrapper.classList.add("hidden");
          customWrapper.classList.remove("hidden");
        } else {
          stepWrapper.classList.remove("hidden");
          customWrapper.classList.add("hidden");
        }
        renderGeoJSONLayer();
      });
    });

    // Step Count Slider
    const stepSlider = document.getElementById("step-count-slider");
    const stepVal = document.getElementById("step-count-value");
    stepSlider.addEventListener("input", (e) => {
      state.stepCount = parseInt(e.target.value, 10);
      stepVal.textContent = `${state.stepCount} 段階`;
      renderGeoJSONLayer();
    });

    // Custom Breaks Apply
    document.getElementById("btn-apply-breaks").addEventListener("click", () => {
      let val = document.getElementById("custom-breaks-input").value;
      let nums = val.split(/[,;\s]+/).map(v => parseFloat(v)).filter(v => !isNaN(v));
      state.customBreaks = nums;
      renderGeoJSONLayer();
      showToast("手動刻みを適用しました", "success");
    });

    // Background Canvas Select
    document.getElementById("select-map-bg").addEventListener("change", (e) => {
      state.mapBg = e.target.value;
      updateMapBackgroundTile();
    });

    // Stroke Color Select
    document.getElementById("select-stroke-color").addEventListener("change", (e) => {
      state.strokeColor = e.target.value;
      renderGeoJSONLayer();
    });

    // Stroke Opacity Slider
    const strokeSlider = document.getElementById("stroke-opacity-slider");
    const strokeVal = document.getElementById("stroke-opacity-value");
    strokeSlider.addEventListener("input", (e) => {
      state.strokeOpacity = parseFloat(e.target.value);
      if (strokeVal) strokeVal.textContent = state.strokeOpacity;
      if (state.geojsonLayer) {
        state.geojsonLayer.setStyle({ opacity: state.strokeOpacity });
      }
    });

    // Title / Subtitle / Unit / Remarks Live Updates
    const titleInput = document.getElementById("map-title-input");
    const subTitleInput = document.getElementById("map-subtitle-input");
    const unitInput = document.getElementById("map-unit-input");
    const remarksInput = document.getElementById("map-remarks-input");

    titleInput.addEventListener("input", (e) => {
      state.title = e.target.value;
      document.getElementById("display-map-title").textContent = state.title;
    });

    subTitleInput.addEventListener("input", (e) => {
      state.subtitle = e.target.value;
      document.getElementById("display-map-subtitle").textContent = state.subtitle;
    });

    unitInput.addEventListener("input", (e) => {
      state.unit = e.target.value;
      document.getElementById("display-legend-unit").textContent = state.unit;
      renderLegend();
    });

    remarksInput.addEventListener("input", (e) => {
      state.remarks = e.target.value;
      document.getElementById("display-map-remarks").textContent = state.remarks;
    });

    // Title & Remarks Display Checkboxes
    const chkTitle = document.getElementById("chk-show-title");
    const chkRemarks = document.getElementById("chk-show-remarks");
    const headerEl = document.querySelector(".map-overlay-header");
    const footerEl = document.querySelector(".map-overlay-footer");

    chkTitle.addEventListener("change", (e) => {
      headerEl.style.display = e.target.checked ? "block" : "none";
    });

    chkRemarks.addEventListener("change", (e) => {
      footerEl.style.display = e.target.checked ? "block" : "none";
    });

    // Label Mode Select
    document.getElementById("select-label-mode").addEventListener("change", (e) => {
      state.labelMode = e.target.value;
      const labelContentGroup = document.getElementById("label-content-group");
      if (labelContentGroup) {
        labelContentGroup.style.display = (state.labelMode === "none") ? "none" : "block";
      }
      renderLabelsLayer();
    });

    // Label Content Select
    document.querySelectorAll('input[name="labelContent"]').forEach(el => {
      el.addEventListener("change", (e) => {
        state.labelContent = e.target.value;
        renderLabelsLayer();
      });
    });

    // Legend Position Select
    document.getElementById("legend-position-select").addEventListener("change", (e) => {
      state.legendPosition = e.target.value;
      const legendBox = document.getElementById("map-legend");
      legendBox.className = `map-legend-box position-${state.legendPosition}`;
    });

    // Export Scale Select
    const scaleSelect = document.getElementById("select-export-scale");
    if (scaleSelect) {
      scaleSelect.addEventListener("change", (e) => {
        state.exportScale = parseInt(e.target.value, 10);
      });
    }

    // Region Zoom Select Handler & Synchronization
    function handleRegionChange(region) {
      state.activeRegion = region;
      const bounds = REGION_BOUNDS[region] || REGION_BOUNDS.all;
      fitMapToBounds(bounds);

      const rZoom = document.getElementById("select-region-zoom");
      const rSide = document.getElementById("select-sidebar-region");
      if (rZoom) rZoom.value = region;
      if (rSide) rSide.value = region;

      const labels = {
        "all": "青森県全域（40市町村）",
        "tsugaru": "津軽地域（19市町村）",
        "sanpachi": "三八地域（八戸市・三戸郡 7市町村）",
        "kamikita": "上北・上十三地域（9市町村）",
        "shimokita": "下北地域（5市町村）",
        "nanbu": "県南全体（三八・上北 16市町村）"
      };
      showToast(`${labels[region] || region} にズームしました`, "info");
    }

    const regionSelect = document.getElementById("select-region-zoom");
    if (regionSelect) {
      regionSelect.addEventListener("change", (e) => handleRegionChange(e.target.value));
    }

    const regionSideSelect = document.getElementById("select-sidebar-region");
    if (regionSideSelect) {
      regionSideSelect.addEventListener("change", (e) => handleRegionChange(e.target.value));
    }

    // Theme Toggle Button
    const themeBtn = document.getElementById("btn-toggle-theme");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        state.mapBg = (state.mapBg === "minimal-dark") ? "none" : "minimal-dark";
        document.getElementById("select-map-bg").value = state.mapBg;
        updateMapBackgroundTile();
      });
    }

    // Detail Card Close Button
    const closeDetailBtn = document.getElementById("btn-close-detail-card");
    if (closeDetailBtn) {
      closeDetailBtn.addEventListener("click", () => {
        document.getElementById("municipality-detail-card").classList.add("hidden");
      });
    }

    // Fit All Bounds Button
    const fitBoundsBtn = document.getElementById("btn-fit-bounds");
    if (fitBoundsBtn) {
      fitBoundsBtn.addEventListener("click", () => handleRegionChange("all"));
    }

    // Export & Copy PNG Buttons
    ["btn-export-png-header", "btn-export-png-tab"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", exportMapPNG);
    });

    ["btn-copy-png-header", "btn-copy-png-tab"].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", copyMapPNGToClipboard);
    });
  }

})();
