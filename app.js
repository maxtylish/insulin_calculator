const form = document.querySelector("#insulin-form");
const unitButtons = document.querySelectorAll(".unit-button");
const glucoseUnitLabels = document.querySelectorAll(".glucose-unit");
const warnings = document.querySelector("#warnings");

const mealPresets = {
  breakfast: {
    label: "早餐",
    cir: 7,
    isfMgdl: 110,
    targetMgdl: 130,
    notes: [
      "施打部位 >> 肚子",
      "施打完 15 分鐘後進食",
    ],
  },
  lunch: {
    label: "午餐",
    cir: 10,
    isfMgdl: 110,
    targetMgdl: 150,
    notes: [
      "施打部位 >> 手臂",
      "施打完 20 分鐘後進食",
      "因為 11:30 開始吃，若當下血糖低於 130，打完胰島素後先補 1 顆葡萄糖片",
      "週四體育課 >>> 打手臂後，低於 150 時先補充 2 顆糖，預防性課間低血糖；低於 170 時先補充 1 顆糖，預防性課間低血糖",
    ],
  },
  dinner: {
    label: "晚餐",
    cir: 10,
    isfMgdl: 110,
    targetMgdl: 140,
    notes: [
      "施打部位 >> 左大腿",
      "施打完 30~45 分鐘後進食",
      "睡前長效固定 3 單位",
      "睡前長效施打部位 >> 右大腿",
    ],
  },
};

// Carb values per 1 unit (份/顆/片/組/罐)
// For weight-based items (100g base): entering 1.4 portions = 1.4 × carb value
const carbFoods = {
  // 米飯
  white_rice: 30,            // 白飯 100公克 = 30克碳水

  // 麵類
  udon: 24.6,                // 烏龍麵 100公克 = 24.6克碳水
  yangchun_noodle: 27.8,     // 陽春麵 100公克 = 27.8克碳水
  oil_noodle: 25.5,          // 油麵 100公克 = 25.5克碳水
  spaghetti: 27.4,           // 義大利麵 100公克 = 27.4克碳水
  penne: 29,                 // 筆管麵 100公克 = 29克碳水

  // 其他主食
  potato_skin: 12.9,         // 馬鈴薯帶皮 100公克 = 12.9克碳水

  // 吐司類
  wheat_toast: 12,           // 全麥吐司 1片 = 12克碳水
  white_toast: 12,           // 白吐司 1片 = 12克碳水
  strawberry_toast: 15.25,   // 草莓吐司 1片 = 15.25克碳水

  // 早餐類
  berry_party: 3.5,          // 莓果派對 1份 = 3.5克碳水
  bacon_egg_pancake: 30,     // 培根蛋餅 1份 = 30克碳水
  pan_fried_dumpling: 15,    // 小煎餃 55公克 = 15克碳水
  dumpling: 4,               // 水餃 1顆 = 4克碳水
  soup_dumpling: 4.3,        // 湯包 1顆 = 4.3克碳水

  // 麥當勞
  mcd_combo_1: 66,           // 麥當勞組合1 1組 = 66克碳水
  mcd_combo_2: 55.2,         // 麥當勞組合2 1組 = 55.2克碳水

  // 水果 / 甜點 (100公克為1份)
  guava: 10.6,               // 芭樂 100公克 = 10.6克碳水
  apple: 11.9,               // 蘋果 100公克 = 11.9克碳水
  cherry: 19.12,             // 櫻桃 100公克 = 19.12克碳水
  banana_peel: 10.6,         // 香蕉帶皮 100公克 = 10.6克碳水
  banana: 22.1,              // 香蕉去皮 100公克 = 22.1克碳水
  pineapple: 13.6,           // 鳳梨 100公克 = 13.6克碳水
  dragon_fruit: 12.36,       // 火龍果 100公克 = 12.36克碳水
  strawberry: 9.3,           // 草莓去蒂 100公克 = 9.3克碳水

  // 飲品
  milk_100: 4.8,             // 牛奶 100公克 = 4.8克碳水
  milk_150: 7,               // 牛奶 150公克 = 7克碳水
  milk_200: 10,              // 牛奶 200公克 = 10克碳水
  yogurt_100: 12,            // 優酪乳 100公克 = 12克碳水
  yakult: 14.7,              // 養樂多 90ML = 14.7克碳水
};

