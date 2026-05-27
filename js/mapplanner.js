// ============================================================
// MAP PLANNER — Interactive SVG canvas with drag/drop
// Operator placement, gadget placement, freehand drawing
// ============================================================

import { MAP_SCHEMATICS } from './maps.js';
import { ATTACK_OPERATORS, DEFENSE_OPERATORS, GADGETS } from './data.js';
import { db } from './firebase-config.js';
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== STATE =====
let activePlannerMap = null;
let activePlannerFloor = null;
let plannerSide = 'defense';
let plannerTool = 'select'; // select | operator | gadget | arrow | text | eraser
let selectedOperator = null;
let selectedGadget = null;
let placedItems = []; // { id, type, x, y, label, color, ... }
let drawings = []; // { type: 'arrow'|'line', points, color }
let selectedItem = null;
let isDragging = false;
let isDrawing = false;
let drawStart = null;
let currentDrawPath = null;
let svgEl = null;
let currentPlannerUser = null;
let saveTimer = null;

export function initMapPlanner(user) {
  currentPlannerUser = user;
  buildPlannerMapList();
  buildPlannerToolbar();
}

function buildPlannerMapList() {
  const list = document.getElementById('planner-map-list');
  if (!list) return;
  list.innerHTML = '';
  Object.keys(MAP_SCHEMATICS).sort().forEach(map => {
    const btn = document.createElement('button');
    btn.className = 'map-planner-btn';
    btn.textContent = map;
    btn.onclick = () => {
      document.querySelectorAll('.map-planner-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadPlannerMap(map);
    };
    list.appendChild(btn);
  });
}

function buildPlannerToolbar() {
  const tb = document.getElementById('planner-toolbar');
  if (!tb) return;

  // Side toggle
  const sideToggle = document.createElement('div');
  sideToggle.className = 'planner-tool-group';
  sideToggle.innerHTML = `
    <button class="planner-tool-btn ${plannerSide === 'defense' ? 'active' : ''}" onclick="setPlannerSide('defense')">Defense</button>
    <button class="planner-tool-btn ${plannerSide === 'attack' ? 'active' : ''}" onclick="setPlannerSide('attack')">Attack</button>
  `;
  tb.appendChild(sideToggle);

  // Tools
  const tools = [
    { id: 'select', icon: '⊹', label: 'Select / Move' },
    { id: 'operator', icon: '◉', label: 'Place Operator' },
    { id: 'gadget', icon: '⬟', label: 'Place Gadget' },
    { id: 'arrow', icon: '→', label: 'Draw Arrow' },
    { id: 'line', icon: '╱', label: 'Draw Line' },
    { id: 'eraser', icon: '⌫', label: 'Erase' },
  ];
  const toolGroup = document.createElement('div');
  toolGroup.className = 'planner-tool-group';
  tools.forEach(t => {
    const btn = document.createElement('button');
    btn.className = `planner-tool-btn ${plannerTool === t.id ? 'active' : ''}`;
    btn.id = `tool-btn-${t.id}`;
    btn.title = t.label;
    btn.textContent = t.icon;
    btn.onclick = () => setPlannerTool(t.id);
    toolGroup.appendChild(btn);
  });
  tb.appendChild(toolGroup);

  // Clear button
  const clearBtn = document.createElement('button');
  clearBtn.className = 'planner-tool-btn danger';
  clearBtn.textContent = '🗑 Clear';
  clearBtn.onclick = () => clearPlanner();
  tb.appendChild(clearBtn);

  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.className = 'planner-tool-btn accent';
  saveBtn.textContent = '💾 Save';
  saveBtn.onclick = () => savePlannerState();
  tb.appendChild(saveBtn);
}

function loadPlannerMap(map) {
  activePlannerMap = map;
  const schema = MAP_SCHEMATICS[map];
  activePlannerFloor = schema.defaultFloor;
  placedItems = [];
  drawings = [];
  selectedItem = null;

  // Build floor selector
  const floorSel = document.getElementById('planner-floor-select');
  if (floorSel) {
    floorSel.innerHTML = '';
    schema.floors.forEach(f => {
      const o = document.createElement('option');
      o.value = f; o.textContent = f;
      if (f === activePlannerFloor) o.selected = true;
      floorSel.appendChild(o);
    });
    floorSel.onchange = () => {
      activePlannerFloor = floorSel.value;
      placedItems = [];
      drawings = [];
      renderSVGMap();
      loadPlannerState();
    };
  }

  document.getElementById('planner-map-title').textContent = map;
  document.getElementById('planner-canvas-area').style.display = 'block';
  renderSVGMap();
  loadPlannerState();
  buildOperatorPalette();
  buildGadgetPalette();
}

function renderSVGMap() {
  const schema = MAP_SCHEMATICS[activePlannerMap];
  const floorData = schema.floors_data[activePlannerFloor];
  if (!floorData) return;

  const container = document.getElementById('planner-svg-container');
  if (!container) return;

  const W = schema.width;
  const H = schema.height;

  const svgHTML = `<svg id="planner-svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
    style="display:block;background:#0d0d0d;border-radius:8px;cursor:crosshair;max-width:100%"
    xmlns="http://www.w3.org/2000/svg">

    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#e8b84b"/>
      </marker>
      <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#4a9eff"/>
      </marker>
      <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#ff5555"/>
      </marker>
    </defs>

    <!-- ROOMS -->
    <g id="svg-rooms">${floorData.rooms.map(r => `
      <g>
        <rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"
          fill="${r.color || '#1a1a1a'}"
          stroke="${r.site ? '#e8b84b' : 'rgba(255,255,255,0.12)'}"
          stroke-width="${r.site ? '2' : '1'}"
          rx="3"/>
        ${r.site ? `<rect x="${r.x}" y="${r.y}" width="${r.w}" height="18" fill="rgba(232,184,75,0.15)" rx="3"/>` : ''}
        <text x="${r.x + r.w/2}" y="${r.y + (r.site ? 13 : r.h/2 + 4)}"
          text-anchor="middle"
          font-size="${r.w > 120 ? '11' : '9'}"
          font-family="Barlow Condensed, sans-serif"
          font-weight="600"
          fill="${r.site ? '#e8b84b' : 'rgba(255,255,255,0.5)'}">
          ${r.label}
        </text>
      </g>`).join('')}
    </g>

    <!-- WALLS -->
    <g id="svg-walls">${(floorData.walls || []).map(w =>
      `<line x1="${w.x1}" y1="${w.y1}" x2="${w.x2}" y2="${w.y2}" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>`
    ).join('')}</g>

    <!-- DOORS -->
    <g id="svg-doors">${(floorData.doors || []).map(d =>
      `<rect x="${d.x}" y="${d.y}" width="${d.w}" height="${d.h}" fill="#4a9eff" opacity="0.8" rx="1"/>`
    ).join('')}</g>

    <!-- HATCHES -->
    <g id="svg-hatches">${(floorData.hatches || []).map(h =>
      `<g>
        <circle cx="${h.x}" cy="${h.y}" r="10" fill="#333" stroke="#888" stroke-width="1.5"/>
        <text x="${h.x}" y="${h.y+4}" text-anchor="middle" font-size="9" fill="#aaa" font-family="Barlow Condensed,sans-serif">H</text>
      </g>`
    ).join('')}</g>

    <!-- WINDOWS -->
    <g id="svg-windows">${(floorData.windows || []).map(w =>
      `<rect x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" fill="#88ccff" opacity="0.6" rx="1"/>`
    ).join('')}</g>

    <!-- LEGEND -->
    <g transform="translate(10, ${H - 60})">
      <rect x="0" y="0" width="220" height="55" fill="rgba(0,0,0,0.7)" rx="4"/>
      <rect x="8" y="8" width="12" height="12" fill="#1a2a1a" stroke="#e8b84b" stroke-width="2" rx="1"/>
      <text x="24" y="18" font-size="10" fill="#e8b84b" font-family="Barlow,sans-serif">Bomb site</text>
      <rect x="8" y="24" width="12" height="4" fill="#4a9eff" rx="1"/>
      <text x="24" y="32" font-size="10" fill="#4a9eff" font-family="Barlow,sans-serif">Door</text>
      <circle cx="14" cy="44" r="6" fill="#333" stroke="#888" stroke-width="1"/>
      <text x="14" y="47" text-anchor="middle" font-size="7" fill="#aaa" font-family="Barlow,sans-serif">H</text>
      <text x="24" y="47" font-size="10" fill="#888" font-family="Barlow,sans-serif">Hatch</text>
      <rect x="100" y="8" width="4" height="12" fill="#88ccff" rx="1"/>
      <text x="110" y="18" font-size="10" fill="#88ccff" font-family="Barlow,sans-serif">Window</text>
    </g>

    <!-- DRAWINGS LAYER -->
    <g id="svg-drawings"></g>

    <!-- PLACED ITEMS LAYER -->
    <g id="svg-items"></g>

    <!-- DRAW PREVIEW -->
    <g id="svg-draw-preview"></g>
  </svg>`;

  container.innerHTML = svgHTML;
  svgEl = document.getElementById('planner-svg');
  attachSVGEvents();
  renderPlacedItems();
  renderDrawings();
}

function attachSVGEvents() {
  if (!svgEl) return;
  svgEl.addEventListener('mousedown', onSVGMouseDown);
  svgEl.addEventListener('mousemove', onSVGMouseMove);
  svgEl.addEventListener('mouseup', onSVGMouseUp);
  svgEl.addEventListener('touchstart', onTouchStart, { passive: false });
  svgEl.addEventListener('touchmove', onTouchMove, { passive: false });
  svgEl.addEventListener('touchend', onTouchEnd);
  svgEl.addEventListener('click', onSVGClick);
}

function getSVGPoint(e) {
  const rect = svgEl.getBoundingClientRect();
  const scaleX = svgEl.viewBox.baseVal.width / rect.width;
  const scaleY = svgEl.viewBox.baseVal.height / rect.height;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: Math.round((clientX - rect.left) * scaleX),
    y: Math.round((clientY - rect.top) * scaleY)
  };
}

function onTouchStart(e) { e.preventDefault(); onSVGMouseDown(e); }
function onTouchMove(e) { e.preventDefault(); onSVGMouseMove(e); }
function onTouchEnd(e) { onSVGMouseUp(e); }

function onSVGMouseDown(e) {
  const pt = getSVGPoint(e);
  if (plannerTool === 'arrow' || plannerTool === 'line') {
    isDrawing = true;
    drawStart = pt;
    currentDrawPath = { type: plannerTool, x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y, color: plannerSide === 'attack' ? '#4a9eff' : '#e8b84b' };
  } else if (plannerTool === 'select') {
    // Check if clicking on an item
    const hit = hitTestItems(pt);
    if (hit) {
      selectedItem = hit;
      isDragging = true;
    } else {
      selectedItem = null;
    }
    renderPlacedItems();
  }
}

function onSVGMouseMove(e) {
  const pt = getSVGPoint(e);
  if (isDrawing && currentDrawPath) {
    currentDrawPath.x2 = pt.x;
    currentDrawPath.y2 = pt.y;
    renderDrawPreview();
  } else if (isDragging && selectedItem) {
    selectedItem.x = pt.x - (selectedItem.w || 20) / 2;
    selectedItem.y = pt.y - (selectedItem.h || 20) / 2;
    renderPlacedItems();
  }
}

function onSVGMouseUp(e) {
  if (isDrawing && currentDrawPath) {
    const pt = getSVGPoint(e);
    currentDrawPath.x2 = pt.x;
    currentDrawPath.y2 = pt.y;
    const dx = currentDrawPath.x2 - currentDrawPath.x1;
    const dy = currentDrawPath.y2 - currentDrawPath.y1;
    if (Math.sqrt(dx*dx + dy*dy) > 10) {
      drawings.push({ ...currentDrawPath, id: Date.now() });
      renderDrawings();
      scheduleSave();
    }
    clearDrawPreview();
  }
  if (isDragging) scheduleSave();
  isDrawing = false;
  isDragging = false;
  currentDrawPath = null;
  drawStart = null;
}

function onSVGClick(e) {
  const pt = getSVGPoint(e);
  if (plannerTool === 'operator' && selectedOperator) {
    placedItems.push({
      id: Date.now(),
      type: 'operator',
      label: selectedOperator,
      x: pt.x - 18,
      y: pt.y - 18,
      w: 36,
      h: 36,
      color: plannerSide === 'attack' ? '#4a9eff' : '#e8b84b',
      side: plannerSide
    });
    renderPlacedItems();
    scheduleSave();
  } else if (plannerTool === 'gadget' && selectedGadget) {
    placedItems.push({
      id: Date.now(),
      type: 'gadget',
      label: selectedGadget.label,
      x: pt.x - 14,
      y: pt.y - 14,
      w: 28,
      h: 28,
      color: selectedGadget.color,
      side: plannerSide
    });
    renderPlacedItems();
    scheduleSave();
  } else if (plannerTool === 'eraser') {
    const hit = hitTestItems(pt);
    if (hit) {
      placedItems = placedItems.filter(i => i.id !== hit.id);
      renderPlacedItems();
      scheduleSave();
    } else {
      // Check drawings proximity
      drawings = drawings.filter(d => {
        const dist = pointToLineDistance(pt, { x: d.x1, y: d.y1 }, { x: d.x2, y: d.y2 });
        return dist > 12;
      });
      renderDrawings();
      scheduleSave();
    }
  }
}

function hitTestItems(pt) {
  return placedItems.find(item =>
    pt.x >= item.x && pt.x <= item.x + item.w &&
    pt.y >= item.y && pt.y <= item.y + item.h
  );
}

function pointToLineDistance(pt, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len2 = dx*dx + dy*dy;
  if (len2 === 0) return Math.hypot(pt.x - a.x, pt.y - a.y);
  let t = ((pt.x - a.x)*dx + (pt.y - a.y)*dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(pt.x - (a.x + t*dx), pt.y - (a.y + t*dy));
}

function renderPlacedItems() {
  const layer = document.getElementById('svg-items');
  if (!layer) return;
  layer.innerHTML = placedItems.map(item => {
    const isSelected = selectedItem?.id === item.id;
    const initials = item.label.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
    if (item.type === 'operator') {
      return `<g class="placed-item" style="cursor:move">
        <circle cx="${item.x + item.w/2}" cy="${item.y + item.h/2}" r="${item.w/2}"
          fill="${item.color}" opacity="0.9"
          stroke="${isSelected ? '#fff' : 'rgba(0,0,0,0.5)'}"
          stroke-width="${isSelected ? 2 : 1}"/>
        <text x="${item.x + item.w/2}" y="${item.y + item.h/2 + 4}"
          text-anchor="middle"
          font-size="10" font-weight="700"
          font-family="Barlow Condensed, sans-serif"
          fill="${item.side === 'attack' ? '#fff' : '#000'}">
          ${initials}
        </text>
        <text x="${item.x + item.w/2}" y="${item.y + item.h + 12}"
          text-anchor="middle"
          font-size="8"
          font-family="Barlow, sans-serif"
          fill="rgba(255,255,255,0.8)">
          ${item.label.length > 8 ? item.label.slice(0,8) + '…' : item.label}
        </text>
      </g>`;
    } else {
      return `<g class="placed-item" style="cursor:move">
        <rect x="${item.x}" y="${item.y}" width="${item.w}" height="${item.h}"
          fill="${item.color}" opacity="0.85" rx="4"
          stroke="${isSelected ? '#fff' : 'rgba(0,0,0,0.4)'}"
          stroke-width="${isSelected ? 2 : 1}"/>
        <text x="${item.x + item.w/2}" y="${item.y + item.h/2 + 3}"
          text-anchor="middle"
          font-size="7" font-weight="600"
          font-family="Barlow Condensed, sans-serif"
          fill="#fff">
          ${item.label.slice(0, 6)}
        </text>
      </g>`;
    }
  }).join('');
}

function renderDrawings() {
  const layer = document.getElementById('svg-drawings');
  if (!layer) return;
  layer.innerHTML = drawings.map(d => {
    const markerColor = d.color === '#4a9eff' ? 'blue' : d.color === '#ff5555' ? 'red' : '';
    const markerEnd = d.type === 'arrow' ? `url(#arrowhead${markerColor ? '-'+markerColor : ''})` : 'none';
    return `<line x1="${d.x1}" y1="${d.y1}" x2="${d.x2}" y2="${d.y2}"
      stroke="${d.color}" stroke-width="2.5" stroke-linecap="round"
      marker-end="${markerEnd}" opacity="0.9"/>`;
  }).join('');
}

