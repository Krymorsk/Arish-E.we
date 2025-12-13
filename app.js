// app.js — One card per car, show on-road range on cards and show ex-showroom/TCS/Insurance/On-road in details.
// Calculator upgraded: asks years + distance for that period and compares EV vs Petrol/Diesel/CNG.
// Also supports images from images/<carId>.jpg (use JPG/PNG).

/* ---------- DATA: cars with variants including tcs and insurance fields (may be null) ---------- */
const cars = [
  // Tiago EV
  {
    id: 'tiago-ev',
    model: 'Tiago EV',
    image: 'images/tiago-ev.jpg',
    variants: [
      { id: 'tiago-mr-xe', name: 'MR XE', price_ex_showroom: 799000, tcs: 0, insurance: 29000 },
      { id: 'tiago-mr-xt', name: 'MR XT', price_ex_showroom: 899000, tcs: 0, insurance: 31000 },
      { id: 'tiago-lr-xt', name: 'LR XT', price_ex_showroom: 1014000, tcs: 0, insurance: 35000 },
      { id: 'tiago-lr-xz-techlux', name: 'LR XZ+ Tech Lux', price_ex_showroom: 1114000, tcs: 0, insurance: 38000 }
    ],
    common: { range_est: 200, battery_kwh: 26 }
  },

  // Punch EV
  {
    id: 'punch-ev',
    model: 'Punch EV',
    image: 'images/punch-ev.jpg',
    variants: [
      { id: 'punch-smart', name: 'Smart', price_ex_showroom: 999000, tcs: 0, insurance: 34000 },
      { id: 'punch-smart-plus', name: 'Smart +', price_ex_showroom: 1114000, tcs: 0, insurance: 36000 },
      { id: 'punch-adventure', name: 'Adventure', price_ex_showroom: 1184000, tcs: 0, insurance: 38000 },
      { id: 'punch-adventure-s', name: 'Adventure S', price_ex_showroom: 1214000, tcs: 0, insurance: 40000 },
      { id: 'punch-empowered', name: 'Empowered', price_ex_showroom: 1264000, tcs: 0, insurance: 42000 },
      { id: 'punch-adventure-lr', name: 'Adventure LR', price_ex_showroom: 1284000, tcs: 0, insurance: 43000 },
      { id: 'punch-empowered-plus', name: 'Empowered +', price_ex_showroom: 1284000, tcs: 0, insurance: 43000 }
    ],
    common: { range_est: 350, battery_kwh: 35 }
  },

  // Nexon.ev
  {
    id: 'nexon-ev',
    model: 'Nexon.ev',
    image: 'images/nexon-ev.jpg',
    variants: [
      { id: 'nexon-3.0-creative-mr', name: '3.0 Creative + MR', price_ex_showroom: 1249000, tcs: 0, insurance: 46000 },
      { id: 'nexon-3.0-creative-45', name: '3.0 Creative 45', price_ex_showroom: 1399000, tcs: 0, insurance: 50000 },
      { id: 'nexon-3.0-fearless-45', name: '3.0 Fearless 45', price_ex_showroom: 1499000, tcs: 0, insurance: 54000 },
      { id: 'nexon-3.0-empowered-45', name: '3.0 Empowered 45', price_ex_showroom: 1599000, tcs: 0, insurance: 58000 },
      { id: 'nexon-3.0-empowereda-45', name: '3.0 Empowered+ A 45', price_ex_showroom: 1729000, tcs: 0, insurance: 62000 },
      { id: 'nexon-3.0-empowereda-45-rdk', name: '3.0 Empowered+ A 45 RDK', price_ex_showroom: 1749000, tcs: 0, insurance: 64000 }
    ],
    common: { range_est: 405, battery_kwh: 45 }
  },

  // Curvv EV
  {
    id: 'curvv-ev',
    model: 'Curvv EV',
    image: 'images/curvv-ev.jpg',
    variants: [
      { id: 'curvv-accomplished-55', name: 'Accomplished 55', price_ex_showroom: 1925000, tcs: 0, insurance: 90000 },
      { id: 'curvv-accomplished-s-45', name: 'Accomplished + S 45', price_ex_showroom: 1929000, tcs: 0, insurance: 91000 },
      { id: 'curvv-accomplished-s-55', name: 'Accomplished+ S 55', price_ex_showroom: 1999000, tcs: 0, insurance: 94000 },
      { id: 'curvv-empowered-plus-55', name: 'Empowered+ 55', price_ex_showroom: 2125000, tcs: 0, insurance: 100000 },
      { id: 'curvv-empowereda-55', name: 'Empowered+ A 55', price_ex_showroom: 2199000, tcs: 0, insurance: 104000 },
      { id: 'curvv-empowereda-55-dk', name: 'Empowered+ A 55 DK', price_ex_showroom: 2224000, tcs: 0, insurance: 106000 }
    ],
    common: { range_est: 500, battery_kwh: 55 }
  },

  // Harrier EV (no prices in earlier list — left null)
  {
    id: 'harrier-ev',
    model: 'Harrier.ev',
    image: 'images/harrier-ev.jpg',
    variants: [
      { id: 'harrier-65-adventure', name: '65 (Adventure)', price_ex_showroom: null, tcs: null, insurance: null },
      { id: 'harrier-75-adventure-s', name: '75 (Adventure S)', price_ex_showroom: null, tcs: null, insurance: null },
      { id: 'harrier-fearless-plus', name: 'Fearless +', price_ex_showroom: null, tcs: null, insurance: null },
      { id: 'harrier-empowered-qwd-75', name: 'Empowered QWD 75', price_ex_showroom: null, tcs: null, insurance: null }
    ],
    common: { range_est: 500, battery_kwh: 75 }
  }
];