// Meal-specific 主餐 options (sorted by food type)
const mainMealOptions = {
  breakfast: [
    // ── 米飯 ──
    { value: "white_rice",         label: "白飯 100公克 (碳水30克)" },
    // ── 麵類 ──
    { value: "udon",               label: "烏龍麵 100公克 (碳水24.6克)" },
    { value: "yangchun_noodle",    label: "陽春麵 100公克 (碳水27.8克)" },
    { value: "oil_noodle",         label: "油麵 100公克 (碳水25.5克)" },
    { value: "spaghetti",          label: "義大利麵 100公克 (碳水27.4克)" },
    { value: "penne",              label: "筆管麵 100公克 (碳水29克)" },
    // ── 其他主食 ──
    { value: "potato_skin",        label: "馬鈴薯帶皮 100公克 (碳水12.9克)" },
    // ── 吐司類 ──
    { value: "wheat_toast",        label: "全麥吐司 1片 (碳水12克)" },
    { value: "white_toast",        label: "白吐司 1片 (碳水12克)" },
    { value: "strawberry_toast",   label: "草莓吐司 1片 (碳水15.25克)" },
    // ── 早餐類 ──
    { value: "berry_party",        label: "莓果派對 1份 (碳水3.5克)" },
    { value: "bacon_egg_pancake",  label: "培根蛋餅 1份 (碳水30克)" },
    { value: "pan_fried_dumpling", label: "小煎餃 55公克 (碳水15克)" },
    { value: "dumpling",           label: "水餃 1顆 (碳水4克)" },
    { value: "soup_dumpling",      label: "湯包 1顆 (碳水4.3克)" },
  ],
  lunch: [
    // ── 米飯 ──
    { value: "white_rice",      label: "白飯 100公克 (碳水30克)" },
    // ── 麵類 ──
    { value: "udon",            label: "烏龍麵 100公克 (碳水24.6克)" },
    { value: "yangchun_noodle", label: "陽春麵 100公克 (碳水27.8克)" },
    { value: "oil_noodle",      label: "油麵 100公克 (碳水25.5克)" },
    { value: "spaghetti",       label: "義大利麵 100公克 (碳水27.4克)" },
    { value: "penne",           label: "筆管麵 100公克 (碳水29克)" },
    // ── 其他主食 ──
    { value: "potato_skin",     label: "馬鈴薯帶皮 100公克 (碳水12.9克)" },
    // ── 餃類 ──
    { value: "dumpling",        label: "水餃 1顆 (碳水4克)" },
    { value: "soup_dumpling",   label: "湯包 1顆 (碳水4.3克)" },
    // ── 麥當勞 ──
    { value: "mcd_combo_1",     label: "麥當勞組合1（鱈魚堡＋玉米杯＋牛奶）1組 (碳水66克)" },
    { value: "mcd_combo_2",     label: "麥當勞組合2（鱈魚堡＋玉米杯＋水果袋）1組 (碳水55.2克)" },
  ],
  dinner: [
    // ── 米飯 ──
    { value: "white_rice",      label: "白飯 100公克 (碳水30克)" },
    // ── 麵類 ──
    { value: "udon",            label: "烏龍麵 100公克 (碳水24.6克)" },
    { value: "yangchun_noodle", label: "陽春麵 100公克 (碳水27.8克)" },
    { value: "oil_noodle",      label: "油麵 100公克 (碳水25.5克)" },
    { value: "spaghetti",       label: "義大利麵 100公克 (碳水27.4克)" },
    { value: "penne",           label: "筆管麵 100公克 (碳水29克)" },
    // ── 其他主食 ──
    { value: "potato_skin",     label: "馬鈴薯帶皮 100公克 (碳水12.9克)" },
    // ── 餃類 ──
    { value: "dumpling",        label: "水餃 1顆 (碳水4克)" },
    { value: "soup_dumpling",   label: "湯包 1顆 (碳水4.3克)" },
    // ── 麥當勞 ──
    { value: "mcd_combo_1",     label: "麥當勞組合1（鱈魚堡＋玉米杯＋牛奶）1組 (碳水66克)" },
    { value: "mcd_combo_2",     label: "麥當勞組合2（鱈魚堡＋玉米杯＋水果袋）1組 (碳水55.2克)" },
  ],
};

