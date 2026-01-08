const LIMITS = {
  currentVisitors: {
    id: "currentVisitors",
    label: "Current monthly visitors",
    min: 0,
    max: 100000000,
    integer: true,
  },
  trafficIncreasePct: {
    id: "trafficIncreasePct",
    label: "Expected traffic increase (%)",
    min: 0,
    max: 500,
  },
  conversionRatePct: {
    id: "conversionRatePct",
    label: "Conversion rate (%)",
    min: 0,
    max: 100,
  },
  revenuePerConversion: {
    id: "revenuePerConversion",
    label: "Revenue per conversion (EUR)",
    min: 0,
    max: 1000000,
  },
};

const FIELD_DEFS = Object.entries(LIMITS);

const form = document.getElementById("roiForm");
const resetBtn = document.getElementById("resetBtn");
const errorsEl = document.getElementById("errors");
const resultsEl = document.getElementById("results");
let hasSubmitted = false;

const el = (id) => document.getElementById(id);

function formatEUR(value) {
  const formatted = value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `EUR ${formatted}`;
}

function formatInt(value) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);
}

function normalizeNumberInput(raw) {
  const cleaned = raw.replace(/\s+/g, "");
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");

  if (hasComma && hasDot) {
    const lastComma = cleaned.lastIndexOf(",");
    const lastDot = cleaned.lastIndexOf(".");
    if (lastComma > lastDot) {
      return cleaned.replace(/\./g, "").replace(",", ".");
    }
    return cleaned.replace(/,/g, "");
  }

  if (hasComma) {
    const parts = cleaned.split(",");
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length >= 1) {
      return parts[0] + parts[1];
    }
    return cleaned.replace(",", ".");
  }

  return cleaned;
}

function readNumber(id) {
  const raw = el(id).value.trim();
  if (raw === "") return null;
  const normalized = normalizeNumberInput(raw);
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

function readValues() {
  const values = {};
  for (const [key, field] of FIELD_DEFS) {
    values[key] = readNumber(field.id);
  }
  return values;
}

function requiredMessage(label) {
  const cleaned = label.replace(/\s*\(.*\)\s*$/, "");
  return `Please enter ${cleaned.toLowerCase()}.`;
}

function validateField(field, value) {
  if (value === null) {
    return requiredMessage(field.label);
  }
  if (value < field.min || value > field.max) {
    return `${field.label} must be between ${field.min} and ${field.max}.`;
  }
  if (field.integer && !Number.isInteger(value)) {
    return `${field.label} must be a whole number.`;
  }
  return null;
}

function validate(values) {
  const errs = [];
  const invalidIds = new Set();

  for (const [key, field] of FIELD_DEFS) {
    const message = validateField(field, values[key]);
    if (!message) continue;
    errs.push(message);
    invalidIds.add(field.id);
  }

  return { errs, invalidIds };
}

function setFieldErrorState(invalidIds) {
  for (const [, field] of FIELD_DEFS) {
    const input = el(field.id);
    if (!input) continue;
    if (invalidIds.has(field.id)) {
      input.classList.add("input-error");
    } else {
      input.classList.remove("input-error");
    }
  }
}

function findFirstInvalidFieldId(invalidIds) {
  for (const [, field] of FIELD_DEFS) {
    if (invalidIds.has(field.id)) return field.id;
  }
  return null;
}

// Calculates baseline and projected revenue using a linear model.
// It derives conversions from visitors and conversion rate.
// It applies the traffic increase to visitors and recomputes conversions.
// Revenue equals conversions times revenue per conversion; delta is projected minus current.
function calculate(values) {
  const currentConversions = values.currentVisitors * (values.conversionRatePct / 100);
  const currentRevenue = currentConversions * values.revenuePerConversion;

  const projectedVisitors = values.currentVisitors * (1 + values.trafficIncreasePct / 100);
  const projectedConversions = projectedVisitors * (values.conversionRatePct / 100);
  const projectedRevenue = projectedConversions * values.revenuePerConversion;

  const revenueDelta = projectedRevenue - currentRevenue;

  return {
    currentRevenue,
    projectedVisitors,
    projectedConversions,
    projectedRevenue,
    revenueDelta,
  };
}

function showErrors(errs) {
  if (errs.length === 0) {
    errorsEl.innerHTML = "";
    return;
  }
  errorsEl.innerHTML = `<ul>${errs.map((e) => `<li>${e}</li>`).join("")}</ul>`;
}

function renderResults(result) {
  el("currentRevenue").textContent = formatEUR(result.currentRevenue);
  el("projectedVisitors").textContent = formatInt(Math.round(result.projectedVisitors));
  el("projectedConversions").textContent = formatInt(Math.round(result.projectedConversions));
  el("projectedRevenue").textContent = formatEUR(result.projectedRevenue);
  el("revenueDelta").textContent = formatEUR(result.revenueDelta);

  resultsEl.hidden = false;
}

function resetAll() {
  form.reset();
  showErrors([]);
  resultsEl.hidden = true;
  setFieldErrorState(new Set());
  hasSubmitted = false;
  el(LIMITS.currentVisitors.id).focus();
}

const EXPORTS = { calculate };
if (typeof window !== "undefined") {
  window.SEORoiCalculator = EXPORTS;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  hasSubmitted = true;

  const values = readValues();
  const { errs, invalidIds } = validate(values);
  showErrors(errs);
  setFieldErrorState(invalidIds);
  if (errs.length > 0) {
    const firstInvalidId = findFirstInvalidFieldId(invalidIds);
    if (firstInvalidId) {
      el(firstInvalidId).focus();
    }
    resultsEl.hidden = true;
    return;
  }

  const result = calculate(values);
  renderResults(result);
});

resetBtn.addEventListener("click", resetAll);

form.addEventListener("input", (e) => {
  if (!hasSubmitted || !resultsEl.hidden) return;
  if (!e.target || !e.target.classList) return;

  const values = readValues();
  const { errs, invalidIds } = validate(values);
  showErrors(errs);
  setFieldErrorState(invalidIds);
});