/* ---------- DOM refs ---------- */
const blocksGrid = document.getElementById('blocksGrid');
const detailsPanel = document.getElementById('detailsPanel');
const detailContent = document.getElementById('detailContent');
const detailsEmpty = detailsPanel.querySelector('.empty');
const searchInput = document.getElementById('search');
const exportCsvBtn = document.getElementById('exportCsv');

/* notes persistence */
const notesKey = 'tata_ev_notes_price_v4';
let notes = JSON.parse(localStorage.getItem(notesKey) || '{}');

/* ---------- Calculator Configuration ---------- */
const FUEL_CONFIG = {
  petrol: { kmpl: 15, pricePerUnit: 96, unit: 'litre' },
  diesel: { kmpl: 20, pricePerUnit: 87, unit: 'litre' },
  cng: { kmpl: 25, pricePerUnit: 96, unit: 'kg' }
};

/* ---------- helpers ---------- */
function formatRupee(value){
  if(value === null || value === undefined || value === '') return '—';
  if(isNaN(Number(value))) return String(value);
  return '₹ ' + Number(value).toLocaleString();
}

function formatRupeeRounded(value) {
  return '₹ ' + Math.round(value).toLocaleString();
}

function computeOnRoad(v){
  const ex = Number(v.price_ex_showroom) || 0;
  const t = Number(v.tcs) || 0;
  const ins = Number(v.insurance) || 0;
  if(ex === 0 && t === 0 && ins === 0) return null;
  return ex + t + ins;
}

function safeNum(x){ return (x === null || x === undefined || isNaN(Number(x))) ? null : Number(x); }

/* ---------- Calculator Functions ---------- */
function validateCalculatorInputs(years, distance, costKwh) {
  const errors = [];
  if (!years || years <= 0) errors.push('Years must be greater than 0');
  if (!distance || distance <= 0) errors.push('Distance must be greater than 0');
  if (costKwh < 0) errors.push('Energy cost cannot be negative');
  return errors;
}

function calculateFuelCost(distance, fuelType) {
  const config = FUEL_CONFIG[fuelType];
  if (!config) return null;
  const unitsConsumed = distance / config.kmpl;
  const totalCost = unitsConsumed * config.pricePerUnit;
  return { unitsConsumed, totalCost };
}

