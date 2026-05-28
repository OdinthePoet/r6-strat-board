// ============================================================
// MAP PLANNER v3 — Real images, operator icons, gadget icons
// Works standalone (Strat Brainstorm) and embedded in strats
// ============================================================

import { ATTACK_OPERATORS, DEFENSE_OPERATORS, GADGETS, ICON_BASE, OP_ICON } from './data.js';
import { db } from './firebase-config.js';
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Image filename map
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
    { label: "Basement", file: "chalet_rework_basement.webp" },
    { label: "Roof", file: "chalet_rework_roof.webp" }
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
    { label: "Floor 1", file: "kafe_map_floor_1.webp" },
    { label: "Floor 2", file: "kafe_map_Map_floor_2.webp" },
    { label: "Floor 3", file: "kafe_map_Map_floor_3.webp" },
    { label: "Roof", file: "kafe_map_Roof.webp" }
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

// Shared icon image cache across all instances
const imgCache = {};

// ============================================================
// CANVAS CLASS — one instance per canvas (standalone or strat)
// ============================================================
export class MapCanvas {
  constructor(containerId, saveKey, options = {}) {
    this.containerId = containerId;
    this.saveKey = saveKey;
    this.options = options; // { map, floorIndex, side, user, onSave }
    this.map = options.map || null;
    this.floorIndex = options.floorIndex || 0;
    this.side = options.side || 'defense';
    this.tool = 'select';
    this.selectedOp = null;
    this.selectedGadget = null;
    this.items = [];
    this.drawings = [];
    this.selectedId = null;
    this.isDragging = false;
    this.isDrawing = false;
    this.drawStart = null;
    this.currentDraw = null;
    this.dragOffX = 0;
    this.dragOffY = 0;
    this.canvas = null;
    this.ctx = null;
    this.currentImg = null;
    this.saveTimer = null;
    this.opIconCache = {};
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    container.innerHTML = `<canvas style="display:block;max-width:100%;border-radius:8px;cursor:crosshair;background:#111"></canvas>`;
    this.canvas = container.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this._attachEvents();
    if (this.map) this.loadMap(this.map, this.floorIndex);
  }

  loadMap(map, floorIndex = 0) {
    this.map = map;
    this.floorIndex = floorIndex;
    this._loadImage();
  }

  setFloor(index) {
    this.floorIndex = index;
    this.items = [];
    this.drawings = [];
    this._loadImage(() => this._loadState());
  }

  setSide(side) {
    this.side = side;
  }

  setTool(tool) {
    this.tool = tool;
    if (this.canvas) {
      this.canvas.style.cursor = tool === 'select' ? 'default' : tool === 'eraser' ? 'cell' : 'crosshair';
    }
  }

  setOperator(op) { this.selectedOp = op; }
  setGadget(gadget) { this.selectedGadget = gadget; }

  clear() {
    this.items = [];
    this.drawings = [];
    this.selectedId = null;
    this._render();
    this._scheduleSave();
  }

  getData() {
    return { items: this.items, drawings: this.drawings };
  }

  setData(data) {
    this.items = data.items || [];
    this.drawings = data.drawings || [];
    this._render();
  }

  async loadState() { await this._loadState(); }
  async saveState() { await this._saveState(); }

  // ===== PRIVATE =====

  _getFloorFiles() {
    return MAP_IMAGES[this.map] || [];
  }

  _loadImage(cb) {
    const floors = this._getFloorFiles();
    const floor = floors[this.floorIndex];
    if (!floor) { this._render(); if (cb) cb(); return; }
    const src = './' + floor.file;
    if (imgCache[src]) {
      this.currentImg = imgCache[src];
      this._resizeCanvas();
      this._render();
      if (cb) cb();
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgCache[src] = img;
      this.currentImg = img;
      this._resizeCanvas();
      this._render();
      if (cb) cb();
    };
    img.onerror = () => {
      this.currentImg = null;
      this._render();
      if (cb) cb();
    };
    img.src = src;
  }

  _resizeCanvas() {
    if (!this.canvas || !this.currentImg) return;
    const container = document.getElementById(this.containerId);
    const maxW = container ? Math.max(container.clientWidth - 8, 300) : 900;
    const scale = Math.min(1, maxW / this.currentImg.naturalWidth);
    this.canvas.width = Math.round(this.currentImg.naturalWidth * scale);
    this.canvas.height = Math.round(this.currentImg.naturalHeight * scale);
    this._scale = scale;
    // Store natural dimensions for coord mapping
    this._imgW = this.currentImg.naturalWidth;
    this._imgH = this.currentImg.naturalHeight;
  }

