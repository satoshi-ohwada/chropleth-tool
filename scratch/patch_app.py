import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove PRESETS block completely
content = re.sub(r'// --- 3\. Presets Open Data.*?// --- 4\. Application State ---', '// --- 4. Application State ---\n', content, flags=re.DOTALL)

# 2. Add baselinePopulation and isPerCapita to state
content = content.replace(
    'const state = {\n    geojsonData: null,',
    'const state = {\n    geojsonData: null,\n    baselinePopulation: {},\n    isPerCapitaMode: false,'
)

# 3. Replace loadPresetData with loadEstatSampleData
old_load_preset = """  // Load verification preset dataset (subtle testing button)
  function loadPresetData() {
    state.variables = JSON.parse(JSON.stringify(PRESETS));
    populateVariableDropdowns();
    openVariableModal("population");
    showToast("動作確認用データを読み込みました。作図する項目を選択してください。", "info");
  }"""

new_load_estat = """  // Load e-Stat sample dataset
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
"""
content = content.replace(old_load_preset, new_load_estat)

# 4. Replace state.currentValues with getEffectiveValues() in specific places where data is READ for display/stats
read_places = [
    "Object.values(state.currentValues).filter(",
    "matchedName ? state.currentValues[matchedName] : null",
    "let val = state.currentValues[matchedName];",
    "let val = state.currentValues[m.name];",
    "Object.values(state.currentValues).forEach(",
    "Object.entries(state.currentValues)",
    "const val = state.currentValues[muniName];",
    "let v = state.currentValues[m.name];"
]
for place in read_places:
    new_place = place.replace("state.currentValues", "getEffectiveValues()")
    content = content.replace(place, new_place)

# 5. Add event listener for chk-per-capita
init_events = """    document.getElementById("btn-export-csv").addEventListener("click", exportCurrentCSV);
    const exportCsvTab = document.getElementById("btn-export-csv-tab");
    if (exportCsvTab) exportCsvTab.addEventListener("click", exportCurrentCSV);"""

new_init_events = init_events + """
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
    }"""
content = content.replace(init_events, new_init_events)

# 6. Change btn-load-preset-subtle listener to loadEstatSampleData
content = content.replace('btnPresetSubtle.addEventListener("click", loadPresetData);', 'btnPresetSubtle.addEventListener("click", loadEstatSampleData);')

# 7. Add baseline population fetch to init
init_func = """  document.addEventListener("DOMContentLoaded", () => {
    initLeafletMap();
    loadGeoJSON();
    bindEvents();
    initEmptyState();
  });"""
new_init_func = """  document.addEventListener("DOMContentLoaded", () => {
    initLeafletMap();
    loadGeoJSON();
    bindEvents();
    initEmptyState();
    
    // Fetch baseline population
    fetch("./data/baseline_population.csv")
      .then(res => res.text())
      .then(text => {
        const lines = text.split(/\\r?\\n/).map(l => l.trim()).filter(Boolean);
        for(let i=1; i<lines.length; i++) {
          const parts = lines[i].split(",");
          if (parts.length >= 3) {
            state.baselinePopulation[parts[1]] = parseFloat(parts[2]);
          }
        }
        console.log("Baseline population loaded.");
      })
      .catch(err => console.error("Failed to load baseline population", err));
  });"""
content = content.replace(init_func, new_init_func)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("app.js patched successfully.")