function calculateEVCost(distance, batteryKwh, rangeKm, costPerKwh) {
  if (!batteryKwh || !rangeKm || batteryKwh <= 0 || rangeKm <= 0) return null;
  const energyPerKm = batteryKwh / rangeKm;
  const totalKwh = energyPerKm * distance;
  const totalCost = totalKwh * costPerKwh;
  return { energyPerKm, totalKwh, totalCost };
}

function calculateSavings(evCost, otherCost) {
  if (evCost === null || otherCost === null) return null;
  return otherCost - evCost;
}

function generateCalculatorReport(years, distance, evResult, fuelResults) {
  const kmPerYear = distance / years;
  let report = `Period: ${years} year(s)\n`;
  report += `Total distance: ${distance.toLocaleString()} km\n`;
  report += `Average per year: ${kmPerYear.toLocaleString()} km/year\n\n`;

  // EV section
  if (evResult) {
    report += `EV:\n`;
    report += `  Energy used: ${evResult.totalKwh.toFixed(1)} kWh\n`;
    report += `  Total cost: ${formatRupeeRounded(evResult.totalCost)}\n`;
    report += `  Per year: ${formatRupeeRounded(evResult.totalCost / years)}\n\n`;
  } else {
    report += `EV cost: Not available for this model\n\n`;
  }

  // Fuel sections
  Object.entries(fuelResults).forEach(([fuelType, result]) => {
    const config = FUEL_CONFIG[fuelType];
    const label = fuelType.toUpperCase();
    report += `${label} (${config.kmpl} km/${config.unit} @ ₹${config.pricePerUnit}):\n`;
    report += `  Total: ${formatRupeeRounded(result.totalCost)}\n`;
    report += `  Per year: ${formatRupeeRounded(result.totalCost / years)}\n\n`;
  });

  // Savings section
  if (evResult) {
    report += `SAVINGS vs EV:\n`;
    Object.entries(fuelResults).forEach(([fuelType, result]) => {
      const savings = calculateSavings(evResult.totalCost, result.totalCost);
      report += `  ${fuelType.charAt(0).toUpperCase() + fuelType.slice(1)}: ${formatRupeeRounded(savings)}\n`;
    });
  }

  return report;
}

function runCalculator(years, distance, costKwh, batteryKwh, rangeKm) {
  // Validate inputs
  const errors = validateCalculatorInputs(years, distance, costKwh);
  if (errors.length > 0) {
    return { success: false, error: errors.join('\n') };
  }

  // Calculate fuel costs
  const fuelResults = {};
  Object.keys(FUEL_CONFIG).forEach(fuelType => {
    fuelResults[fuelType] = calculateFuelCost(distance, fuelType);
  });

  // Calculate EV cost
  const evResult = calculateEVCost(distance, batteryKwh, rangeKm, costKwh);

  // Generate report
  const report = generateCalculatorReport(years, distance, evResult, fuelResults);

  return { success: true, report, evResult, fuelResults };
}

/* ---------- render model cards (one per car) ---------- */
function createModelCard(car){
  const el = document.createElement('div');
  el.className = 'model-card';
  el.dataset.id = car.id;

  // compute on-road min / max across variants where possible
  const onroads = car.variants.map(v => computeOnRoad(v)).filter(x => typeof x === 'number' && !isNaN(x));
  let onroadSummary = '';
  if(onroads.length){
    const min = Math.min(...onroads), max = Math.max(...onroads);
    onroadSummary = (min === max) ? `${formatRupee(min)}` : `${formatRupee(min)} - ${formatRupee(max)}`;
  }

  // image HTML (use placeholder if file not found)
  const imgHtml = `<img src="${car.image}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` +
                  `<div class="placeholder" style="display:none">No image<br>${car.id}</div>`;

  el.innerHTML = `
    <div class="model-left">${imgHtml}</div>
    <div style="flex:1">
      <div class="title">${car.model}</div>
      <div class="summary">${car.variants.length} variant(s) • ${onroadSummary || 'On-road price on request'}</div>
      <div class="badges">
        ${car.common.range_est ? `<div class="badge">Range: ${car.common.range_est} km</div>` : ''}
        ${car.common.battery_kwh ? `<div class="badge">Battery: ${car.common.battery_kwh} kWh</div>` : ''}
        <div class="badge">Variants: ${car.variants.length}</div>
      </div>
    </div>
  `;
  el.addEventListener('click', ()=>selectCar(car.id));
  return el;
}

