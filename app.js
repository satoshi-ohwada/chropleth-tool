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
    // Dedicated Z-score / Diverging Palettes
    div_blue_red: ["#2166ac", "#67a9cf", "#d1e5f0", "#f7f7f7", "#fddbc7", "#ef8a62", "#b2182b"],
    div_red_blue: ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
    div_orange_purple: ["#b35806", "#f1a340", "#fee0b6", "#f7f7f7", "#d8daeb", "#998ec3", "#542788"],
    div_brown_teal: ["#8c510a", "#d8b365", "#f6e8c3", "#f5f5f5", "#c7eae5", "#5ab4ac", "#01665e"],
    div_spectral: ["#d53e4f", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#2b83ba"],
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
    strokeColor: "dark", // Uniform dark slate border by default for crisp consistent lines
    showOuterBorder: false,
    labelMode: "none",
    labelContent: "name_val",
    legendPosition: "rightmiddle",
    exportScale: 3,
    activeRegion: "all",
    leafletMap: null,
    geojsonLayer: null,
    outerBorderLayer: null,
    labelGroup: null,
    dynamicCentroids: {},
    computedBreaks: [],
    selectedMuni: null,
    miniMap: null,
    miniMapLayer: null,
    transformMode: "raw", // 'raw' | 'per_capita' | 'zscore' | 'tscore'
    perCapitaMultiplier: 10000,
    exportFormat: "png" // 'png' | 'svg'
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

  // Load preset datasets (nenkan100 or sugata2026)
  function loadPresetData(presetKey = "nenkan100") {
    let filePath = "./data/sugata2026.csv";
    let presetTitle = "「統計でみる市区町村のすがた 2026」";
    let detailNote = "（主要33指標）";

    if (presetKey === "nenkan100") {
      filePath = "./data/nenkan_data100.csv";
      presetTitle = "「R8青森県統計年鑑 市町村データ100」";
      detailNote = "（全100項目）";
    }

    fetch(filePath)
      .then(res => {
        if (!res.ok) throw new Error("Preset data load failed");
        return res.text();
      })
      .then(text => {
        parseRawText(text, presetTitle);
        showToast(`${presetTitle} データを読み込みました。${detailNote}`, "info");
      })
      .catch(err => {
        console.error(err);
        showToast("プリセットデータの読み込みに失敗しました", "error");
      });
  }
  
  function getEffectiveValues() {
    let baseVals = {};
    if (state.transformMode === "per_capita" || state.isPerCapitaMode) {
      for (let key in state.currentValues) {
        let val = state.currentValues[key];
        let base = state.baselinePopulation[key];
        if (typeof val === 'number' && typeof base === 'number' && base > 0) {
          baseVals[key] = (val / base) * (state.perCapitaMultiplier || 100);
        } else {
          baseVals[key] = val;
        }
      }
    } else {
      baseVals = { ...state.currentValues };
    }

    if (state.transformMode === "zscore" || state.transformMode === "tscore") {
      const validNums = Object.values(baseVals).filter(v => typeof v === 'number' && !isNaN(v));
      if (validNums.length < 2) return baseVals;

      const sum = validNums.reduce((a, b) => a + b, 0);
      const mean = sum / validNums.length;
      const variance = validNums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (validNums.length - 1 || 1);
      const sd = Math.sqrt(variance) || 1;

      let transformed = {};
      for (let key in baseVals) {
        let v = baseVals[key];
        if (typeof v === 'number' && !isNaN(v)) {
          let z = (v - mean) / sd;
          if (state.transformMode === "zscore") {
            transformed[key] = Math.round(z * 100) / 100;
          } else {
            transformed[key] = Math.round((50 + 10 * z) * 10) / 10;
          }
        } else {
          transformed[key] = v;
        }
      }
      return transformed;
    }

    return baseVals;
  }

  function getEffectiveUnit() {
    if (state.transformMode === "zscore") return "Zスコア (平均=0, SD=1)";
    if (state.transformMode === "tscore") return "偏差値 (平均=50, SD=10)";
    if (state.transformMode === "per_capita") {
      const mult = state.perCapitaMultiplier || 100;
      return mult === 1 ? "1人あたり" : mult === 100 ? "100人あたり(％)" : mult === 1000 ? "1,000人あたり" : `${mult.toLocaleString()}人あたり`;
    }
    return state.unit || "";
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
  const ALIAS_TO_STANDARD = {
    // Hiragana / Katakana
    "あおもり": "青森市", "アオモリ": "青森市",
    "ひろさき": "弘前市", "ヒロサキ": "弘前市",
    "はちのへ": "八戸市", "ハチノヘ": "八戸市",
    "くろいし": "黒石市", "クロイシ": "黒石市",
    "ごしょがわら": "五所川原市", "ゴショガワラ": "五所川原市",
    "とわだ": "十和田市", "トワダ": "十和田市",
    "みさわ": "三沢市", "ミサワ": "三沢市",
    "むつ": "むつ市", "ムツ": "むつ市",
    "つがる": "つがる市", "ツガル": "つがる市",
    "ひらかわ": "平川市", "ヒラカワ": "平川市",
    "ひらない": "平内町", "ヒラナイ": "平内町",
    "いまべつ": "今別町", "イマベツ": "今別町",
    "よもぎた": "蓬田村", "ヨモギタ": "蓬田村",
    "そとがはま": "外ヶ浜町", "ソトガハマ": "外ヶ浜町",
    "あじがさわ": "鰺ヶ沢町", "アジガサワ": "鰺ヶ沢町",
    "ふかうら": "深浦町", "フカウラ": "深浦町",
    "にしめや": "西目屋村", "ニシメヤ": "西目屋村",
    "ふじさき": "藤崎町", "フジサキ": "藤崎町",
    "おおわに": "大鰐町", "オオワニ": "大鰐町",
    "いなかだて": "田舎館村", "イナカダテ": "田舎館村",
    "いたやなぎ": "板柳町", "イタヤナギ": "板柳町",
    "つるた": "鶴田町", "ツルタ": "鶴田町",
    "なかどまり": "中泊町", "ナカドマリ": "中泊町",
    "のへじ": "野辺地町", "ノヘジ": "野辺地町",
    "しちのへ": "七戸町", "シチノヘ": "七戸町",
    "ろくのへ": "六戸町", "ロクノヘ": "六戸町",
    "よこはま": "横浜町", "ヨコハマ": "横浜町",
    "とうほく": "東北町", "トウホク": "東北町",
    "ろっかしょ": "六ヶ所村", "ロッカショ": "六ヶ所村",
    "おいらせ": "おいらせ町", "オイラセ": "おいらせ町",
    "おおま": "大間町", "オオマ": "大間町", "オーマ": "大間町",
    "ひがしどおり": "東通村", "ヒガシドオリ": "東通村",
    "かざまうら": "風間浦村", "カザマウラ": "風間浦村",
    "さい": "佐井村", "サイ": "佐井村",
    "さんもへ": "三戸町", "サンモヘ": "三戸町",
    "ごのへ": "五戸町", "ゴノヘ": "五戸町",
    "たっこ": "田子町", "タッコ": "田子町",
    "なんぶ": "南部町", "ナンブ": "南部町",
    "はしかみ": "階上町", "ハシカミ": "階上町",
    "しんごう": "新郷村", "シンゴウ": "新郷村",

    // Former Municipalities (Legacy / Merger Support)
    "浪岡町": "青森市", "浪岡": "青森市",
    "岩木町": "弘前市", "岩木": "弘前市", "相馬村": "弘前市", "相馬": "弘前市",
    "南郷村": "八戸市", "南郷": "八戸市",
    "金木町": "五所川原市", "金木": "五所川原市", "市浦村": "五所川原市", "市浦": "五所川原市",
    "十和田湖町": "十和田市", "十和田湖": "十和田市",
    "川内町": "むつ市", "脇野沢村": "むつ市", "大畑町": "むつ市",
    "木造町": "つがる市", "森田村": "つがる市", "柏村": "つがる市", "稲垣村": "つがる市", "車力村": "つがる市",
    "尾上町": "平川市", "平賀町": "平川市", "碇ヶ関村": "平川市",
    "蟹田町": "外ヶ浜町", "平舘村": "外ヶ浜町", "三厩村": "外ヶ浜町",
    "岩崎村": "深浦町",
    "常盤村": "藤崎町",
    "中里町": "中泊町", "小泊村": "中泊町",
    "天間林村": "七戸町",
    "上北町": "東北町",
    "百石町": "おいらせ町", "下田町": "おいらせ町",
    "名川町": "南部町", "福地村": "南部町",
    "倉石村": "五戸町"
  };

  function normalizeNameInfo(inputName) {
    if (!inputName) return { matched: null, type: "empty", original: "" };
    let orig = String(inputName).trim();
    let s = orig.normalize('NFKC')
      .replace(/^青森県/, "")
      .replace(/[\s\u3000,\.\-"']/g, "");
    
    if (!s) return { matched: null, type: "empty", original: orig };

    // Normalize 'ケ' (large) / 'ｹ' (half-width) to 'ヶ' (small) for matching
    let sCanonical = s.replace(/[ケｹ]/g, "ヶ");

    // 1. Municipality Code Match
    for (let m of AOMORI_MUNICIPALITIES) {
      if (m.code === s || m.code === "0" + s || m.code.slice(1) === s) {
        return { matched: m.name, type: (orig === m.name ? "exact" : "code"), original: orig };
      }
    }

    // 2. Direct Match (with exact or ケ/ヶ normalized)
    for (let m of AOMORI_MUNICIPALITIES) {
      let mCanonical = m.name.replace(/[ケｹ]/g, "ヶ");
      if (m.name === s) {
        return { matched: m.name, type: "exact", original: orig };
      }
      if (mCanonical === sCanonical) {
        return { matched: m.name, type: "corrected", original: orig };
      }
    }

    // 3. Match without Suffix ('市', '町', '村') - Auto-completing missing suffix
    for (let m of AOMORI_MUNICIPALITIES) {
      let base = m.name.replace(/[市町村]$/, "");
      let baseCanonical = base.replace(/[ケｹ]/g, "ヶ");

      if (s === base || sCanonical === baseCanonical) {
        return { matched: m.name, type: "suffix_completed", original: orig };
      }
      if (s === base + "市" || s === base + "町" || s === base + "村" ||
          sCanonical === baseCanonical + "市" || sCanonical === baseCanonical + "町" || sCanonical === baseCanonical + "村") {
        return { matched: m.name, type: "corrected", original: orig };
      }
    }

    // 4. Hiragana / Katakana / Legacy Merger Alias Match
    if (ALIAS_TO_STANDARD[s]) {
      return { matched: ALIAS_TO_STANDARD[s], type: "alias", original: orig };
    }
    if (ALIAS_TO_STANDARD[sCanonical]) {
      return { matched: ALIAS_TO_STANDARD[sCanonical], type: "alias", original: orig };
    }

    return { matched: null, type: "unmatched", original: orig };
  }

  function normalizeName(inputName) {
    return normalizeNameInfo(inputName).matched;
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
    initMiniMap();
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

  function initMiniMap() {
    if (state.miniMap) return;
    const miniEl = document.getElementById("step1-mini-map");
    if (!miniEl) return;

    state.miniMap = L.map("step1-mini-map", {
      zoomControl: false,
      attributionControl: false,
      center: [40.92, 140.75],
      zoom: 8.2,
      zoomSnap: 0.1,
      dragging: true,
      scrollWheelZoom: false,
      doubleClickZoom: false
    });

    renderMiniMapLayer();
  }

  function renderMiniMapLayer() {
    if (!state.miniMap || !state.geojsonData) return;

    if (state.miniMapLayer) {
      state.miniMap.removeLayer(state.miniMapLayer);
    }

    computeBreaks();

    let values = getEffectiveValues();
    const v = state.variables[state.activeVariableKey];
    const lbl = document.getElementById("mini-map-variable-label");
    if (lbl) {
      lbl.textContent = v ? `(${v.name})` : "(データ未選択)";
    }

    state.miniMapLayer = L.geoJSON(state.geojsonData, {
      style: (feature) => {
        let rawName = feature.properties.name || feature.properties.N03_004;
        let matchedName = normalizeName(rawName) || rawName;
        let val = values[matchedName];
        let color = getColorForValue(val);
        let strokeInfo = getBorderStrokeForFeature(color);

        return {
          fillColor: color,
          fillOpacity: 0.85,
          color: strokeInfo.color,
          weight: Math.max(0.8, strokeInfo.weight * 0.7),
          opacity: 0.95
        };
      },
      onEachFeature: (feature, layer) => {
        let rawName = feature.properties.name || feature.properties.N03_004;
        let matchedName = normalizeName(rawName) || rawName;
        let val = values[matchedName];
        let hasVal = (val !== undefined && val !== null && !isNaN(val));
        let displayVal = hasVal ? val.toLocaleString() : "データなし";

        layer.bindTooltip(`
          <div style="font-weight:700; font-size:0.85rem;">${matchedName}</div>
          <div style="color:#60a5fa; font-size:0.78rem;">${displayVal} ${getEffectiveUnit()}</div>
        `, { sticky: true });

        layer.on("click", () => {
          const tr = document.querySelector(`.data-table tbody tr[data-name="${matchedName}"]`);
          if (tr) {
            tr.scrollIntoView({ behavior: "smooth", block: "center" });
            const input = tr.querySelector(".cell-val-input");
            if (input) {
              input.focus();
              input.style.transition = "background 0.3s";
              input.style.backgroundColor = "#fef08a";
              setTimeout(() => {
                input.style.backgroundColor = "";
              }, 1200);
            }
          }
        });
      }
    }).addTo(state.miniMap);

    renderMiniMapLegend();
  }

  function renderMiniMapLegend() {
    const legendEl = document.getElementById("mini-map-legend-bar");
    if (!legendEl) return;

    const breaks = state.computedBreaks;
    if (!breaks || breaks.length < 2) {
      legendEl.innerHTML = `<span class="text-muted">（凡例未生成）</span>`;
      return;
    }

    const numClasses = breaks.length - 1;
    let items = [];
    for (let i = 0; i < numClasses; i++) {
      let valLow = breaks[i];
      let color = getColorForValue(valLow);
      items.push(`<span style="background:${color}; flex:1; height:12px; border-radius:2px;" title="${valLow.toFixed(1)}"></span>`);
    }

    legendEl.innerHTML = `<div class="d-flex align-items-center gap-1 w-100 mb-1">${items.join("")}</div>
      <div class="d-flex justify-content-between text-muted" style="font-size:0.7rem;">
        <span>${breaks[0].toLocaleString(undefined, {maximumFractionDigits:1})}</span>
        <span>${breaks[breaks.length - 1].toLocaleString(undefined, {maximumFractionDigits:1})}</span>
      </div>`;
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

  // Determine optimal stroke color and weight per feature based on brightness/color & patterns
  function getBorderStrokeForFeature(fillColor) {
    let mode = state.strokeColor || "dark";
    if (mode === "none") {
      return { color: "transparent", weight: 0 };
    }

    // Handle SVG Pattern Fills (e.g. url(#pat-0) ~ url(#pat-7))
    if (fillColor && fillColor.startsWith("url")) {
      if (fillColor.includes("pat-7") || fillColor.includes("pat-6") || fillColor.includes("pat-5")) {
        return { color: "#ffffff", weight: 2.0 };
      }
      return { color: "#0f172a", weight: 1.8 };
    }

    if (fillColor === "transparent") {
      return { color: "#475569", weight: 1.5 };
    }

    const rgb = hexToRgb(fillColor || "#ffffff");
    const lum = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
    const isVeryDark = (lum < 60);

    if (mode === "white") {
      return { color: "#ffffff", weight: 1.8 };
    }

    if (mode === "black") {
      if (isVeryDark) {
        return { color: "#ffffff", weight: 2.0 };
      }
      return { color: "#000000", weight: 1.8 };
    }

    if (mode === "match_palette") {
      if (isVeryDark) {
        return { color: "#ffffff", weight: 2.0 };
      }
      return { color: darkenHex(fillColor, 0.4), weight: 1.6 };
    }

    if (mode === "auto") {
      if (lum < 150) {
        return { color: "#ffffff", weight: 2.0 };
      }
      return { color: "#1e293b", weight: 1.5 };
    }

    // Default ("dark"): Uniform dark slate border across ALL municipalities for crisp consistent lines!
    if (isVeryDark) {
      return { color: "#ffffff", weight: 2.0 };
    }
    return { color: "#334155", weight: 1.5 };
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

  // --- Map Header Mode Badge / Subtitle Extension Update ---
  function updateMapTransformModeBadge() {
    const badgeEl = document.getElementById("display-map-mode-tag");
    if (!badgeEl) return;

    let label = "（実測値）";
    if (state.transformMode === "zscore") {
      label = "（Zスコア標準化偏差）";
    } else if (state.transformMode === "tscore") {
      label = "（偏差値 Tスコア）";
    } else if (state.transformMode === "per_capita" || state.isPerCapitaMode) {
      const mult = state.perCapitaMultiplier || 100;
      if (mult === 100) label = "（人口100人あたり ％）";
      else if (mult === 1000) label = "（人口1,000人あたり）";
      else if (mult === 1) label = "（人口1人あたり）";
      else label = `（人口${mult.toLocaleString()}人あたり）`;
    }

    badgeEl.textContent = label;
  }

  // --- 10. Map Layer Rendering ---
  function renderGeoJSONLayer() {
    updateMapTransformModeBadge();
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
        let rawVal = state.currentValues[matchedName];
        let hasVal = (val !== undefined && val !== null && !isNaN(val));
        let displayVal = hasVal ? val.toLocaleString() : "データなし";
        let extraInfo = "";

        if (hasVal && (state.transformMode === "zscore" || state.transformMode === "tscore")) {
          extraInfo = `<div style="color:#cbd5e1; font-size:0.75rem; margin-top:2px;">(実測値: ${rawVal !== undefined ? rawVal.toLocaleString() : 'なし'})</div>`;
        }

        // Interactive hover tooltip
        layer.bindTooltip(`
          <div style="font-weight:700; font-size:0.9rem;">${matchedName}</div>
          <div style="color:#60a5fa; font-size:0.85rem; margin-top:2px;">
            ${displayVal} <small style="color:#cbd5e1">${getEffectiveUnit()}</small>
          </div>
          ${extraInfo}
        `, { sticky: true, direction: 'top', offset: [0, -10] });

        layer.on({
          mouseover: (e) => {
            let l = e.target;
            let currentWeight = (l.options && l.options.weight) || 1.2;
            l.setStyle({
              weight: currentWeight + 2,
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

    // Render Prefecture Outer Boundary Line Overlay (県境・海岸線の統一強調表示)
    if (state.outerBorderLayer) {
      state.leafletMap.removeLayer(state.outerBorderLayer);
      state.outerBorderLayer = null;
    }

    if (state.showOuterBorder) {
      state.outerBorderLayer = L.geoJSON(state.geojsonData, {
        style: {
          color: "#0f172a",
          weight: 2.2,
          fill: false,
          opacity: 0.95
        },
        interactive: false
      }).addTo(state.leafletMap);
    }

    renderLabelsLayer();
    renderLegend();
    updateStatsSummary();
    renderMiniMapLayer();
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
      renderDistributionChart([]);
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

    renderDistributionChart(vals);
  }

  // --- SVG Histogram & Kernel Density Curve Renderer ---
  function renderDistributionChart(valEntries) {
    const svg = document.getElementById("dist-chart-svg");
    const badge = document.getElementById("dist-skew-badge");
    const adviceText = document.getElementById("dist-zscore-advice-text");
    const adviceBox = document.getElementById("dist-zscore-advice");
    const minLabel = document.getElementById("dist-chart-min-label");
    const meanLabel = document.getElementById("dist-chart-mean-label");
    const maxLabel = document.getElementById("dist-chart-max-label");

    if (!svg) return;

    if (!valEntries || valEntries.length < 3) {
      svg.innerHTML = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-size="12">データ入力後にヒストグラムと密度曲線を描画します</text>`;
      if (badge) {
        badge.textContent = "未判定";
        badge.className = "badge badge-secondary";
        badge.style.background = "#94a3b8";
      }
      if (adviceText) {
        adviceText.textContent = "データを読み込むと、分布の歪み（歪度）およびZスコア・偏差値利用の可否アドバイスが表示されます。";
      }
      if (minLabel) minLabel.textContent = "最小: -";
      if (meanLabel) meanLabel.textContent = "平均: -";
      if (maxLabel) maxLabel.textContent = "最大: -";
      return;
    }

    const nums = valEntries.map(e => e[1]).sort((a, b) => a - b);
    const n = nums.length;
    const min = nums[0];
    const max = nums[nums.length - 1];
    const range = (max - min) || 1;

    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    
    // Variance & Standard Deviation
    const variance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1 || 1);
    const sd = Math.sqrt(variance) || 1;

    // Skewness (歪度)
    const m3 = nums.reduce((acc, v) => acc + Math.pow(v - mean, 3), 0) / n;
    const skewness = sd > 0 ? (m3 / Math.pow(sd, 3)) : 0;

    // Median
    let median = 0;
    let mid = Math.floor(n / 2);
    median = (n % 2 === 0) ? (nums[mid - 1] + nums[mid]) / 2 : nums[mid];

    if (minLabel) minLabel.textContent = `最小: ${formatNumber(min)}`;
    if (meanLabel) meanLabel.textContent = `平均: ${formatNumber(mean)}`;
    if (maxLabel) maxLabel.textContent = `最大: ${formatNumber(max)}`;

    // 7 Equal Width Bins
    const numBins = 7;
    const binWidth = range / numBins;
    const bins = Array(numBins).fill(0);

    nums.forEach(v => {
      let idx = Math.floor((v - min) / binWidth);
      if (idx >= numBins) idx = numBins - 1;
      bins[idx]++;
    });

    const maxBinCount = Math.max(...bins, 1);

    // SVG Layout Bounds
    const svgW = 500;
    const svgH = 180;
    const padL = 30;
    const padR = 20;
    const padT = 20;
    const padB = 30;
    const chartW = svgW - padL - padR;
    const chartH = svgH - padT - padB;

    let svgHtml = ``;

    // 1. Grid Lines
    for (let i = 0; i <= 3; i++) {
      let y = padT + (chartH / 3) * i;
      svgHtml += `<line x1="${padL}" y1="${y}" x2="${svgW - padR}" y2="${y}" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,3" />`;
    }

    // 2. Render Histogram Bars
    const barWidth = chartW / numBins;
    bins.forEach((count, i) => {
      let barH = (count / maxBinCount) * (chartH - 12);
      let x = padL + i * barWidth + 2;
      let y = padT + (chartH - barH);
      let w = Math.max(barWidth - 4, 2);
      
      svgHtml += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${barH.toFixed(1)}" fill="#bfdbfe" fill-opacity="0.75" stroke="#2563eb" stroke-width="1.2" rx="3">
        <title>区間: ${(min + i * binWidth).toFixed(1)} 〜 ${(min + (i + 1) * binWidth).toFixed(1)} (${count}自治体)</title>
      </rect>`;
      if (count > 0) {
        svgHtml += `<text x="${(x + w / 2).toFixed(1)}" y="${(y - 4).toFixed(1)}" font-size="10" fill="#1e40af" text-anchor="middle" font-weight="bold">${count}</text>`;
      }
    });

    // 3. Render Kernel Density Estimation (KDE) Curve
    const iqr = (nums[Math.floor(n * 0.75)] - nums[Math.floor(n * 0.25)]) || sd;
    const bw = (0.9 * Math.min(sd, iqr / 1.34) * Math.pow(n, -0.2)) || (range / 8);

    const pts = 50;
    let kdeMax = 0;
    const kdePoints = [];

    for (let p = 0; p <= pts; p++) {
      let xVal = min + (range / pts) * p;
      let density = 0;
      nums.forEach(xi => {
        let u = (xVal - xi) / bw;
        density += (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
      });
      density = density / (n * bw);
      if (density > kdeMax) kdeMax = density;
      kdePoints.push({ xVal, density });
    }

    let pathD = `M `;
    kdePoints.forEach((pt, idx) => {
      let x = padL + ((pt.xVal - min) / range) * chartW;
      let y = padT + chartH - (kdeMax > 0 ? (pt.density / kdeMax) * (chartH - 15) : 0);
      pathD += `${idx === 0 ? '' : 'L '}${x.toFixed(1)},${y.toFixed(1)} `;
    });

    let areaD = pathD + `L ${(padL + chartW).toFixed(1)},${(padT + chartH).toFixed(1)} L ${padL.toFixed(1)},${(padT + chartH).toFixed(1)} Z`;

    svgHtml += `<path d="${areaD}" fill="rgba(37, 99, 235, 0.15)" />`;
    svgHtml += `<path d="${pathD}" fill="none" stroke="#1d4ed8" stroke-width="2.5" stroke-linejoin="round" />`;

    // 4. Mean & Median Vertical Lines
    let meanX = padL + Math.max(0, Math.min(1, (mean - min) / range)) * chartW;
    let medianX = padL + Math.max(0, Math.min(1, (median - min) / range)) * chartW;

    // Mean Line (Blue)
    svgHtml += `<line x1="${meanX.toFixed(1)}" y1="${padT}" x2="${meanX.toFixed(1)}" y2="${padT + chartH}" stroke="#1d4ed8" stroke-width="2" stroke-dasharray="4,2" />`;
    svgHtml += `<text x="${meanX.toFixed(1)}" y="${padT - 4}" font-size="10" fill="#1d4ed8" text-anchor="middle" font-weight="bold">平均</text>`;

    // Median Line (Orange)
    if (Math.abs(meanX - medianX) > 10) {
      svgHtml += `<line x1="${medianX.toFixed(1)}" y1="${padT}" x2="${medianX.toFixed(1)}" y2="${padT + chartH}" stroke="#ea580c" stroke-width="1.8" stroke-dasharray="2,2" />`;
      svgHtml += `<text x="${medianX.toFixed(1)}" y="${padT - 4}" font-size="10" fill="#c2410c" text-anchor="middle" font-weight="bold">中央</text>`;
    }

    svg.innerHTML = svgHtml;

    // 5. Update Badge & Comprehensive Visualization Advice
    const absSkew = Math.abs(skewness);

    if (badge) {
      if (absSkew <= 0.45) {
        badge.textContent = `🟢 左右対称 (正規分布型 : 歪度 ${skewness.toFixed(2)})`;
        badge.className = "badge badge-success";
        badge.style.background = "#16a34a";
      } else if (absSkew <= 0.95) {
        badge.textContent = `🟡 やや偏りあり (歪度 ${skewness.toFixed(2)})`;
        badge.className = "badge badge-warning";
        badge.style.background = "#ca8a04";
      } else {
        badge.textContent = `🔴 強い偏り・歪みあり (歪度 ${skewness.toFixed(2)})`;
        badge.className = "badge badge-danger";
        badge.style.background = "#dc2626";
      }
    }

    const activeVar = state.variables[state.activeVariableKey];
    const varName = activeVar ? activeVar.name : "";
    const varUnit = activeVar ? activeVar.unit : "";

    // A. Transformation Mode Advice (数値変換アドバイス)
    let transAdviceHeader = "";
    let transAdviceDetail = "";

    // Check if the variable is already normalized / per-capita / rate / index / per person
    const isAlreadyNormalized = /1人|一人|１人|世帯あた|世帯当|率|割合|%|％|密度|指数|スコア|偏差値|100人|1000人|1,000人|1万人|10万人/i.test(varName + varUnit);
    // Check if it's a raw cumulative count or total financial sum (未補正の総数・総額データ)
    const isRawCountOrAmount = !isAlreadyNormalized && /人口|世帯数|就業者数|事業所数|農家数|面積|水稲|収穫量|出荷額|販売額|総生産|車両数|延長|病床数|医師数|施設数|件数|歳入|歳出|金額/i.test(varName);

    if (isAlreadyNormalized) {
      if (absSkew <= 0.45) {
        transAdviceHeader = "① 数値変換：すでに単位補正済みの指標のため <b>「実測値」</b> が最適";
        transAdviceDetail = `「1人あたり」や「割合」などの補正済み指標です。分布が均等（歪度 <b>${skewness.toFixed(2)}</b>）なため、<b>実測値（そのままの数値）</b>で直感的に可視化できます。偏差の評価には<b>Zスコア・偏差値</b>も有効です。`;
      } else {
        transAdviceHeader = "① 数値変換：すでに単位補正済みの指標のため <b>「実測値」</b> で作図してください";
        transAdviceDetail = `すでに単位調整（1人あたり等）された指標です。自治体間の格差により値に偏り（歪度 <b>${skewness.toFixed(2)}</b>）がありますが、人口あたりの再変換は不要です。下記<b>「Jenks自然分類」</b>による階級区分で描画すると綺麗に色分けできます。`;
      }
    } else if (isRawCountOrAmount) {
      if (absSkew <= 0.45) {
        transAdviceHeader = "① 数値変換：<b>「100人あたり(％)」</b> や <b>「1,000人あたり」</b> への人口補正がおすすめ";
        transAdviceDetail = `総数データのため人口規模が大きい市（青森市・八戸市等）が高くなりやすい傾向があります。<b>「100人あたり(%)」や「1,000人あたり」</b>に補正すると市町村間の真の差を比較できます。`;
      } else {
        transAdviceHeader = "① 数値変換：<b>「100人あたり(％) / 1,000人あたり」</b> への人口補正を強力に推奨";
        transAdviceDetail = `総数データで上位自治体に数値が集中し強い偏り（歪度 <b>${skewness.toFixed(2)}</b>）があります。人口規模の違いを相殺するため<b>「1,000人あたり」や「100人あたり(%)」</b>に変換して分析してください。`;
      }
    } else {
      if (absSkew <= 0.45) {
        transAdviceHeader = "① 数値変換：<b>「実測値」</b> または <b>「Zスコア / 偏差値」</b> が最適";
        transAdviceDetail = `分布がバランスよく左右対称（歪度 <b>${skewness.toFixed(2)}</b>）のため、<b>実測値</b>のまま作図するか、<b>Zスコア/偏差値</b>で標準化すると全自治体の位置づけが把握できます。`;
      } else {
        transAdviceHeader = "① 数値変換：<b>「実測値」</b> での可視化が適切";
        transAdviceDetail = `分布に偏り（歪度 <b>${skewness.toFixed(2)}</b>）があります。Zスコアを使うと特定の階級に自治体が集中する可能性があるため、<b>実測値</b>のまま評価するのが適切です。`;
      }
    }

    // B. Classification Method Advice (階級区分法のアドバイス)
    let classAdviceHeader = "";
    let classAdviceDetail = "";

    if (absSkew > 0.8) {
      classAdviceHeader = "② 階級区分：<b>「Jenks自然段階分類（自然分類法）」</b> を強く推奨";
      classAdviceDetail = `データ内に大きな格差や急激な値の跳ね上がり（上位市の集中等）が存在します。データの「自然な谷間」で境界を切る<b>「Jenks（自然分類）」</b>を使うと、自然なクラスタリングで最も美しく塗り分けられます。`;
    } else if (absSkew > 0.3) {
      classAdviceHeader = "② 階級区分：<b>「Jenks（自然分類）」</b> または <b>「等間隔分類」</b> がおすすめ";
      classAdviceDetail = `比較的滑らかな分布です。全体を均等な数値幅で分けたい場合は<b>「等間隔分類」</b>、データの自然な集まりを重視したい場合は<b>「Jenks（自然分類）」</b>が適しています。`;
    } else {
      classAdviceHeader = "② 階級区分：<b>「等間隔分類」</b> または <b>「Jenks（自然分類）」</b> が最適";
      classAdviceDetail = `データが均等・綺麗な左右対称に分布しています。標準的な<b>「等間隔分類」</b>で境界を設定すると分かりやすい階級分けになります。`;
    }

    if (adviceBox && adviceText) {
      if (absSkew <= 0.45) {
        adviceBox.style.background = "#eff6ff";
        adviceBox.style.borderColor = "#93c5fd";
      } else if (absSkew <= 0.95) {
        adviceBox.style.background = "#fefce8";
        adviceBox.style.borderColor = "#fef08a";
      } else {
        adviceBox.style.background = "#fef2f2";
        adviceBox.style.borderColor = "#fca5a5";
      }

      adviceText.innerHTML = `
        <div class="mb-2 pb-2 border-bottom" style="border-color: rgba(0,0,0,0.08) !important;">
          <div class="fw-bold text-dark" style="font-size:0.84rem;">${transAdviceHeader}</div>
          <div class="text-muted mt-1" style="font-size:0.78rem; line-height:1.4;">${transAdviceDetail}</div>
        </div>
        <div>
          <div class="fw-bold text-dark" style="font-size:0.84rem;">${classAdviceHeader}</div>
          <div class="text-muted mt-1" style="font-size:0.78rem; line-height:1.4;">${classAdviceDetail}</div>
        </div>
      `;
    }
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

  // --- 16. CSV / Excel Parsing & Multi-Variable Importing ---
  function parseFileInput(file) {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      parseExcelFile(file);
    } else {
      parseCSVFile(file);
    }
  }

  function parseExcelFile(file) {
    if (typeof XLSX === "undefined") {
      showToast("Excelライブラリ(SheetJS)の読み込みに失敗しました", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          showToast("Excelファイル内にワークシートが見つかりませんでした", "error");
          return;
        }

        if (workbook.SheetNames.length === 1) {
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const csvText = XLSX.utils.sheet_to_csv(firstSheet);
          parseRawText(csvText, file.name + " (" + workbook.SheetNames[0] + ")");
        } else {
          openExcelSheetModal(workbook, file.name);
        }
      } catch (err) {
        console.error(err);
        showToast("Excelファイルの解析中にエラーが発生しました: " + err.message, "error");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function openExcelSheetModal(workbook, fileName) {
    const modal = document.getElementById("excel-sheet-modal");
    const container = document.getElementById("excel-sheet-list");
    if (!modal || !container) return;

    container.innerHTML = "";
    workbook.SheetNames.forEach((sheetName, index) => {
      const card = document.createElement("label");
      card.className = "var-radio-card" + (index === 0 ? " active" : "");
      card.innerHTML = `
        <input type="radio" name="excelSheet" value="${sheetName}" ${index === 0 ? "checked" : ""}>
        <div class="var-card-content">
          <div class="var-card-title"><i class="fa-solid fa-table text-green me-1"></i> ${sheetName}</div>
        </div>
      `;
      container.appendChild(card);
    });

    modal.classList.remove("hidden");

    const btnConfirm = document.getElementById("btn-confirm-sheet-modal");
    const btnCancel = document.getElementById("btn-cancel-sheet-modal");
    const btnClose = document.getElementById("btn-close-sheet-modal");

    const closeModal = () => {
      modal.classList.add("hidden");
      btnConfirm.removeEventListener("click", onConfirm);
    };

    const onConfirm = () => {
      const selectedRadio = container.querySelector('input[name="excelSheet"]:checked');
      if (selectedRadio) {
        const chosenSheetName = selectedRadio.value;
        const sheet = workbook.Sheets[chosenSheetName];
        const csvText = XLSX.utils.sheet_to_csv(sheet);
        parseRawText(csvText, fileName + " (" + chosenSheetName + ")");
      }
      closeModal();
    };

    btnConfirm.addEventListener("click", onConfirm);
    btnCancel.onclick = closeModal;
    if (btnClose) btnClose.onclick = closeModal;
  }

  function parseCSVFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      parseRawText(e.target.result, file.name);
    };
    reader.readAsText(file, "utf-8");
  }

  // --- Data Quality & Anomaly Checker ---
  function checkDataQuality(currentValues) {
    const valsObj = currentValues || getEffectiveValues();
    
    // 1. Missing Municipalities Check
    const missing = AOMORI_MUNICIPALITIES
      .filter(m => valsObj[m.name] === undefined || valsObj[m.name] === null || isNaN(valsObj[m.name]))
      .map(m => m.name);

    // 2. Anomaly / Outlier Check
    const validEntries = Object.entries(valsObj)
      .filter(([name, val]) => typeof val === "number" && !isNaN(val));

    const anomalies = [];

    if (validEntries.length >= 4) {
      const vals = validEntries.map(e => e[1]).sort((a, b) => a - b);
      const n = vals.length;
      
      const q1 = vals[Math.floor(n * 0.25)];
      const q3 = vals[Math.floor(n * 0.75)];
      const iqr = q3 - q1;
      const lowerFence = q1 - 2.5 * iqr;
      const upperFence = q3 + 2.5 * iqr;

      const sum = vals.reduce((a, b) => a + b, 0);
      const mean = sum / n;
      const positiveCount = vals.filter(v => v >= 0).length;
      const isMostlyNonNegative = (positiveCount / n) >= 0.85;

      validEntries.forEach(([name, val]) => {
        if (isMostlyNonNegative && val < 0) {
          anomalies.push({
            name,
            val,
            reason: `負の数 (${val}) が入力されています。数値をご確認ください。`
          });
        } else if (iqr > 0 && (val > upperFence || val < lowerFence)) {
          let times = mean > 0 ? (val / mean).toFixed(1) : null;
          let detail = times && parseFloat(times) > 2.5 ? ` (平均値の約 ${times}倍)` : "";
          anomalies.push({
            name,
            val,
            reason: `全体（平均: ${mean.toLocaleString(undefined, {maximumFractionDigits:1})}）から大きく外れた特異な値です${detail}。入力ミスがないかご確認ください。`
          });
        }
      });
    }

    return {
      missing,
      anomalies
    };
  }

  function renderNormalizationReport(autoCorrected = [], suffixCompleted = [], unmatched = [], totalRows = 0, customVals = null) {
    const banner = document.getElementById("normalization-report-banner");
    const body = document.getElementById("norm-banner-body");
    if (!banner || !body) return;

    const quality = checkDataQuality(customVals || getEffectiveValues());

    if (autoCorrected.length === 0 && suffixCompleted.length === 0 && unmatched.length === 0 && quality.missing.length === 0 && quality.anomalies.length === 0) {
      banner.classList.add("hidden");
      return;
    }

    let html = `<div class="d-flex flex-wrap gap-2 mb-2">
      ${totalRows > 0 ? `<span class="badge badge-primary">取り込み: ${totalRows}行</span>` : ''}
      ${suffixCompleted.length > 0 ? `<span class="badge badge-info">「市町村」補完: ${suffixCompleted.length}件</span>` : ''}
      ${autoCorrected.length > 0 ? `<span class="badge badge-success">自動補正: ${autoCorrected.length}件</span>` : ''}
      ${quality.missing.length > 0 ? `<span class="badge badge-warning">未入力: ${quality.missing.length} / 40</span>` : '<span class="badge badge-success">40自治体 入力完了</span>'}
      ${quality.anomalies.length > 0 ? `<span class="badge badge-danger" style="background:#dc2626; color:#ffffff;">要確認: ${quality.anomalies.length}件の異常値</span>` : ''}
    </div>`;

    if (suffixCompleted.length > 0) {
      let items = suffixCompleted.map(item => `<b>「${item.original}」</b>→ <strong class="text-blue">${item.corrected}</strong>`).join("、");
      html += `<div class="mt-1" style="color:#1d4ed8;"><i class="fa-solid fa-square-check me-1"></i> 「市・町・村」の省略を自動補完しました: ${items}</div>`;
    }

    if (autoCorrected.length > 0) {
      let items = autoCorrected.map(item => `<b>「${item.original}」</b>→ <strong class="text-blue">${item.corrected}</strong>`).join("、");
      html += `<div class="mt-1" style="color:#15803d;"><i class="fa-solid fa-wand-magic-sparkles me-1"></i> 表記揺れ・旧自治体名を自動補正しました: ${items}</div>`;
    }

    if (unmatched.length > 0) {
      let items = unmatched.map(item => `<b>「${item}」</b>`).join("、");
      html += `<div class="mt-1 text-red"><i class="fa-solid fa-triangle-exclamation me-1"></i> 青森県の40市町村と一致しなかった名称: ${items}</div>`;
    }

    if (quality.missing.length > 0) {
      let sampleMissing = quality.missing.slice(0, 6).join("、");
      let moreText = quality.missing.length > 6 ? ` など計 ${quality.missing.length}自治体` : '';
      html += `<div class="mt-1" style="color:#c2410c;"><i class="fa-solid fa-circle-exclamation me-1"></i> <strong>データ欠測の検出:</strong> 40自治体中 ${quality.missing.length}自治体の数値が未入力（欠測）です（未入力例: ${sampleMissing}${moreText}）。</div>`;
    }

    if (quality.anomalies.length > 0) {
      html += `<div class="mt-2 pt-2 border-top text-red"><strong style="color:#dc2626;"><i class="fa-solid fa-triangle-exclamation me-1"></i> 異常値の可能性（数値入力の注意表示）:</strong><ul class="mb-0 mt-1 ps-3" style="font-size:0.82rem; color:#b91c1c;">`;
      quality.anomalies.forEach(anom => {
        html += `<li><b>「${anom.name}」</b> (数値: <strong>${anom.val.toLocaleString()}</strong>) - ${anom.reason}</li>`;
      });
      html += `</ul></div>`;
    }

    body.innerHTML = html;
    banner.classList.remove("hidden");
  }

  function parseRawText(rawText, sourceName) {
    if (!rawText || !rawText.trim()) return;
    if (rawText.charCodeAt(0) === 0xFEFF) {
      rawText = rawText.slice(1);
    }
    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    let autoCorrected = [];
    let suffixCompleted = [];
    let unmatched = [];
    let totalParsedRows = 0;

    let firstLine = lines[0];
    let sep = firstLine.includes("\t") ? "\t" : ",";
    let headerParts = firstLine.split(sep).map(s => s.trim().replace(/^[\uFEFF"']|["']$/g, ""));

    let nameColIdx = headerParts.findIndex(h => /市町村|自治体|名称|市区町村|name/i.test(h));
    if (nameColIdx === -1) {
      nameColIdx = headerParts.length > 1 && /コード|code|id/i.test(headerParts[0]) ? 1 : 0;
    }

    let valCols = [];
    headerParts.forEach((colName, idx) => {
      if (idx !== nameColIdx && !/コード|code|id|区分|type/i.test(colName)) {
        valCols.push({ idx: idx, name: colName });
      }
    });

    if (valCols.length > 1) {
      let addedKeys = [];
      valCols.forEach(col => {
        let varKey = "custom_" + col.name.replace(/[^a-zA-Z0-9_\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/g, "_");
        let varData = {};
        for (let i = 1; i < lines.length; i++) {
          let parts = lines[i].split(sep).map(s => s.trim().replace(/[,\s"']/g, ""));
          let nameCand = parts[nameColIdx];
          let normInfo = normalizeNameInfo(nameCand);
          if (normInfo.matched && parts[col.idx] !== undefined) {
            let num = parseFloat(parts[col.idx]);
            if (!isNaN(num)) {
              varData[normInfo.matched] = num;
              totalParsedRows++;
              if (normInfo.type === "suffix_completed") {
                if (!suffixCompleted.some(a => a.original === nameCand)) {
                  suffixCompleted.push({ original: nameCand, corrected: normInfo.matched });
                }
              } else if (normInfo.type === "corrected" || normInfo.type === "alias") {
                if (!autoCorrected.some(a => a.original === nameCand)) {
                  autoCorrected.push({ original: nameCand, corrected: normInfo.matched });
                }
              }
            }
          } else if (normInfo.type === "unmatched" && nameCand) {
            if (!unmatched.includes(nameCand)) unmatched.push(nameCand);
          }
        }
        if (Object.keys(varData).length > 0) {
          state.variables[varKey] = {
            id: varKey,
            name: col.name,
            label: `📁 ${col.name}`,
            unit: "",
            title: `青森県 市町村別 ${col.name}`,
            subtitle: "インポートデータに基づく可視化",
            remarks: sourceName ? `※ 出典：${sourceName}` : "※ 出典：インポートデータ",
            palette: "blues",
            data: varData
          };
          addedKeys.push(varKey);
        }
      });

      if (addedKeys.length > 0) {
        populateVariableDropdowns();
        switchActiveVariable(addedKeys[0], true);
        renderNormalizationReport(autoCorrected, suffixCompleted, unmatched, totalParsedRows, state.variables[addedKeys[0]]?.data);
        showToast(`${addedKeys.length} 項目の変数を検出・設定しました`, "info");
        return;
      }
    }

    const newVals = {};
    let count = 0;
    lines.forEach(line => {
      let parts = line.split(/[\t,;]+/);
      if (parts.length >= 2) {
        let nameCandidate = parts[0].trim();
        let valCandidate = parts[1].trim().replace(/[,\s"']/g, "");
        let normInfo = normalizeNameInfo(nameCandidate);
        let num = parseFloat(valCandidate);

        if (!normInfo.matched && isNaN(num) && parts.length >= 2) {
          let altName = parts[1].trim();
          let altVal = parts[0].trim().replace(/[,\s"']/g, "");
          normInfo = normalizeNameInfo(altName);
          num = parseFloat(altVal);
          if (normInfo.matched) nameCandidate = altName;
        }

        if (normInfo.matched && !isNaN(num)) {
          newVals[normInfo.matched] = num;
          count++;
          if (normInfo.type === "suffix_completed") {
            if (!suffixCompleted.some(a => a.original === nameCandidate)) {
              suffixCompleted.push({ original: nameCandidate, corrected: normInfo.matched });
            }
          } else if (normInfo.type === "corrected" || normInfo.type === "alias") {
            if (!autoCorrected.some(a => a.original === nameCandidate)) {
              autoCorrected.push({ original: nameCandidate, corrected: normInfo.matched });
            }
          }
        } else if (normInfo.type === "unmatched" && nameCandidate) {
          if (!unmatched.includes(nameCandidate)) unmatched.push(nameCandidate);
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
        remarks: sourceName ? `※ 出典：${sourceName}` : "※ 出典：インポートデータ",
        palette: "blues",
        data: newVals
      };
      populateVariableDropdowns();
      switchActiveVariable(varKey, false);
      renderNormalizationReport(autoCorrected, suffixCompleted, unmatched, count, newVals);
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

    // Preserve original styles and clear box-shadow/borders to prevent edge vertical line artifacts
    const prevBoxShadow = frame.style.boxShadow;
    const prevBorderRadius = frame.style.borderRadius;
    const prevBorder = frame.style.border;
    const prevOutline = frame.style.outline;
    const prevMargin = frame.style.margin;
    const prevPadding = frame.style.padding;
    const prevOverflow = frame.style.overflow;

    const leafletEl = document.getElementById("leaflet-map");
    const prevLeafletBorder = leafletEl ? leafletEl.style.border : "";
    const prevLeafletOutline = leafletEl ? leafletEl.style.outline : "";
    const prevLeafletBoxShadow = leafletEl ? leafletEl.style.boxShadow : "";
    const prevLeafletOverflow = leafletEl ? leafletEl.style.overflow : "";

    frame.style.boxShadow = "none";
    frame.style.borderRadius = "0px";
    frame.style.border = "none";
    frame.style.outline = "none";
    frame.style.margin = "0px";
    frame.style.padding = "0px";
    frame.style.overflow = "hidden";

    if (leafletEl) {
      leafletEl.style.border = "none";
      leafletEl.style.outline = "none";
      leafletEl.style.boxShadow = "none";
      leafletEl.style.overflow = "hidden";
    }

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
      const targetHeight = Math.round(targetWidth * (210 / 297));
      const pixelRatio = (frameRect.width > 0) ? (targetWidth / frameRect.width) : scale;

      const filterFn = (node) => {
        if (node.classList && (
          node.classList.contains("leaflet-control-zoom") ||
          node.classList.contains("floating-map-controls") ||
          node.classList.contains("municipality-detail-card")
        )) {
          return false;
        }
        return true;
      };

      let rawCanvas = null;

      if (window.htmlToImage && typeof window.htmlToImage.toCanvas === "function") {
        rawCanvas = await window.htmlToImage.toCanvas(frame, {
          pixelRatio: pixelRatio,
          skipFonts: true,
          backgroundColor: bgColor,
          filter: filterFn
        });
      } else if (window.html2canvas) {
        rawCanvas = await window.html2canvas(frame, {
          scale: pixelRatio,
          useCORS: true,
          logging: false,
          backgroundColor: bgColor
        });
      } else if (window.htmlToImage && typeof window.htmlToImage.toPng === "function") {
        const tempUrl = await window.htmlToImage.toPng(frame, {
          pixelRatio: pixelRatio,
          skipFonts: true,
          backgroundColor: bgColor,
          filter: filterFn
        });
        rawCanvas = await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const c = document.createElement("canvas");
            c.width = img.width;
            c.height = img.height;
            const ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(c);
          };
          img.onerror = reject;
          img.src = tempUrl;
        });
      } else {
        throw new Error("画像生成ライブラリ (html-to-image) が読み込まれていません");
      }

      // --- Clean Canvas Reconstruction with 4-Edge Inner Crop ---
      // Safely trim 16px (Scale 3), 10px (Scale 2), 6px (Scale 1) from raw canvas edges
      // to permanently eliminate any right-side vertical line artifacts, scrollbars, or border leaks.
      const cleanCanvas = document.createElement("canvas");
      cleanCanvas.width = targetWidth;
      cleanCanvas.height = targetHeight;

      const ctx = cleanCanvas.getContext("2d");

      // Fill clean solid background
      if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      if (rawCanvas && rawCanvas.width > 0 && rawCanvas.height > 0) {
        const safetyMargin = (scale === 3) ? 16 : (scale === 2 ? 10 : 6);
        const srcX = Math.min(safetyMargin, Math.floor(rawCanvas.width * 0.05));
        const srcY = Math.min(safetyMargin, Math.floor(rawCanvas.height * 0.05));
        const srcW = Math.max(1, rawCanvas.width - (srcX * 2));
        const srcH = Math.max(1, rawCanvas.height - (srcY * 2));

        ctx.drawImage(
          rawCanvas,
          srcX, srcY, srcW, srcH,
          0, 0, targetWidth, targetHeight
        );
      }

      const dataUrl = cleanCanvas.toDataURL("image/png");
      const blob = await new Promise(resolve => cleanCanvas.toBlob(resolve, "image/png"));

      return { dataUrl, blob, width: targetWidth, height: targetHeight };
    } finally {
      // Restore frame & leaflet styles
      frame.style.boxShadow = prevBoxShadow;
      frame.style.borderRadius = prevBorderRadius;
      frame.style.border = prevBorder;
      frame.style.outline = prevOutline;
      frame.style.margin = prevMargin;
      frame.style.padding = prevPadding;
      frame.style.overflow = prevOverflow;

      if (leafletEl) {
        leafletEl.style.border = prevLeafletBorder;
        leafletEl.style.outline = prevLeafletOutline;
        leafletEl.style.boxShadow = prevLeafletBoxShadow;
        leafletEl.style.overflow = prevLeafletOverflow;
      }

      zoomControls.forEach(el => el.style.display = "");
      zoomControls.forEach(el => el.style.display = "");
      if (legendBox) legendBox.style.display = "";
      if (state.labelMode !== prevLabelMode) state.labelMode = prevLabelMode;
      renderLabelsLayer();
    }
  }

  // --- Standalone SVG Exporter ---
  async function generateMapSVGData() {
    // Generate clean high-res canvas render (eliminates foreignObject bugs & security blocks)
    const { dataUrl, blob: pngBlob, width: imgW, height: imgH } = await generateMapPNGData();

    const w = imgW || 3508;
    const h = imgH || 2480;

    const bgColor = (state.mapBg === "minimal-dark") ? "#0f172a" : "#ffffff";

    // Build pure, standalone SVG XML document compliant with W3C SVG standards
    const svgXml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bgColor}"/>
  <image width="${w}" height="${h}" xlink:href="${dataUrl}" />
</svg>`;

    const svgBlob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
    const svgDataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgXml);

    return { dataUrl: svgDataUrl, blob: svgBlob, isSvg: true, svgXml: svgXml };
  }

  async function exportMapPNG() {
    const fmt = state.exportFormat || "png";
    const fmtUpper = fmt.toUpperCase();

    const exportBtns = [
      document.getElementById("btn-export-png-header"),
      document.getElementById("btn-export-png-tab")
    ].filter(Boolean);

    exportBtns.forEach(b => {
      b.disabled = true;
      b.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> 生成中...`;
    });

    try {
      if (fmt === "svg") {
        const { dataUrl } = await generateMapSVGData();
        const filename = `Aomori_Choropleth_${Date.now()}.svg`;
        
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast("SVG（ベクター画像）を保存しました", "success");
      } else {
        const { dataUrl } = await generateMapPNGData();
        const filename = `Aomori_Choropleth_${Date.now()}.png`;
        
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast("PNG画像を保存しました", "success");
      }
    } catch (err) {
      console.error("Map export error:", err);
      showToast(`画像 (${fmtUpper}) の保存に失敗しました: ` + err.message, "error");
    } finally {
      const exportHeader = document.getElementById("btn-export-png-header");
      const exportTab = document.getElementById("btn-export-png-tab");
      if (exportHeader) exportHeader.innerHTML = `<i class="fa-solid fa-download"></i> マップ保存 (${fmtUpper})`;
      if (exportTab) exportTab.innerHTML = `<i class="fa-solid fa-download"></i> マップ保存 (${fmtUpper}を出力)`;
      exportBtns.forEach(b => b.disabled = false);
    }
  }

  async function copyMapPNGToClipboard() {
    const fmt = state.exportFormat || "png";
    const fmtUpper = fmt.toUpperCase();

    const copyBtns = [
      document.getElementById("btn-copy-png-header"),
      document.getElementById("btn-copy-png-tab")
    ].filter(Boolean);

    copyBtns.forEach(b => {
      b.disabled = true;
      b.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> コピー中...`;
    });

    try {
      if (fmt === "svg") {
        const { dataUrl, blob } = await generateMapSVGData();
        let copied = false;

        if (blob && navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/svg+xml': blob })]);
            copied = true;
          } catch (e1) {
            try {
              const svgText = decodeURIComponent(dataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, ""));
              await navigator.clipboard.writeText(svgText);
              copied = true;
            } catch (e2) {
              console.warn("SVG copy text fallback failed:", e2);
            }
          }
        }

        if (copied) {
          showToast("SVG画像をクリップボードにコピーしました", "success");
        } else {
          // Automatic download rescue for SVG
          const filename = `Aomori_Choropleth_${Date.now()}.svg`;
          const link = document.createElement("a");
          link.download = filename;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast("クリップボード制限が検出されたため、SVGファイルをダウンロードしました", "info");
        }
      } else {
        const { dataUrl, blob } = await generateMapPNGData();
        let copied = false;

        // Method 1: Standard Clipboard API (PNG Blob)
        if (blob && navigator.clipboard && window.ClipboardItem) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            copied = true;
          } catch (clipErr) {
            console.warn("Direct ClipboardItem png failed, trying HTML fallback:", clipErr);
          }
        }

        // Method 2: Standard Clipboard API with HTML <img> tag
        if (!copied && navigator.clipboard && window.ClipboardItem && dataUrl) {
          try {
            const htmlBlob = new Blob([`<img src="${dataUrl}" alt="Aomori Map">`], { type: 'text/html' });
            await navigator.clipboard.write([new ClipboardItem({ 'text/html': htmlBlob })]);
            copied = true;
          } catch (htmlClipErr) {
            console.warn("ClipboardItem html failed:", htmlClipErr);
          }
        }

        // Method 3: Legacy execCommand Selection Copy Fallback
        if (!copied && dataUrl) {
          try {
            copied = copyImageViaExecCommand(dataUrl);
          } catch (execErr) {
            console.warn("execCommand copy failed:", execErr);
          }
        }

        if (copied) {
          showToast("PNG画像をクリップボードにコピーしました", "success");
        } else {
          const filename = `Aomori_Choropleth_${Date.now()}.png`;
          const link = document.createElement("a");
          link.download = filename;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast("クリップボード制限が検出されたため、PNG画像をダウンロードしました", "info");
        }
      }
    } catch (err) {
      console.error("Clipboard copy error:", err);
      showToast(`画像のコピーに失敗しました: ` + err.message, "error");
    } finally {
      const copyHeader = document.getElementById("btn-copy-png-header");
      const copyTab = document.getElementById("btn-copy-png-tab");
      if (copyHeader) copyHeader.innerHTML = `<i class="fa-regular fa-copy"></i> ${fmtUpper}コピー`;
      if (copyTab) copyTab.innerHTML = `<i class="fa-regular fa-copy"></i> クリップボードに${fmtUpper}をコピー`;
      copyBtns.forEach(b => b.disabled = false);
    }
  }

  // Fallback function for execCommand selection copy
  function copyImageViaExecCommand(dataUrl) {
    const container = document.createElement("div");
    container.contentEditable = "true";
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.opacity = "0";

    const img = document.createElement("img");
    img.src = dataUrl;
    container.appendChild(img);
    document.body.appendChild(container);

    const range = document.createRange();
    range.selectNodeContents(container);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    const success = document.execCommand("copy");
    selection.removeAllRanges();
    document.body.removeChild(container);
    return success;
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
    // Normalization Banner close button
    const btnCloseBanner = document.getElementById("btn-close-norm-banner");
    if (btnCloseBanner) {
      btnCloseBanner.onclick = () => {
        const banner = document.getElementById("normalization-report-banner");
        if (banner) banner.classList.add("hidden");
      };
    }

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

    // Preset Datasets Loading Buttons
    const btnPresetNenkan = document.getElementById("btn-load-preset-nenkan");
    if (btnPresetNenkan) {
      btnPresetNenkan.addEventListener("click", () => loadPresetData("nenkan100"));
    }

    const btnPresetSugata = document.getElementById("btn-load-preset-sugata");
    if (btnPresetSugata) {
      btnPresetSugata.addEventListener("click", () => loadPresetData("sugata2026"));
    }

    const btnPresetSubtle = document.getElementById("btn-load-preset-subtle");
    if (btnPresetSubtle) {
      btnPresetSubtle.addEventListener("click", () => loadPresetData("sugata2026"));
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
    function updatePerCapitaUnit() {
      const v = state.variables[state.activeVariableKey];
      let baseUnit = v && v.unit ? `単位：${v.unit}` : "";
      
      if (state.isPerCapitaMode) {
        let label = "100人(%)";
        if (state.perCapitaMultiplier === 1) label = "1人";
        else if (state.perCapitaMultiplier === 100) label = "100人(%)";
        else if (state.perCapitaMultiplier === 1000) label = "1,000人";
        else if (state.perCapitaMultiplier === 10000) label = "1万人";
        else if (state.perCapitaMultiplier === 100000) label = "10万人";
        state.unit = baseUnit ? `${baseUnit} (${label}あたり)` : `単位：/${label}`;
      } else {
        state.unit = baseUnit;
      }
      
      const displayUnit = document.getElementById("display-legend-unit");
      const unitInput = document.getElementById("map-unit-input");
      if (displayUnit) displayUnit.textContent = state.unit;
      if (unitInput) unitInput.value = state.unit;
      
      updateDataTable();
      renderGeoJSONLayer();
      updateStatsSummary();
    }

    function updateZScorePaletteUIState() {
      const box = document.getElementById("zscore-palette-box");
      const badge = document.getElementById("zscore-palette-badge");
      const note = document.getElementById("zscore-palette-note");
      if (!box) return;

      const isZorT = (state.transformMode === "zscore" || state.transformMode === "tscore");

      if (isZorT) {
        box.classList.remove("disabled-section");
        box.classList.add("active-section");
        if (badge) {
          badge.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i> 平均中心の発散型カラー（選択可能）`;
          badge.style.background = "#2563eb";
        }
        if (note) {
          note.className = "text-blue d-block mt-2 fw-bold";
          note.innerHTML = `✨ 平均値を「白/淡色」、プラスの偏りを「赤/暖色」、マイナスの偏りを「青/冷色」で対照的に表現します。`;
        }
      } else {
        box.classList.remove("active-section");
        box.classList.add("disabled-section");
        if (badge) {
          badge.innerHTML = `<i class="fa-solid fa-lock me-1"></i> Zスコア/偏差値選択時に解放`;
          badge.style.background = "#94a3b8";
        }
        if (note) {
          note.className = "text-muted d-block mt-2";
          note.innerHTML = `※「数値の変換・統計分析モード」で Zスコア または 偏差値 を選択すると解放されます。`;
        }
      }
    }

    // Statistical Transformation Mode Single Dropdown Event
    const selTransMode = document.getElementById("select-transform-mode");
    if (selTransMode) {
      selTransMode.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val.startsWith("per_capita")) {
          state.transformMode = "per_capita";
          state.isPerCapitaMode = true;
          state.perCapitaMultiplier = parseInt(val.replace("per_capita_", ""), 10) || 100;
        } else {
          state.transformMode = val;
          state.isPerCapitaMode = false;
        }

        if (state.transformMode === "zscore" || state.transformMode === "tscore") {
          // Automatically set default palette to 'div_blue_red' (Diverging Blue-White-Red) for Z-score/T-score
          if (!state.useCustomGradient) {
            state.paletteKey = "div_blue_red";
            document.querySelectorAll(".palette-btn").forEach(b => {
              b.classList.toggle("active", b.getAttribute("data-palette") === "div_blue_red");
            });
          }
        } else {
          // If reverting to normal mode while a Z-score palette is active, switch to 'blues'
          if (state.paletteKey && state.paletteKey.startsWith("div_")) {
            state.paletteKey = "blues";
            document.querySelectorAll(".palette-btn").forEach(b => {
              b.classList.toggle("active", b.getAttribute("data-palette") === "blues");
            });
          }
        }

        updateZScorePaletteUIState();
        const selOptText = selTransMode.options[selTransMode.selectedIndex]?.text || "";
        showToast(`数値を「${selOptText}」に切替・変換しました`, "info");
        renderGeoJSONLayer();
        renderMiniMapLayer();
        updateStatsSummary();
      });
      
      updateZScorePaletteUIState();
    }

    // File Drag & Drop
    const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const btnFileSelectTrigger = document.getElementById("btn-file-select-trigger");

    if (btnFileSelectTrigger) {
      btnFileSelectTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        fileInput.click();
      });
    }

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
        parseFileInput(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        parseFileInput(e.target.files[0]);
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

    // Outer Prefecture Border Checkbox
    const chkOuter = document.getElementById("chk-show-outer-border");
    if (chkOuter) {
      chkOuter.addEventListener("change", (e) => {
        state.showOuterBorder = e.target.checked;
        renderGeoJSONLayer();
      });
    }

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

    // Export Format Select (PNG / SVG)
    const formatSelect = document.getElementById("select-export-format");
    if (formatSelect) {
      formatSelect.addEventListener("change", (e) => {
        state.exportFormat = e.target.value;
        const fmtUpper = state.exportFormat.toUpperCase();

        const exportHeader = document.getElementById("btn-export-png-header");
        const exportTab = document.getElementById("btn-export-png-tab");
        const copyHeader = document.getElementById("btn-copy-png-header");
        const copyTab = document.getElementById("btn-copy-png-tab");
        const scaleGroup = document.getElementById("export-scale-group");

        if (exportHeader) exportHeader.innerHTML = `<i class="fa-solid fa-download"></i> マップ保存 (${fmtUpper})`;
        if (exportTab) exportTab.innerHTML = `<i class="fa-solid fa-download"></i> マップ保存 (${fmtUpper}を出力)`;
        if (copyHeader) copyHeader.innerHTML = `<i class="fa-regular fa-copy"></i> ${fmtUpper}コピー`;
        if (copyTab) copyTab.innerHTML = `<i class="fa-regular fa-copy"></i> クリップボードに${fmtUpper}をコピー`;

        if (scaleGroup) {
          scaleGroup.style.display = (state.exportFormat === "svg") ? "none" : "block";
        }

        showToast(`画像出力形式を「${fmtUpper}」に変更しました`, "info");
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