  _pt(e) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    const imgW = this.currentImg ? this.currentImg.naturalWidth : this.canvas.width;
    const imgH = this.currentImg ? this.currentImg.naturalHeight : this.canvas.height;
    return {
      x: ((cx - rect.left) / rect.width) * imgW,
      y: ((cy - rect.top) / rect.height) * imgH
    };
  }

  _attachEvents() {
    this.canvas.addEventListener('mousedown', e => this._onDown(e));
    this.canvas.addEventListener('mousemove', e => this._onMove(e));
    this.canvas.addEventListener('mouseup', e => this._onUp(e));
    this.canvas.addEventListener('click', e => this._onClick(e));
    this.canvas.addEventListener('touchstart', e => { e.preventDefault(); this._onDown(e); }, { passive: false });
    this.canvas.addEventListener('touchmove', e => { e.preventDefault(); this._onMove(e); }, { passive: false });
    this.canvas.addEventListener('touchend', e => this._onUp(e));
    // Scroll to zoom
    this.canvas.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newW = Math.max(300, Math.min(this.canvas.width * delta, (this._imgW || this.canvas.width) * 2));
      const newH = Math.round(newW * ((this._imgH || this.canvas.height) / (this._imgW || this.canvas.width)));
      this.canvas.width = Math.round(newW);
      this.canvas.height = newH;
      this._render();
    }, { passive: false });
  }

  _onDown(e) {
    const pt = this._pt(e);
    if (this.tool === 'arrow' || this.tool === 'line') {
      this.isDrawing = true;
      this.drawStart = pt;
      this.currentDraw = { type: this.tool, x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y,
        color: this.side === 'attack' ? '#4a9eff' : '#e8b84b', id: Date.now() };
    } else if (this.tool === 'select') {
      const hit = this._hitTest(pt);
      if (hit) {
        this.selectedId = hit.id;
        this.isDragging = true;
        this.dragOffX = pt.x - hit.x;
        this.dragOffY = pt.y - hit.y;
      } else { this.selectedId = null; }
      this._render();
    }
  }

  _onMove(e) {
    const pt = this._pt(e);
    if (this.isDrawing && this.currentDraw) {
      this.currentDraw.x2 = pt.x; this.currentDraw.y2 = pt.y;
      this._render();
      this._drawLinePreview(this.currentDraw);
    } else if (this.isDragging && this.selectedId) {
      const item = this.items.find(i => i.id === this.selectedId);
      if (item) { item.x = pt.x - this.dragOffX; item.y = pt.y - this.dragOffY; this._render(); }
    }
  }

  _onUp(e) {
    if (this.isDrawing && this.currentDraw) {
      const dx = this.currentDraw.x2 - this.currentDraw.x1;
      const dy = this.currentDraw.y2 - this.currentDraw.y1;
      if (Math.hypot(dx, dy) > 8) { this.drawings.push({ ...this.currentDraw }); this._scheduleSave(); }
      this._render();
    }
    if (this.isDragging) this._scheduleSave();
    this.isDrawing = false; this.isDragging = false; this.currentDraw = null;
  }

  _onClick(e) {
    if (this.isDragging) return;
    const pt = this._pt(e);
    if (this.tool === 'operator' && this.selectedOp) {
      this.items.push({ id: Date.now(), type: 'operator', label: this.selectedOp,
        x: pt.x - 20, y: pt.y - 20, r: 20, side: this.side });
      this._render(); this._scheduleSave();
    } else if (this.tool === 'gadget' && this.selectedGadget) {
      this.items.push({ id: Date.now(), type: 'gadget', label: this.selectedGadget.label,
        symbol: this.selectedGadget.symbol, x: pt.x - 14, y: pt.y - 14, r: 14,
        color: this.selectedGadget.color, side: this.side });
      this._render(); this._scheduleSave();
    } else if (this.tool === 'eraser') {
      const hit = this._hitTest(pt);
      if (hit) { this.items = this.items.filter(i => i.id !== hit.id); }
      else { this.drawings = this.drawings.filter(d => this._ptLineDist(pt, d) > 12); }
      this._render(); this._scheduleSave();
    }
  }

  _hitTest(pt) {
    return [...this.items].reverse().find(item => {
      const r = (item.r || 18) + 4;
      return Math.hypot(pt.x - (item.x + (item.r||18)), pt.y - (item.y + (item.r||18))) <= r;
    });
  }

  _ptLineDist(pt, d) {
    const dx = d.x2 - d.x1, dy = d.y2 - d.y1;
    const len2 = dx*dx + dy*dy;
    if (!len2) return Math.hypot(pt.x - d.x1, pt.y - d.y1);
    const t = Math.max(0, Math.min(1, ((pt.x-d.x1)*dx + (pt.y-d.y1)*dy) / len2));
    return Math.hypot(pt.x - (d.x1 + t*dx), pt.y - (d.y1 + t*dy));
  }

  _render() {
    if (!this.ctx || !this.canvas) return;
    const W = this.canvas.width, H = this.canvas.height;
    const imgW = this.currentImg ? this.currentImg.naturalWidth : W;
    const imgH = this.currentImg ? this.currentImg.naturalHeight : H;
    // Scale factor: image coords -> canvas pixels
    const sx = W / imgW;
    const sy = H / imgH;
    this.ctx.clearRect(0, 0, W, H);
    if (this.currentImg) {
      this.ctx.drawImage(this.currentImg, 0, 0, W, H);
      this.ctx.fillStyle = 'rgba(0,0,0,0.12)';
      this.ctx.fillRect(0, 0, W, H);
    } else {
      this.ctx.fillStyle = '#111'; this.ctx.fillRect(0, 0, W, H);
      this.ctx.fillStyle = '#444'; this.ctx.font = '14px Barlow,sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.map ? 'Loading ' + this.map + '...' : 'Select a map', W/2, H/2);
    }
    // Draw in image coordinate space scaled to canvas
    this.ctx.save();
    this.ctx.scale(sx, sy);
    this.drawings.forEach(d => this._drawLine(d));
    this.items.forEach(item => this._drawItem(item));
    this.ctx.restore();
  }

  _drawLine(d) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = d.color; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(d.x1, d.y1); ctx.lineTo(d.x2, d.y2); ctx.stroke();
    if (d.type === 'arrow') {
      const angle = Math.atan2(d.y2-d.y1, d.x2-d.x1);
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.moveTo(d.x2, d.y2);
      ctx.lineTo(d.x2 - 13*Math.cos(angle-0.4), d.y2 - 13*Math.sin(angle-0.4));
      ctx.lineTo(d.x2 - 13*Math.cos(angle+0.4), d.y2 - 13*Math.sin(angle+0.4));
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  _drawLinePreview(d) {
    const ctx = this.ctx; const s = this._scale || 1;
    ctx.save(); ctx.scale(s, s);
    ctx.strokeStyle = d.color; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.setLineDash([6, 3]);
    ctx.beginPath(); ctx.moveTo(d.x1, d.y1); ctx.lineTo(d.x2, d.y2); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
  }

  _drawItem(item) {
    const ctx = this.ctx;
    const r = item.r || 20;
    const cx = item.x + r, cy = item.y + r;
    const isSelected = item.id === this.selectedId;

    if (item.type === 'operator') {
      // Try to draw icon image
      const iconKey = OP_ICON[item.label];
      const iconUrl = iconKey ? (ICON_BASE + iconKey + '.svg') : null;

      if (iconUrl && this.opIconCache[iconUrl] && this.opIconCache[iconUrl] !== 'loading' && this.opIconCache[iconUrl] !== 'error') {
        // Draw background circle
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.fillStyle = item.side === 'attack' ? '#1a3a5a' : '#3a2a0a';
        ctx.fill();
        if (isSelected) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke(); }
        else { ctx.strokeStyle = item.side === 'attack' ? '#4a9eff' : '#e8b84b'; ctx.lineWidth = 1.5; ctx.stroke(); }
        // Draw icon clipped to circle
        ctx.beginPath(); ctx.arc(cx, cy, r - 2, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(this.opIconCache[iconUrl], item.x+2, item.y+2, r*2-4, r*2-4);
        ctx.restore();
      } else {
        // Fallback: colored circle with initials
        const initials = item.label.split(/[\s\-]/).map(w=>w[0]).join('').slice(0,3).toUpperCase();
        ctx.save();
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.fillStyle = item.side === 'attack' ? '#4a9eff' : '#e8b84b';
        ctx.fill();
        if (isSelected) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke(); }
        ctx.fillStyle = item.side === 'attack' ? '#fff' : '#000';
        ctx.font = `bold ${Math.max(8, r*0.65)}px Barlow Condensed,sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(initials, cx, cy); ctx.restore();
        // Load icon in background
        if (iconUrl && !this.opIconCache[iconUrl]) this._loadOpIcon(iconUrl, item.id);
      }
      // Label below
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.font = `${Math.max(8,r*0.5)}px Barlow,sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.shadowColor = '#000'; ctx.shadowBlur = 3;
      const shortName = item.label.length > 9 ? item.label.slice(0,9)+'…' : item.label;
      ctx.fillText(shortName, cx, cy + r + 2); ctx.restore();

    } else if (item.type === 'gadget') {
      const s2 = r * 1.8;
      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(item.x, item.y, s2, s2, 5);
      else { ctx.rect(item.x, item.y, s2, s2); }
      ctx.fillStyle = item.color + 'cc';
      ctx.fill();
      if (isSelected) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
      else { ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(7,r*0.6)}px Barlow Condensed,sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = '#000'; ctx.shadowBlur = 2;
      ctx.fillText(item.symbol || item.label.slice(0,4), item.x+s2/2, item.y+s2/2);
      ctx.restore();
    }
  }

  _loadOpIcon(url) {
    this.opIconCache[url] = 'loading';
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Test if we can draw it (CORS might still block canvas draw)
      try {
        const tc = document.createElement('canvas');
        tc.width = 40; tc.height = 40;
        tc.getContext('2d').drawImage(img, 0, 0, 40, 40);
        this.opIconCache[url] = img;
      } catch(e) {
        this.opIconCache[url] = 'error';
      }
      this._render();
    };
    img.onerror = () => { this.opIconCache[url] = 'error'; };
    // Add cache-bust to help with CORS
    img.src = url + '?v=1';
  }

  _scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this._saveState(), 1500);
  }

  async _saveState() {
    if (!this.saveKey) return;
    try {
      await setDoc(doc(db, 'map_plans', this.saveKey), {
        items: this.items, drawings: this.drawings,
        map: this.map, floorIndex: this.floorIndex,
        savedAt: serverTimestamp()
      });
      const ind = document.getElementById('planner-save-indicator');
      if (ind) { ind.style.opacity = '1'; setTimeout(() => ind.style.opacity = '0', 1500); }
      if (this.options.onSave) this.options.onSave(this.getData());
    } catch(e) { console.error('Canvas save error', e); }
  }

  async _loadState() {
    if (!this.saveKey) return;
    try {
      const snap = await getDoc(doc(db, 'map_plans', this.saveKey));
      if (snap.exists()) {
        this.items = snap.data().items || [];
        this.drawings = snap.data().drawings || [];
        this._render();
      }
    } catch(e) {}
  }
}