function renderDrawPreview() {
  const layer = document.getElementById('svg-draw-preview');
  if (!layer || !currentDrawPath) return;
  const markerEnd = currentDrawPath.type === 'arrow' ? 'url(#arrowhead)' : 'none';
  layer.innerHTML = `<line x1="${currentDrawPath.x1}" y1="${currentDrawPath.y1}"
    x2="${currentDrawPath.x2}" y2="${currentDrawPath.y2}"
    stroke="${currentDrawPath.color}" stroke-width="2" stroke-dasharray="5,3"
    marker-end="${markerEnd}" opacity="0.7"/>`;
}

function clearDrawPreview() {
  const layer = document.getElementById('svg-draw-preview');
  if (layer) layer.innerHTML = '';
}

// ===== PALETTES =====
function buildOperatorPalette() {
  const palette = document.getElementById('planner-op-palette');
  if (!palette) return;
  const ops = plannerSide === 'attack' ? ATTACK_OPERATORS : DEFENSE_OPERATORS;
  palette.innerHTML = `<div class="section-title" style="margin-bottom:6px">Operators</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">
      ${ops.map(op => `
        <button class="planner-op-btn ${selectedOperator === op ? 'selected' : ''}"
          onclick="selectPlannerOp('${op}')"
          title="${op}">
          ${op.slice(0, 6)}
        </button>`).join('')}
    </div>`;
}

