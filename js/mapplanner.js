// ============================================================
// MAP PLANNER — Real image backgrounds with drag/drop canvas
// ============================================================

import { ATTACK_OPERATORS, DEFENSE_OPERATORS, GADGETS } from './data.js';
import { db } from './firebase-config.js';
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== IMAGE MAP — exact filenames as uploaded to GitHub root =====
const MAP_IMAGES = {
  "Bank": [
    { label: "Floor 1", file: "r6-maps-bank-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-bank-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-bank-blueprint-3.jpg" },
    { label: "Floor 4", file: "r6-maps-bank-blueprint-4.jpg" }
  ],
  "Border": [
    { label: "Floor 1", file: "r6-maps-border-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-border-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-border-blueprint-3.jpg" }
  ],
  "Chalet": [
    { label: "1st Floor", file: "chalet_rework_1f.webp" },
    { label: "2nd Floor", file: "chalet_rework_2f.webp" },
    { label: "Basement",  file: "chalet_rework_basement.webp" },
    { label: "Roof",      file: "chalet_rework_roof.webp" }
  ],
  "Clubhouse": [
    { label: "Floor 1", file: "r6-maps-clubhouse-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-clubhouse-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-clubhouse-blueprint-3.jpg" },
    { label: "Floor 4", file: "r6-maps-clubhouse-blueprint-4.jpg" }
  ],
  "Coastline": [
    { label: "Floor 1", file: "r6-maps-coastline-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-coastline-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-coastline-blueprint-3.jpg" }
  ],
  "Consulate": [
    { label: "Floor 1", file: "r6-maps-consulate-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-consulate-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-consulate-blueprint-3.jpg" },
    { label: "Floor 4", file: "r6-maps-consulate-blueprint-4.jpg" }
  ],
  "Emerald Plains": [
    { label: "Floor 1", file: "r6-maps-emeraldplains-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-emeraldplains-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-emeraldplains-blueprint-3.jpg" }
  ],
  "Kafe Dostoyevsky": [
    { label: "Floor 1", file: "kafe-first-floor.png" },
    { label: "Floor 2", file: "kafe_map_Map_floor_2.webp" },
    { label: "Floor 3", file: "kafe_map_Map_floor_3.webp" },
    { label: "Roof",    file: "kafe_map_Roof.webp" }
  ],
  "Kanal": [
    { label: "Floor 1", file: "r6-maps-kanal-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-kanal-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-kanal-blueprint-3.jpg" },
    { label: "Floor 4", file: "r6-maps-kanal-blueprint-4.jpg" },
    { label: "Floor 5", file: "r6-maps-kanal-blueprint-5.jpg" }
  ],
  "Lair": [
    { label: "Floor 1", file: "r6-maps-lair-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-lair-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-lair-blueprint-3.jpg" },
    { label: "Floor 4", file: "r6-maps-lair-blueprint-4.jpg" }
  ],
  "Nighthaven Labs": [
    { label: "Floor 1", file: "r6-maps-nighthavenlabs-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-nighthavenlabs-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-nighthavenlabs-blueprint-3.jpg" },
    { label: "Floor 4", file: "r6-maps-nighthavenlabs-blueprint-4.jpg" }
  ],
  "Oregon": [
    { label: "Floor 1", file: "r6-maps-oregon-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-oregon-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-oregon-blueprint-3.jpg" },
    { label: "Floor 4", file: "r6-maps-oregon-blueprint-4.jpg" },
    { label: "Floor 5", file: "r6-maps-oregon-blueprint-5.jpg" }
  ],
  "Outback": [
    { label: "Floor 1", file: "r6-maps-outback-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-outback-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-outback-blueprint-3.jpg" }
  ],
  "Skyscraper": [
    { label: "Floor 1", file: "r6-maps-skyscraper-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-skyscraper-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-skyscraper-blueprint-3.jpg" }
  ],
  "Theme Park": [
    { label: "Floor 1", file: "r6-maps-themepark-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-themepark-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-themepark-blueprint-3.jpg" }
  ],
  "Villa": [
    { label: "Floor 1", file: "r6-maps-villa-blueprint-1.jpg" },
    { label: "Floor 2", file: "r6-maps-villa-blueprint-2.jpg" },
    { label: "Floor 3", file: "r6-maps-villa-blueprint-3.jpg" },
    { label: "Floor 4", file: "r6-maps-villa-blueprint-4.jpg" },
    { label: "Floor 5", file: "r6-maps-villa-blueprint-5.jpg" }
  ]
};