// ============================================================
// STANDALONE BRAINSTORM PAGE
// ============================================================
let brainstormCanvas = null;
let brainstormMap = null;

export function initBrainstorm(user) {
  buildBrainstormMapList();
}

function buildBrainstormMapList() {
  const list = document.getElementById('brainstorm-map-list');
  if (!list) return;
  list.innerHTML = '';
  Object.keys(MAP_IMAGES).sort().forEach(map => {
    const btn = document.createElement('button');
    btn.className = 'map-planner-btn';
    btn.textContent = map;
    btn.onclick = () => {
      document.querySelectorAll('#brainstorm-map-list .map-planner-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadBrainstormMap(map);
    };
    list.appendChild(btn);
  });
}

function loadBrainstormMap(map) {
  brainstormMap = map;
  const canvasArea = document.getElementById('brainstorm-canvas-area');
  const emptyState = document.getElementById('brainstorm-empty');
  if (canvasArea) canvasArea.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';
  document.getElementById('brainstorm-map-title').textContent = map;

  // Floor selector
  buildBrainstormFloorSelect(map);
  buildBrainstormToolbar();
  buildBrainstormPalettes('defense');

  const floorIndex = 0;
  const saveKey = `brainstorm__${map}__0`.replace(/\s/g,'_');
  brainstormCanvas = new MapCanvas('brainstorm-svg-container', saveKey, { map, floorIndex, side: 'defense' });
  brainstormCanvas.init();
  brainstormCanvas._loadState();
}

function buildBrainstormFloorSelect(map) {
  const sel = document.getElementById('brainstorm-floor-select');
  if (!sel) return;
  const floors = MAP_IMAGES[map] || [];
  sel.innerHTML = floors.map((f,i) => `<option value="${i}">${f.label}</option>`).join('');
  sel.onchange = () => {
    const idx = parseInt(sel.value);
    const saveKey = `brainstorm__${brainstormMap}__${idx}`.replace(/\s/g,'_');
    brainstormCanvas.saveKey = saveKey;
    brainstormCanvas.setFloor(idx);
    brainstormCanvas._loadState();
  };
}

function buildBrainstormToolbar() {
  const tb = document.getElementById('brainstorm-toolbar');
  if (!tb || tb.dataset.built) return;
  tb.dataset.built = '1';
  tb.innerHTML = buildToolbarHTML('brainstorm');
}

function buildToolbarHTML(prefix) {
  return `
    <div class="planner-tool-group">
      <button class="planner-tool-btn active" id="${prefix}-side-def" onclick="setBrainstormSide('defense')">Defense</button>
      <button class="planner-tool-btn" id="${prefix}-side-atk" onclick="setBrainstormSide('attack')">Attack</button>
    </div>
    <div class="planner-tool-group">
      <button class="planner-tool-btn active" id="${prefix}-tool-select" onclick="setBrainstormTool('select')">⊹ Select</button>
      <button class="planner-tool-btn" id="${prefix}-tool-operator" onclick="setBrainstormTool('operator')">◉ Operator</button>
      <button class="planner-tool-btn" id="${prefix}-tool-gadget" onclick="setBrainstormTool('gadget')">⬟ Gadget</button>
      <button class="planner-tool-btn" id="${prefix}-tool-arrow" onclick="setBrainstormTool('arrow')">→ Arrow</button>
      <button class="planner-tool-btn" id="${prefix}-tool-line" onclick="setBrainstormTool('line')">╱ Line</button>
      <button class="planner-tool-btn" id="${prefix}-tool-eraser" onclick="setBrainstormTool('eraser')">⌫ Erase</button>
    </div>
    <button class="planner-tool-btn danger" onclick="clearBrainstorm()">🗑 Clear</button>
    <button class="planner-tool-btn accent" onclick="saveBrainstorm()">💾 Save</button>
  `;
}

function buildBrainstormPalettes(side) {
  buildPalette('brainstorm-op-palette', side, 'brainstorm-selectOp', brainstormCanvas);
  buildGadgetPalette2('brainstorm-gadget-palette', side, 'brainstorm-selectGadget', brainstormCanvas);
}

function buildPalette(containerId, side, fnName, canvasInst) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const ops = side === 'attack' ? ATTACK_OPERATORS : DEFENSE_OPERATORS;
  el.innerHTML = `<div class="section-title" style="margin-bottom:5px">${side === 'attack' ? 'Attackers' : 'Defenders'}</div>
    <div style="display:flex;flex-wrap:wrap;gap:3px">
      ${ops.map(op => `<button class="planner-op-btn" onclick="${fnName}('${op.replace(/'/g,"\\'")}');buildBrainstormPalettes('${side}')" title="${op}">${op.length>8?op.slice(0,8)+'…':op}</button>`).join('')}
    </div>`;
}

function buildGadgetPalette2(containerId, side, fnName, canvasInst) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const gadgets = side === 'attack' ? GADGETS.attack : GADGETS.defense;
  el.innerHTML = `<div class="section-title" style="margin-bottom:5px">Gadgets</div>
    <div style="display:flex;flex-wrap:wrap;gap:3px">
      ${gadgets.map(g => `<button class="planner-op-btn" style="border-color:${g.color}55" onclick="${fnName}('${g.id}')" title="${g.label}">${g.symbol}</button>`).join('')}
    </div>`;
}

// Brainstorm globals
window.setBrainstormSide = function(side) {
  if (!brainstormCanvas) return;
  brainstormCanvas.setSide(side);
  document.getElementById('brainstorm-side-def')?.classList.toggle('active', side==='defense');
  document.getElementById('brainstorm-side-atk')?.classList.toggle('active', side==='attack');
  buildBrainstormPalettes(side);
};
window.setBrainstormTool = function(tool) {
  if (!brainstormCanvas) return;
  brainstormCanvas.setTool(tool);
  ['select','operator','gadget','arrow','line','eraser'].forEach(t => {
    document.getElementById(`brainstorm-tool-${t}`)?.classList.toggle('active', t===tool);
  });
};
window.brainstorm_selectOp = function(op) {
  if (brainstormCanvas) { brainstormCanvas.setOperator(op); brainstormCanvas.setTool('operator'); }
};
window.brainstorm_selectGadget = function(id) {
  const all = [...GADGETS.attack, ...GADGETS.defense];
  const g = all.find(x => x.id === id);
  if (brainstormCanvas && g) { brainstormCanvas.setGadget(g); brainstormCanvas.setTool('gadget'); }
};
window.clearBrainstorm = function() {
  if (!brainstormCanvas || !confirm('Clear this floor?')) return;
  brainstormCanvas.clear();
};
window.saveBrainstorm = function() { brainstormCanvas?._saveState(); };

// Export for strat canvases
export { MAP_IMAGES };