function buildGadgetPalette() {
  const palette = document.getElementById('planner-gadget-palette');
  if (!palette) return;
  const gadgets = plannerSide === 'attack' ? GADGETS.attack : GADGETS.defense;
  palette.innerHTML = `<div class="section-title" style="margin-bottom:6px">Gadgets</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">
      ${gadgets.map(g => `
        <button class="planner-op-btn ${selectedGadget?.id === g.id ? 'selected' : ''}"
          onclick="selectPlannerGadget('${g.id}')"
          style="border-color:${g.color}"
          title="${g.label}">
          ${g.label.slice(0, 7)}
        </button>`).join('')}
    </div>`;
}

// ===== GLOBAL FUNCTIONS =====
window.setPlannerSide = function (side) {
  plannerSide = side;
  selectedOperator = null;
  selectedGadget = null;
  document.querySelectorAll('.planner-tool-btn').forEach(b => {
    if (b.textContent === 'Defense' || b.textContent === 'Attack') {
      b.classList.toggle('active', b.textContent.toLowerCase() === side);
    }
  });
  buildOperatorPalette();
  buildGadgetPalette();
};

window.setPlannerTool = function (tool) {
  plannerTool = tool;
  document.querySelectorAll('[id^="tool-btn-"]').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`tool-btn-${tool}`);
  if (btn) btn.classList.add('active');
  if (tool !== 'operator') selectedOperator = null;
  if (tool !== 'gadget') selectedGadget = null;
  if (svgEl) svgEl.style.cursor = tool === 'select' ? 'default' : tool === 'eraser' ? 'cell' : 'crosshair';
};