// GitHub Pages base URL for images
const IMG_BASE = './';

// ===== STATE =====
let activePlannerMap = null;
let activeFloorIndex = 0;
let plannerSide = 'defense';
let plannerTool = 'select';
let selectedOperator = null;
let selectedGadget = null;
let placedItems = [];
let drawings = [];
let selectedItemId = null;
let isDragging = false;
let isDrawing = false;
let drawStart = null;
let currentDrawPath = null;
let canvasEl = null;
let ctx = null;
let currentPlannerUser = null;
let saveTimer = null;
let imgCache = {};
let currentImg = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

export function initMapPlanner(user) {
  currentPlannerUser = user;
  buildPlannerMapList();
}

function buildPlannerMapList() {
  const list = document.getElementById('planner-map-list');
  if (!list) return;
  list.innerHTML = '';
  Object.keys(MAP_IMAGES).sort().forEach(map => {
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

function loadPlannerMap(map) {
  activePlannerMap = map;
  activeFloorIndex = 0;
  placedItems = [];
  drawings = [];
  selectedItemId = null;

  // Show canvas area, hide empty state
  const canvasArea = document.getElementById('planner-canvas-area');
  const emptyState = document.getElementById('planner-empty');
  if (canvasArea) canvasArea.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';

  // Set title
  const title = document.getElementById('planner-map-title');
  if (title) title.textContent = map;

  // Build floor selector
  buildFloorSelector(map);

  // Build toolbar if not already built
  buildPlannerToolbar();

  // Build palettes
  buildOperatorPalette();
  buildGadgetPalette();

  // Setup canvas
  setupCanvas();

  // Load image and saved state
  loadFloorImage(() => {
    loadPlannerState();
  });
}

function buildFloorSelector(map) {
  const floorSel = document.getElementById('planner-floor-select');
  if (!floorSel) return;
  floorSel.innerHTML = '';
  MAP_IMAGES[map].forEach((floor, i) => {
    const o = document.createElement('option');
    o.value = i;
    o.textContent = floor.label;
    floorSel.appendChild(o);
  });
  floorSel.onchange = () => {
    activeFloorIndex = parseInt(floorSel.value);
    placedItems = [];
    drawings = [];
    selectedItemId = null;
    loadFloorImage(() => {
      loadPlannerState();
    });
  };
}

function buildPlannerToolbar() {
  const tb = document.getElementById('planner-toolbar');
  if (!tb || tb.dataset.built) return;
  tb.dataset.built = '1';
  tb.innerHTML = `
    <div class="planner-tool-group">
      <button class="planner-tool-btn active" id="side-def" onclick="setPlannerSide('defense')">Defense</button>
      <button class="planner-tool-btn" id="side-atk" onclick="setPlannerSide('attack')">Attack</button>
    </div>
    <div class="planner-tool-group">
      <button class="planner-tool-btn active" id="tool-btn-select" onclick="setPlannerTool('select')" title="Select / Move">⊹ Select</button>
      <button class="planner-tool-btn" id="tool-btn-operator" onclick="setPlannerTool('operator')" title="Place Operator">◉ Operator</button>
      <button class="planner-tool-btn" id="tool-btn-gadget" onclick="setPlannerTool('gadget')" title="Place Gadget">⬟ Gadget</button>
      <button class="planner-tool-btn" id="tool-btn-arrow" onclick="setPlannerTool('arrow')" title="Draw Arrow">→ Arrow</button>
      <button class="planner-tool-btn" id="tool-btn-line" onclick="setPlannerTool('line')" title="Draw Line">╱ Line</button>
      <button class="planner-tool-btn" id="tool-btn-eraser" onclick="setPlannerTool('eraser')" title="Erase">⌫ Erase</button>
    </div>
    <button class="planner-tool-btn danger" onclick="clearPlanner()">🗑 Clear all</button>
    <button class="planner-tool-btn accent" onclick="savePlannerState()">💾 Save</button>
  `;
}

function setupCanvas() {
  const container = document.getElementById('planner-svg-container');
  if (!container) return;
  container.innerHTML = `
    <canvas id="planner-canvas" style="display:block;max-width:100%;border-radius:8px;cursor:crosshair"></canvas>
  `;
  canvasEl = document.getElementById('planner-canvas');
  ctx = canvasEl.getContext('2d');
  attachCanvasEvents();
}

function loadFloorImage(callback) {
  if (!activePlannerMap) return;
  const floors = MAP_IMAGES[activePlannerMap];
  const floor = floors[activeFloorIndex];
  if (!floor) return;

  const src = IMG_BASE + floor.file;

  if (imgCache[src]) {
    currentImg = imgCache[src];
    resizeCanvas();
    renderCanvas();
    if (callback) callback();
    return;
  }

  const img = new Image();
  img.onload = () => {
    imgCache[src] = img;
    currentImg = img;
    resizeCanvas();
    renderCanvas();
    if (callback) callback();
  };
  img.onerror = () => {
    showToast('Image not found: ' + floor.file, 'error');
    currentImg = null;
    renderCanvas();
  };
  img.src = src;
}

function resizeCanvas() {
  if (!canvasEl || !currentImg) return;
  const container = document.getElementById('planner-svg-container');
  const maxW = container ? container.clientWidth - 16 : 900;
  const scale = Math.min(1, maxW / currentImg.naturalWidth);
  canvasEl.width = currentImg.naturalWidth * scale;
  canvasEl.height = currentImg.naturalHeight * scale;
  canvasEl.dataset.scale = scale;
}

function getCanvasPoint(e) {
  const rect = canvasEl.getBoundingClientRect();
  const scale = parseFloat(canvasEl.dataset.scale || 1);
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale
  };
}

function renderCanvas() {
  if (!ctx || !canvasEl) return;
  const W = canvasEl.width;
  const H = canvasEl.height;
  const scale = parseFloat(canvasEl.dataset.scale || 1);

  ctx.clearRect(0, 0, W, H);

  // Draw map image
  if (currentImg) {
    ctx.drawImage(currentImg, 0, 0, W, H);
    // Slight dark overlay for better icon visibility
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#444';
    ctx.font = '16px Barlow, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Loading map...', W/2, H/2);
  }

  ctx.save();
  ctx.scale(scale, scale);

  // Draw lines and arrows
  drawings.forEach(d => drawLine(d));

  // Draw placed items
  placedItems.forEach(item => drawItem(item));

  ctx.restore();
}

function drawLine(d) {
  ctx.save();
  ctx.strokeStyle = d.color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  if (d.dashed) ctx.setLineDash([6, 3]);
  ctx.beginPath();
  ctx.moveTo(d.x1, d.y1);
  ctx.lineTo(d.x2, d.y2);
  ctx.stroke();
  ctx.setLineDash([]);

  if (d.type === 'arrow') {
    const angle = Math.atan2(d.y2 - d.y1, d.x2 - d.x1);
    const len = 12;
    ctx.fillStyle = d.color;
    ctx.beginPath();
    ctx.moveTo(d.x2, d.y2);
    ctx.lineTo(d.x2 - len * Math.cos(angle - 0.4), d.y2 - len * Math.sin(angle - 0.4));
    ctx.lineTo(d.x2 - len * Math.cos(angle + 0.4), d.y2 - len * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawItem(item) {
  const isSelected = item.id === selectedItemId;
  const cx = item.x + item.r;
  const cy = item.y + item.r;
  const r = item.r;

  if (item.type === 'operator') {
    // Circle with initials
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = item.color;
    ctx.fill();
    if (isSelected) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    // Initials
    const initials = item.label.split(/[\s-]/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
    ctx.fillStyle = item.side === 'attack' ? '#fff' : '#000';
    ctx.font = `bold ${Math.max(9, r * 0.7)}px Barlow Condensed, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, cx, cy);
    // Label below
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = `${Math.max(8, r * 0.55)}px Barlow, sans-serif`;
    ctx.textBaseline = 'top';
    const shortName = item.label.length > 9 ? item.label.slice(0, 9) + '…' : item.label;
    ctx.fillText(shortName, cx, cy + r + 2);
    ctx.restore();

  } else if (item.type === 'gadget') {
    // Rounded square
    ctx.save();
    const s = r * 1.6;
    const gx = item.x;
    const gy = item.y;
    ctx.beginPath();
    ctx.roundRect(gx, gy, s, s, 4);
    ctx.fillStyle = item.color + 'dd';
    ctx.fill();
    if (isSelected) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.max(7, r * 0.55)}px Barlow Condensed, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const shortLabel = item.label.slice(0, 7);
    ctx.fillText(shortLabel, gx + s/2, gy + s/2);
    ctx.restore();
  }
}

// ===== CANVAS EVENTS =====
function attachCanvasEvents() {
  if (!canvasEl) return;
  canvasEl.addEventListener('mousedown', onDown);
  canvasEl.addEventListener('mousemove', onMove);
  canvasEl.addEventListener('mouseup', onUp);
  canvasEl.addEventListener('touchstart', e => { e.preventDefault(); onDown(e); }, { passive: false });
  canvasEl.addEventListener('touchmove', e => { e.preventDefault(); onMove(e); }, { passive: false });
  canvasEl.addEventListener('touchend', e => { onUp(e); });
  canvasEl.addEventListener('click', onClick);
}

function onDown(e) {
  const pt = getCanvasPoint(e);
  const scale = parseFloat(canvasEl.dataset.scale || 1);
  const spt = { x: pt.x / scale, y: pt.y / scale };

  if (plannerTool === 'arrow' || plannerTool === 'line') {
    isDrawing = true;
    drawStart = spt;
    currentDrawPath = {
      type: plannerTool,
      x1: spt.x, y1: spt.y,
      x2: spt.x, y2: spt.y,
      color: plannerSide === 'attack' ? '#4a9eff' : '#e8b84b',
      id: Date.now()
    };
  } else if (plannerTool === 'select') {
    const hit = hitTest(spt);
    if (hit) {
      selectedItemId = hit.id;
      isDragging = true;
      dragOffsetX = spt.x - hit.x;
      dragOffsetY = spt.y - hit.y;
    } else {
      selectedItemId = null;
    }
    renderCanvas();
  }
}

function onMove(e) {
  const pt = getCanvasPoint(e);
  const scale = parseFloat(canvasEl.dataset.scale || 1);
  const spt = { x: pt.x / scale, y: pt.y / scale };

  if (isDrawing && currentDrawPath) {
    currentDrawPath.x2 = spt.x;
    currentDrawPath.y2 = spt.y;
    renderCanvas();
    // Draw preview
    if (ctx) {
      ctx.save();
      ctx.scale(scale, scale);
      drawLine({ ...currentDrawPath, dashed: true });
      ctx.restore();
    }
  } else if (isDragging && selectedItemId) {
    const item = placedItems.find(i => i.id === selectedItemId);
    if (item) {
      item.x = spt.x - dragOffsetX;
      item.y = spt.y - dragOffsetY;
      renderCanvas();
    }
  }
}

function onUp(e) {
  if (isDrawing && currentDrawPath) {
    const dx = currentDrawPath.x2 - currentDrawPath.x1;
    const dy = currentDrawPath.y2 - currentDrawPath.y1;
    if (Math.sqrt(dx*dx + dy*dy) > 8) {
      drawings.push({ ...currentDrawPath });
      scheduleSave();
    }
    renderCanvas();
  }
  if (isDragging) scheduleSave();
  isDrawing = false;
  isDragging = false;
  currentDrawPath = null;
}

function onClick(e) {
  const pt = getCanvasPoint(e);
  const scale = parseFloat(canvasEl.dataset.scale || 1);
  const spt = { x: pt.x / scale, y: pt.y / scale };

  if (plannerTool === 'operator' && selectedOperator) {
    placedItems.push({
      id: Date.now(),
      type: 'operator',
      label: selectedOperator,
      x: spt.x - 18,
      y: spt.y - 18,
      r: 18,
      color: plannerSide === 'attack' ? '#4a9eff' : '#e8b84b',
      side: plannerSide
    });
    renderCanvas();
    scheduleSave();
  } else if (plannerTool === 'gadget' && selectedGadget) {
    placedItems.push({
      id: Date.now(),
      type: 'gadget',
      label: selectedGadget.label,
      x: spt.x - 14,
      y: spt.y - 14,
      r: 14,
      color: selectedGadget.color,
      side: plannerSide
    });
    renderCanvas();
    scheduleSave();
  } else if (plannerTool === 'eraser') {
    const hit = hitTest(spt);
    if (hit) {
      placedItems = placedItems.filter(i => i.id !== hit.id);
    } else {
      drawings = drawings.filter(d => {
        return pointToLineDist(spt, { x: d.x1, y: d.y1 }, { x: d.x2, y: d.y2 }) > 10;
      });
    }
    renderCanvas();
    scheduleSave();
  }
}

function hitTest(pt) {
  return [...placedItems].reverse().find(item => {
    const r = item.r || 18;
    const cx = item.x + r;
    const cy = item.y + r;
    return Math.hypot(pt.x - cx, pt.y - cy) <= r + 4;
  });
}

function pointToLineDist(pt, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len2 = dx*dx + dy*dy;
  if (len2 === 0) return Math.hypot(pt.x - a.x, pt.y - a.y);
  let t = Math.max(0, Math.min(1, ((pt.x-a.x)*dx + (pt.y-a.y)*dy) / len2));
  return Math.hypot(pt.x - (a.x + t*dx), pt.y - (a.y + t*dy));
}

// ===== PALETTES =====
function buildOperatorPalette() {
  const palette = document.getElementById('planner-op-palette');
  if (!palette) return;
  const ops = plannerSide === 'attack' ? ATTACK_OPERATORS : DEFENSE_OPERATORS;
  palette.innerHTML = `<div class="section-title" style="margin-bottom:6px">${plannerSide === 'attack' ? 'Attack' : 'Defense'} operators</div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">
      ${ops.map(op => `
        <button class="planner-op-btn ${selectedOperator === op ? 'selected' : ''}"
          onclick="selectPlannerOp('${op}')" title="${op}">
          ${op.length > 7 ? op.slice(0,7)+'…' : op}
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
          style="border-color:${g.color}40" title="${g.label}">
          ${g.label.length > 8 ? g.label.slice(0,8)+'…' : g.label}
        </button>`).join('')}
    </div>`;
}

// ===== GLOBAL FUNCTIONS =====
window.setPlannerSide = function(side) {
  plannerSide = side;
  selectedOperator = null;
  selectedGadget = null;
  document.getElementById('side-def')?.classList.toggle('active', side === 'defense');
  document.getElementById('side-atk')?.classList.toggle('active', side === 'attack');
  buildOperatorPalette();
  buildGadgetPalette();
};

window.setPlannerTool = function(tool) {
  plannerTool = tool;
  ['select','operator','gadget','arrow','line','eraser'].forEach(t => {
    document.getElementById(`tool-btn-${t}`)?.classList.toggle('active', t === tool);
  });
  if (canvasEl) {
    canvasEl.style.cursor = tool === 'select' ? 'default' : tool === 'eraser' ? 'cell' : 'crosshair';
  }
  if (tool !== 'operator') { selectedOperator = null; buildOperatorPalette(); }
  if (tool !== 'gadget') { selectedGadget = null; buildGadgetPalette(); }
};

window.selectPlannerOp = function(op) {
  selectedOperator = op;
  selectedGadget = null;
  setPlannerTool('operator');
  buildOperatorPalette();
};

window.selectPlannerGadget = function(gadgetId) {
  const all = [...GADGETS.attack, ...GADGETS.defense];
  selectedGadget = all.find(g => g.id === gadgetId);
  selectedOperator = null;
  setPlannerTool('gadget');
  buildGadgetPalette();
};

window.clearPlanner = function() {
  if (!confirm('Clear all operators, gadgets, and drawings from this floor?')) return;
  placedItems = [];
  drawings = [];
  selectedItemId = null;
  renderCanvas();
  scheduleSave();
};

// ===== SAVE / LOAD =====
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(savePlannerState, 1500);
}

async function savePlannerState() {
  if (!activePlannerMap) return;
  const key = `${activePlannerMap}__${activeFloorIndex}`.replace(/\s/g, '_');
  try {
    await setDoc(doc(db, 'map_plans', key), {
      map: activePlannerMap,
      floorIndex: activeFloorIndex,
      items: placedItems,
      drawings: drawings,
      savedBy: currentPlannerUser?.displayName || '?',
      savedAt: serverTimestamp()
    });
    const ind = document.getElementById('planner-save-indicator');
    if (ind) { ind.style.opacity = '1'; setTimeout(() => ind.style.opacity = '0', 1500); }
  } catch(e) { console.error('Planner save error', e); }
}
window.savePlannerState = savePlannerState;

async function loadPlannerState() {
  if (!activePlannerMap) return;
  const key = `${activePlannerMap}__${activeFloorIndex}`.replace(/\s/g, '_');
  try {
    const snap = await getDoc(doc(db, 'map_plans', key));
    if (snap.exists()) {
      placedItems = snap.data().items || [];
      drawings = snap.data().drawings || [];
      renderCanvas();
    }
  } catch(e) {}
}

function showToast(msg, type) {
  if (window.showToast) window.showToast(msg, type);
}