function renderModelCards(list = cars){
  blocksGrid.innerHTML = '';
  list.forEach(car => blocksGrid.appendChild(createModelCard(car)));
}

/* ---------- select car and show variant-aware details ---------- */
let selectedCarId = null;
function selectCar(carId){
  selectedCarId = carId;
  document.querySelectorAll('.model-card').forEach(c => c.classList.toggle('selected', c.dataset.id === carId));
  const car = cars.find(x => x.id === carId);
  if(car) showCarDetails(car);
}

function showCarDetails(car){
  detailsEmpty.style.display = 'none';
  detailContent.style.display = 'block';

  // build variant <select>
  const options = car.variants.map(v => {
    const onroad = computeOnRoad(v);
    const onroadText = onroad ? formatRupee(onroad) : 'On-road: —';
    return `<option value="${v.id}">${v.name} — ${onroadText}</option>`;
  }).join('');

  detailContent.innerHTML = `
    <div class="detail-header">
      <div style="flex:1">
        <div class="detail-title">${car.model}</div>
        <div class="detail-sub">${car.variants.length} variant(s)</div>
      </div>

      <div style="text-align:right">
        <label style="display:block;font-size:12px;color:var(--muted);margin-bottom:6px">Select variant</label>
        <select id="variantSelect" aria-label="${car.model} variants">${options}</select>
      </div>
    </div>

    <div id="variantArea" style="margin-top:12px"></div>
  `;

  const variantSelect = document.getElementById('variantSelect');

  function renderVariantArea(variantId){
    const v = car.variants.find(x => x.id === variantId);
    const priceEx = v.price_ex_showroom ? formatRupee(v.price_ex_showroom) : '—';
    const tcs = (v.tcs !== null && v.tcs !== undefined) ? formatRupee(v.tcs) : '—';
    const ins = (v.insurance !== null && v.insurance !== undefined) ? formatRupee(v.insurance) : '—';
    const onroad = computeOnRoad(v);
    const onroadText = onroad ? formatRupee(onroad) : '—';
    const battery = safeNum(car.common.battery_kwh ?? v.battery_kwh) ?? '-';
    const range = safeNum(car.common.range_est ?? v.range_km) ?? '-';

    const features = v.features ? (Array.isArray(v.features) ? v.features.map(f => `<li>${f}</li>`).join('') : '') : '';

    // image in details (use same image path, show placeholder if missing)
    const imgTag = `<img src="${car.image}" alt="${car.model}" onerror="this.style.display='none';document.getElementById('imgPlaceholder').style.display='flex'" style="width:100%;height:160px;object-fit:cover;border-radius:8px">` +
                   `<div id="imgPlaceholder" class="placeholder" style="display:none">${car.model}</div>`;

    // New calculator: years + total distance
    detailContent.querySelector('#variantArea').innerHTML = `
      ${imgTag}
      <table class="spec-table" style="margin-top:12px">
        <tr><th>Variant</th><td>${v.name}</td></tr>
        <tr><th>Ex-showroom</th><td>${priceEx}</td></tr>
        <tr><th>TCS</th><td>${tcs}</td></tr>
        <tr><th>Insurance</th><td>${ins}</td></tr>
        <tr><th>On-road</th><td>${onroadText}</td></tr>
        <tr><th>Battery</th><td>${battery === '-' ? '-' : battery + ' kWh'}</td></tr>
        <tr><th>Range (est)</th><td>${range === '-' ? '-' : range + ' km'}</td></tr>
      </table>

      ${features ? `<div style="margin-top:10px"><strong>Features</strong><ul style="margin-top:6px">${features}</ul></div>` : ''}

      <div class="calc" style="margin-top:12px">
        <h4>Running cost calculator</h4>
        <div style="display:flex;gap:8px;margin-bottom:8px">
          <div style="flex:1">
            <label class="kv">Years (period)</label>
            <input id="calcYears" type="number" value="1" min="1" />
          </div>
          <div style="flex:1">
            <label class="kv">Total distance in that period (km)</label>
            <input id="calcDistance" type="number" value="12000" min="1" />
          </div>
        </div>

        <label class="kv">Energy cost (₹ / kWh) — EV</label>
        <input id="costKwh" type="number" value="8" />

        <div style="height:8px"></div>
        <div class="row">
          <button id="btnCalc" class="btn primary">Calculate</button>
        </div>

        <div id="calcResult" style="margin-top:12px;color:var(--muted);white-space:pre-line"></div>
      </div>

      <div class="notes" style="margin-top:12px">
        <h4>Notes</h4>
        <textarea id="noteArea">${notes[car.id + '::' + v.id] || ''}</textarea>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="saveNoteBtn" class="btn">Save note</button>
          <button id="copySpecBtn" class="btn">Copy short spec</button>
        </div>
      </div>
    `;

    // Calculator logic using refactored functions
    document.getElementById('btnCalc').onclick = () => {
      const years = Number(document.getElementById('calcYears').value) || 0;
      const distanceTotal = Number(document.getElementById('calcDistance').value) || 0;
      const costKwh = Number(document.getElementById('costKwh').value) || 0;
      const batteryKwh = safeNum(battery);
      const rangeKm = safeNum(range);

      const result = runCalculator(years, distanceTotal, costKwh, batteryKwh, rangeKm);

      if (!result.success) {
        document.getElementById('calcResult').textContent = result.error;
        return;
      }

      document.getElementById('calcResult').textContent = result.report;
    };


    // notes save
    document.getElementById('saveNoteBtn').onclick = () => {
      const txt = document.getElementById('noteArea').value;
      notes[car.id + '::' + v.id] = txt;
      localStorage.setItem(notesKey, JSON.stringify(notes));
      alert('Note saved for ' + car.model + ' — ' + v.name);
    };

    // copy short spec
    document.getElementById('copySpecBtn').onclick = async () => {
      const onroadText = computeOnRoad(v) ? formatRupee(computeOnRoad(v)) : '—';
      const copyTxt = `${car.model} — ${v.name} — On-road: ${onroadText} — Ex: ${v.price_ex_showroom ? formatRupee(v.price_ex_showroom) : '—'}`;
      try {
        await navigator.clipboard.writeText(copyTxt);
        alert('Short spec copied to clipboard');
      } catch {
        alert('Unable to copy; please copy manually.');
      }
    };
  }

  // initial render: first variant selected and scrolled into view
  variantSelect.selectedIndex = 0;
  renderVariantArea(car.variants[0].id);
  setTimeout(()=> variantSelect.scrollIntoView({block:'nearest', behavior:'smooth'}), 80);

  variantSelect.addEventListener('change', (e) => renderVariantArea(e.target.value));
}

/* ---------- search ---------- */
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = cars.filter(car => {
    const hay = (car.model + ' ' + car.variants.map(v => v.name).join(' ')).toLowerCase();
    return hay.includes(q);
  });
  renderModelCards(filtered);

  if(selectedCarId && !filtered.find(c => c.id === selectedCarId)) {
    selectedCarId = null;
    document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
    detailContent.style.display = 'none';
    detailsEmpty.style.display = 'flex';
  }
});

/* ---------- export CSV (flattened variants) ---------- */
function exportCSV(){
  const keys = ['car_id','model','variant_id','variant_name','price_ex_showroom','tcs','insurance','price_onroad'];
  const rows = [];
  cars.forEach(car => {
    car.variants.forEach(v => {
      const onroad = computeOnRoad(v) || '';
      rows.push([car.id, car.model, v.id, v.name, v.price_ex_showroom ?? '', v.tcs ?? '', v.insurance ?? '', onroad]);
    });
  });
  const csv = keys.join(',') + '\n' + rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'tata-ev-prices.csv'; a.click(); URL.revokeObjectURL(url);
}
exportCsvBtn.addEventListener('click', exportCSV);

/* ---------- init ---------- */
renderModelCards();