const fields = {
  mealPeriod:     document.querySelector("#meal-period"),
  carbFoods:      Array.from(document.querySelectorAll(".carb-food")),
  carbQuantities: Array.from(document.querySelectorAll(".carb-quantity")),
  currentGlucose: document.querySelector("#current-glucose"),
  carbs:          document.querySelector("#carbs"),
  activeInsulin:  document.querySelector("#active-insulin"),
};

const output = {
  recommended: document.querySelector("#recommended-dose"),
  meal:        document.querySelector("#meal-dose"),
  correction:  document.querySelector("#correction-dose"),
  iob:         document.querySelector("#iob-dose"),
  raw:         document.querySelector("#raw-dose"),
};

const presetOutput = {
  cir:     document.querySelector("#display-cir"),
  isf:     document.querySelector("#display-isf"),
  isfUnit: document.querySelector("#display-isf-unit"),
  target:  document.querySelector("#display-target"),
};

const mealNotes = document.querySelector("#meal-notes");

let activeUnit = "mgdl";

// ── Utilities ─────────────────────────────────────────────────────

function toNumber(input) {
  return Number.parseFloat(input.value) || 0;
}

function formatDose(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function convertGlucose(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  return fromUnit === "mgdl" ? value / 18 : value * 18;
}

function formatInput(value) {
  return activeUnit === "mgdl"
    ? String(Math.round(value))
    : String(Math.round(value * 10) / 10);
}

function formatGlucoseValue(value) {
  return activeUnit === "mgdl"
    ? String(Math.round(value))
    : (Math.round(value * 10) / 10).toFixed(1);
}

// ── Unit switching ────────────────────────────────────────────────

function setUnit(unit) {
  if (unit === activeUnit) return;
  const previousUnit = activeUnit;
  activeUnit = unit;

  fields.currentGlucose.value = formatInput(
    convertGlucose(toNumber(fields.currentGlucose), previousUnit, unit)
  );

  unitButtons.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.unit === unit)
  );

  const label = unit === "mgdl" ? "mg/dL" : "mmol/L";
  glucoseUnitLabels.forEach((el) => (el.textContent = label));

  calculate();
}

// ── Preset / notes ────────────────────────────────────────────────

function getSelectedPreset() {
  return mealPresets[fields.mealPeriod.value] || mealPresets.breakfast;
}

function getActivePresetValues() {
  const preset = getSelectedPreset();
  return {
    carbRatio:        preset.cir,
    correctionFactor: activeUnit === "mgdl" ? preset.isfMgdl : preset.isfMgdl / 18,
    targetGlucose:    activeUnit === "mgdl" ? preset.targetMgdl : preset.targetMgdl / 18,
  };
}

function renderPresetValues() {
  const preset = getSelectedPreset();
  const isf    = activeUnit === "mgdl" ? preset.isfMgdl   : preset.isfMgdl   / 18;
  const target = activeUnit === "mgdl" ? preset.targetMgdl : preset.targetMgdl / 18;
  const label  = activeUnit === "mgdl" ? "mg/dL" : "mmol/L";

  presetOutput.cir.textContent     = formatDose(preset.cir);
  presetOutput.isf.textContent     = formatGlucoseValue(isf);
  presetOutput.isfUnit.textContent = `${label} / 1 單位`;
  presetOutput.target.textContent  = formatGlucoseValue(target);
  mealNotes.innerHTML = preset.notes.map((n) => `<p>${n}</p>`).join("");
}

// ── Food select helpers ───────────────────────────────────────────

function buildOptions(options, selectedValue = "") {
  return (
    '<option value="">不選擇</option>' +
    options
      .map(
        (opt) =>
          `<option value="${opt.value}"${opt.value === selectedValue ? " selected" : ""}>${opt.label}</option>`
      )
      .join("")
  );
}

// Populate 主餐 (food-1) based on meal period
function updateMainMealSelect() {
  const period  = fields.mealPeriod.value;
  const options = mainMealOptions[period] || mainMealOptions.breakfast;
  const select  = document.querySelector("#carb-food-1");
  select.innerHTML = buildOptions(options, select.value);
  updateSecondaryFoodSelect();
}

// Populate 餐食2 (food-2) — same options as 主餐 minus selected main item
function updateSecondaryFoodSelect() {
  const period      = fields.mealPeriod.value;
  const options     = mainMealOptions[period] || mainMealOptions.breakfast;
  const mainVal     = document.querySelector("#carb-food-1").value;
  const secondary   = document.querySelector("#carb-food-2");
  const filtered    = options.filter((opt) => opt.value !== mainVal);
  secondary.innerHTML = buildOptions(filtered, secondary.value);
}