window.selectPlannerOp = function (op) {
  selectedOperator = op;
  selectedGadget = null;
  plannerTool = 'operator';
  document.querySelectorAll('[id^="tool-btn-"]').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tool-btn-operator');
  if (btn) btn.classList.add('active');
  buildOperatorPalette();
};

window.selectPlannerGadget = function (gadgetId) {
  const gadgets = [...GADGETS.attack, ...GADGETS.defense];
  selectedGadget = gadgets.find(g => g.id === gadgetId);
  selectedOperator = null;
  plannerTool = 'gadget';
  document.querySelectorAll('[id^="tool-btn-"]').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tool-btn-gadget');
  if (btn) btn.classList.add('active');
  buildGadgetPalette();
};

window.clearPlanner = function () {
  if (!confirm('Clear all placements and drawings?')) return;
  placedItems = [];
  drawings = [];
  selectedItem = null;
  renderPlacedItems();
  renderDrawings();
  scheduleSave();
};

// ===== SAVE / LOAD =====
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(savePlannerState, 1500);
}

async function savePlannerState() {
  if (!activePlannerMap || !activePlannerFloor) return;
  const key = `${activePlannerMap}__${activePlannerFloor}`.replace(/\s/g, '_');
  try {
    await setDoc(doc(db, 'map_plans', key), {
      map: activePlannerMap,
      floor: activePlannerFloor,
      items: placedItems,
      drawings: drawings,
      savedBy: currentPlannerUser?.displayName || '?',
      savedAt: serverTimestamp()
    });
    const toast = document.getElementById('planner-save-indicator');
    if (toast) { toast.textContent = 'Saved'; toast.style.opacity = '1'; setTimeout(() => toast.style.opacity = '0', 1500); }
  } catch (e) { console.error('Save error', e); }
}
window.savePlannerState = savePlannerState;

async function loadPlannerState() {
  if (!activePlannerMap || !activePlannerFloor) return;
  const key = `${activePlannerMap}__${activePlannerFloor}`.replace(/\s/g, '_');
  try {
    const snap = await getDoc(doc(db, 'map_plans', key));
    if (snap.exists()) {
      placedItems = snap.data().items || [];
      drawings = snap.data().drawings || [];
      renderPlacedItems();
      renderDrawings();
    }
  } catch (e) {}
}
