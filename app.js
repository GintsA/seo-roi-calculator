const form = document.getElementById("roiForm");
const resetBtn = document.getElementById("resetBtn");
const errorsEl = document.getElementById("errors");
const resultsEl = document.getElementById("results");

const el = (id) => document.getElementById(id);

function formatEUR(value) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" }).format(value);
}

function formatInt(value) {
  return new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(value);
}

function readNumber(id) {
  const raw = el(id).value;
  if (raw === "") return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
}

function validate(values) {
  const errs = [];

  const rules = [
    { key: "currentVisitors", label: "Current monthly visitors", min: 0, max: 100000000, integer: true },
    { key: "trafficIncrease", label: "Expected traffic increase (%)", min: 0, max: 500 },
    { key: "conversionRate", label: "Conversion rate (%)", min: 0, max: 100 },
    { key: "revenuePerConversion", label: "Revenue per conversion (€)", min: 0, max: 1000000 },
  ];

  for (const r of rules) {
    const v = values[r.key];
    if (v === null) {
      errs.push(`${r.label} is required.`);
      continue;
    }
    if (v < r.min || v > r.max) {
      errs.push(`${r.label} must be between ${r.min} and ${r.max}.`);
    }
    if (r.integer && !Number.isInteger(v)) {
      errs.push(`${r.label} must be a whole number.`);
    }
  }

  return errs;
}

function calculate(values) {
  // Required formulas from the assignment doc
  const currentConversions = values.currentVisitors * (values.conversionRate / 100);
  const currentRevenue = currentConversions * values.revenuePerConversion;

  const projectedVisitors = values.currentVisitors * (1 + values.trafficIncrease / 100);
  const projectedConversions = projectedVisitors * (values.conversionRate / 100);
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

function renderResults(r) {
  el("currentRevenue").textContent = formatEUR(r.currentRevenue);
  el("projectedVisitors").textContent = formatInt(Math.round(r.projectedVisitors));
  el("projectedConversions").textContent = formatInt(Math.round(r.projectedConversions));
  el("projectedRevenue").textContent = formatEUR(r.projectedRevenue);
  el("revenueDelta").textContent = formatEUR(r.revenueDelta);

  resultsEl.hidden = false;
}

function resetAll() {
  form.reset();
  showErrors([]);
  resultsEl.hidden = true;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const values = {
    currentVisitors: readNumber("currentVisitors"),
    trafficIncrease: readNumber("trafficIncrease"),
    conversionRate: readNumber("conversionRate"),
    revenuePerConversion: readNumber("revenuePerConversion"),
  };

  const errs = validate(values);
  showErrors(errs);
  if (errs.length > 0) {
    resultsEl.hidden = true;
    return;
  }

  const result = calculate(values);
  renderResults(result);
});

resetBtn.addEventListener("click", resetAll);