// ── Food carb calculation ─────────────────────────────────────────

function hasSelectedFoods() {
  return fields.carbFoods.some((sel) => sel.value);
}

function clearFoodSelections() {
  fields.carbFoods.forEach((sel) => (sel.value = ""));
}

function applyCarbFoodSelection() {
  if (!hasSelectedFoods()) {
    calculate();
    return;
  }

  const total = fields.carbFoods.reduce((sum, sel, i) => {
    const carbPerUnit = carbFoods[sel.value];
    if (carbPerUnit === undefined) return sum;
    const qty = Math.max(toNumber(fields.carbQuantities[i]), 0);
    return sum + carbPerUnit * qty;
  }, 0);

  fields.carbs.value = formatDose(total);
  calculate();
}

// ── Warnings ──────────────────────────────────────────────────────

function renderWarnings(currentGlucose, targetGlucose, recommendedDose) {
  const lowThreshold  = activeUnit === "mgdl" ? 70   : 3.9;
  const highThreshold = activeUnit === "mgdl" ? 250  : 13.9;
  const items = [];

  if (currentGlucose > 0 && currentGlucose < lowThreshold) {
    items.push({ tone: "danger",  text: "目前血糖偏低。通常應先處理低血糖，不建議只依計算結果施打餐前胰島素。" });
  }
  if (currentGlucose >= highThreshold) {
    items.push({ tone: "caution", text: "目前血糖偏高。若有酮體、嘔吐、腹痛或不適，請依照醫療團隊的高血糖處置流程。" });
  }
  if (targetGlucose > currentGlucose) {
    items.push({ tone: "caution", text: "目標血糖高於目前血糖，校正劑量會是負值，結果主要來自碳水劑量。" });
  }
  if (recommendedDose === 0) {
    items.push({ tone: "caution", text: "估算結果為 0 單位。請確認輸入值與個人醫囑，尤其是 CIR 醣類係數、ISF 敏感係數與有效胰島素。" });
  }

  warnings.innerHTML = items
    .map((item) => `<div class="warning-item ${item.tone}">${item.text}</div>`)
    .join("");
}

// ── Core calculation ──────────────────────────────────────────────

function calculate() {
  renderPresetValues();

  const currentGlucose = toNumber(fields.currentGlucose);
  const carbs          = toNumber(fields.carbs);
  const activeInsulin  = Math.max(toNumber(fields.activeInsulin), 0);
  const { carbRatio, correctionFactor, targetGlucose } = getActivePresetValues();

  const mealDose      = carbs / carbRatio;
  const correctionDose = (currentGlucose - targetGlucose) / correctionFactor;
  const rawDose       = Math.max(0, mealDose + correctionDose - activeInsulin);

  output.meal.textContent        = formatDose(mealDose);
  output.correction.textContent  = formatDose(correctionDose);
  output.iob.textContent         = `-${formatDose(activeInsulin)}`;
  output.raw.textContent         = formatDose(rawDose);
  output.recommended.textContent = formatDose(rawDose);

  renderWarnings(currentGlucose, targetGlucose, rawDose);
}

// ── Event listeners ───────────────────────────────────────────────

// Meal period → rebuild food selects
fields.mealPeriod.addEventListener("change", () => {
  clearFoodSelections();
  updateMainMealSelect();
  calculate();
});

// 主餐 change → update 餐食2 and recalculate
document.querySelector("#carb-food-1").addEventListener("change", () => {
  updateSecondaryFoodSelect();
  applyCarbFoodSelection();
});

// 餐食2, 甜點, 飲品 changes
["#carb-food-2", "#carb-food-3", "#carb-food-4"].forEach((id) => {
  document.querySelector(id).addEventListener("change", applyCarbFoodSelection);
});

// Quantity changes (all 4 rows)
fields.carbQuantities.forEach((input) => {
  input.addEventListener("input", applyCarbFoodSelection);
});

// Manual carb edit → clear food selections
fields.carbs.addEventListener("input", () => {
  clearFoodSelections();
});

// General form input → recalculate
form.addEventListener("input", calculate);

// Unit toggle
unitButtons.forEach((btn) => {
  btn.addEventListener("click", () => setUnit(btn.dataset.unit));
});

// ── Init ──────────────────────────────────────────────────────────
updateMainMealSelect();
calculate();
