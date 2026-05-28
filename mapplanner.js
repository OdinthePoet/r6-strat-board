// ============================================================
// MAP PLANNER v5
// - Unified image-coordinate system (fixes placement)
// - HTML overlay for operator icons (fixes CORS icon issue)
// - Proper zoom via CSS transform (fixes zoom)
// ============================================================

import { ATTACK_OPERATORS, DEFENSE_OPERATORS, GADGETS, ICON_BASE, OP_ICON } from './data.js';
import { db } from './firebase-config.js';
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
    { label: "Floor 1", file: "kafe_map_floor_1.webp" },
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

const imgCache = {};

// ============================================================
// MapCanvas
// Architecture:
//   - A <div> wrapper (scrollable, zoomable via CSS transform)
//   - A <canvas> for background image + drawings (lines/arrows)
//   - An <div#overlay> for operator and gadget HTML icons
//
// All positions stored as percentages (0-100) of image dimensions
// so they are resolution-independent and zoom-safe.
// ============================================================
export class MapCanvas {
  constructor(containerId, saveKey, options = {}) {
    this.containerId = containerId;
    this.saveKey = saveKey;
    this.options = options;
    this.map = options.map || null;
    this.floorIndex = options.floorIndex || 0;
    this.side = options.side || 'defense';
    this.tool = 'select';
    this.selectedOp = null;
    this.selectedGadget = null;
    this.items = [];      // {id, type, label, symbol, color, side, px, py} px/py = 0-100%
    this.drawings = [];   // {id, type, x1,y1,x2,y2 in 0-100%, color}
    this.selectedId = null;
    this.isDragging = false;
    this.isDrawing = false;
    this.currentDraw = null;
    this.dragOffPx = 0;
    this.dragOffPy = 0;
    this.zoom = 1.0;
    this.wrapper = null;
    this.canvas = null;
    this.ctx = null;
    this.overlay = null;
    this.img = null;
    this.displayW = 0;
    this.displayH = 0;
    this.saveTimer = null;
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;
    container.innerHTML = '';

    // Scroll container
    const scrollWrap = document.createElement('div');
    scrollWrap.style.cssText = 'overflow:auto;width:100%;background:#0d0d0d;border-radius:8px;position:relative';
    scrollWrap.id = this.containerId + '-scroll';

    // Inner wrapper (transform origin for zoom)
    this.wrapper = document.createElement('div');
    this.wrapper.style.cssText = 'position:relative;display:inline-block;transform-origin:top left';

    // Canvas for image + drawings
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'display:block;cursor:crosshair';

    // HTML overlay for icons
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none';

    this.wrapper.appendChild(this.canvas);
    this.wrapper.appendChild(this.overlay);
    scrollWrap.appendChild(this.wrapper);
    container.appendChild(scrollWrap);

    this.ctx = this.canvas.getContext('2d');
    this._attachEvents(scrollWrap);
    if (this.map) this._loadImage();
  }

  // PUBLIC API
  setFloor(i) {
    this.floorIndex = i; this.items = []; this.drawings = []; this.selectedId = null;
    this._loadImage(() => this._loadState());
  }
  setSide(s) { this.side = s; }
  setTool(t) {
    this.tool = t;
    if (this.canvas) this.canvas.style.cursor = t === 'select' ? 'default' : t === 'eraser' ? 'cell' : 'crosshair';
  }
  setOperator(op) { this.selectedOp = op; }
  setGadget(g) { this.selectedGadget = g; }
  clear() { this.items = []; this.drawings = []; this.selectedId = null; this._render(); this._scheduleSave(); }
  getData() { return { items: this.items, drawings: this.drawings }; }
  setData(d) { this.items = d.items || []; this.drawings = d.drawings || []; this._render(); }
  async loadState() { await this._loadState(); }
  async saveState() { await this._saveState(); }

  // COORDINATE HELPERS
  // Event -> percentage coords (0-100)
  _evtToPct(e) {
    const rect = this.canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      px: ((cx - rect.left) / rect.width) * 100,
      py: ((cy - rect.top) / rect.height) * 100
    };
  }

  // Percentage -> canvas pixels
  _pctToPx(px, py) {
    return { x: (px / 100) * this.canvas.width, y: (py / 100) * this.canvas.height };
  }

  // EVENTS
  _attachEvents(scrollWrap) {
    this.canvas.addEventListener('mousedown', e => this._onDown(e));
    this.canvas.addEventListener('mousemove', e => this._onMove(e));
    this.canvas.addEventListener('mouseup',   e => this._onUp(e));
    this.canvas.addEventListener('click',     e => this._onClick(e));
    this.canvas.addEventListener('touchstart', e => { e.preventDefault(); this._onDown(e); }, { passive: false });
    this.canvas.addEventListener('touchmove',  e => { e.preventDefault(); this._onMove(e); }, { passive: false });
    this.canvas.addEventListener('touchend',   e => this._onUp(e));

    // Zoom with scroll wheel — use CSS transform so icons scale too
    scrollWrap.addEventListener('wheel', e => {
      if (!e.ctrlKey && Math.abs(e.deltaY) < 50) return; // only zoom on ctrl+wheel or large delta
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      this.zoom = Math.max(0.5, Math.min(4, this.zoom * factor));
      this.wrapper.style.transform = `scale(${this.zoom})`;
    }, { passive: false });

    // Pinch zoom on touch
    let lastDist = 0;
    scrollWrap.addEventListener('touchstart', e => {
      if (e.touches.length === 2) lastDist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }, { passive: true });
    scrollWrap.addEventListener('touchmove', e => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        if (lastDist > 0) {
          this.zoom = Math.max(0.5, Math.min(4, this.zoom * (dist / lastDist)));
          this.wrapper.style.transform = `scale(${this.zoom})`;
        }
        lastDist = dist;
      }
    }, { passive: true });

    // Zoom buttons
    const zoomIn = document.getElementById(this.containerId + '-zoomin');
    const zoomOut = document.getElementById(this.containerId + '-zoomout');
    const zoomReset = document.getElementById(this.containerId + '-zoomreset');
    if (zoomIn) zoomIn.onclick = () => { this.zoom = Math.min(4, this.zoom * 1.2); this.wrapper.style.transform = `scale(${this.zoom})`; };
    if (zoomOut) zoomOut.onclick = () => { this.zoom = Math.max(0.5, this.zoom * 0.85); this.wrapper.style.transform = `scale(${this.zoom})`; };
    if (zoomReset) zoomReset.onclick = () => { this.zoom = 1; this.wrapper.style.transform = 'scale(1)'; };
  }

  _onDown(e) {
    const pt = this._evtToPct(e);
    if (this.tool === 'arrow' || this.tool === 'line') {
      this.isDrawing = true;
      this.currentDraw = { id: Date.now(), type: this.tool,
        x1: pt.px, y1: pt.py, x2: pt.px, y2: pt.py,
        color: this.side === 'attack' ? '#4a9eff' : '#e8b84b' };
    } else if (this.tool === 'select') {
      const hit = this._hitTest(pt);
      if (hit) {
        this.selectedId = hit.id;
        this.isDragging = true;
        this.dragOffPx = pt.px - hit.px;
        this.dragOffPy = pt.py - hit.py;
        this.canvas.style.cursor = 'grabbing';
      } else { this.selectedId = null; }
      this._renderOverlay();
    }
  }

  _onMove(e) {
    const pt = this._evtToPct(e);
    if (this.isDrawing && this.currentDraw) {
      this.currentDraw.x2 = pt.px; this.currentDraw.y2 = pt.py;
      this._renderCanvas();
    } else if (this.isDragging && this.selectedId) {
      const item = this.items.find(i => i.id === this.selectedId);
      if (item) {
        item.px = Math.max(0, Math.min(100, pt.px - this.dragOffPx));
        item.py = Math.max(0, Math.min(100, pt.py - this.dragOffPy));
        this._renderOverlay();
      }
    }
  }

  _onUp(e) {
    if (this.isDrawing && this.currentDraw) {
      const dx = this.currentDraw.x2 - this.currentDraw.x1;
      const dy = this.currentDraw.y2 - this.currentDraw.y1;
      if (Math.hypot(dx, dy) > 1) {
        this.drawings.push({ ...this.currentDraw }); this._scheduleSave();
      }
      this.currentDraw = null;
      this._renderCanvas();
    }
    if (this.isDragging) { this._scheduleSave(); this.canvas.style.cursor = 'default'; }
    this.isDrawing = false; this.isDragging = false;
  }

  _onClick(e) {
    if (this.isDragging) return;
    const pt = this._evtToPct(e);
    if (this.tool === 'operator' && this.selectedOp) {
      this.items.push({ id: Date.now(), type: 'operator', label: this.selectedOp,
        px: pt.px, py: pt.py, side: this.side });
      this._renderOverlay(); this._scheduleSave();
    } else if (this.tool === 'gadget' && this.selectedGadget) {
      this.items.push({ id: Date.now(), type: 'gadget', label: this.selectedGadget.label,
        symbol: this.selectedGadget.symbol, color: this.selectedGadget.color,
        px: pt.px, py: pt.py, side: this.side });
      this._renderOverlay(); this._scheduleSave();
    } else if (this.tool === 'eraser') {
      const hit = this._hitTest(pt);
      if (hit) { this.items = this.items.filter(i => i.id !== hit.id); }
      else {
        this.drawings = this.drawings.filter(d => {
          const mid = { px: (d.x1+d.x2)/2, py: (d.y1+d.y2)/2 };
          return Math.hypot(pt.px - mid.px, pt.py - mid.py) > 3;
        });
      }
      this._renderOverlay(); this._renderCanvas(); this._scheduleSave();
    }
  }

  _hitTest(pt) {
    return [...this.items].reverse().find(item =>
      Math.hypot(pt.px - item.px, pt.py - item.py) < 4);
  }

  // RENDERING
  _render() { this._renderCanvas(); this._renderOverlay(); }

  _renderCanvas() {
    if (!this.ctx || !this.canvas) return;
    const W = this.canvas.width, H = this.canvas.height;
    this.ctx.clearRect(0, 0, W, H);
    if (this.img) {
      this.ctx.drawImage(this.img, 0, 0, W, H);
      this.ctx.fillStyle = 'rgba(0,0,0,0.08)';
      this.ctx.fillRect(0, 0, W, H);
    } else {
      this.ctx.fillStyle = '#111'; this.ctx.fillRect(0, 0, W, H);
      this.ctx.fillStyle = '#555'; this.ctx.font = '16px Barlow,sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.map ? 'Loading ' + this.map + '...' : 'Select a map', W/2, H/2);
    }
    this.drawings.forEach(d => this._drawLine(d));
    if (this.currentDraw) this._drawLine({ ...this.currentDraw, dashed: true });
  }

  _drawLine(d) {
    const p1 = this._pctToPx(d.x1, d.y1);
    const p2 = this._pctToPx(d.x2, d.y2);
    const lw = Math.max(2, this.canvas.width * 0.003);
    this.ctx.save();
    this.ctx.strokeStyle = d.color;
    this.ctx.lineWidth = lw;
    this.ctx.lineCap = 'round';
    if (d.dashed) this.ctx.setLineDash([8, 4]);
    this.ctx.beginPath(); this.ctx.moveTo(p1.x, p1.y); this.ctx.lineTo(p2.x, p2.y); this.ctx.stroke();
    this.ctx.setLineDash([]);
    if (d.type === 'arrow') {
      const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const al = Math.max(10, this.canvas.width * 0.02);
      this.ctx.fillStyle = d.color;
      this.ctx.beginPath();
      this.ctx.moveTo(p2.x, p2.y);
      this.ctx.lineTo(p2.x - al * Math.cos(angle - 0.4), p2.y - al * Math.sin(angle - 0.4));
      this.ctx.lineTo(p2.x - al * Math.cos(angle + 0.4), p2.y - al * Math.sin(angle + 0.4));
      this.ctx.closePath(); this.ctx.fill();
    }
    this.ctx.restore();
  }

  // HTML overlay — renders operator icons as real <img> elements
  // This completely avoids CORS issues since HTML images don't have canvas restrictions
  _renderOverlay() {
    if (!this.overlay) return;
    this.overlay.innerHTML = '';
    this.items.forEach(item => {
      const el = document.createElement('div');
      const isSelected = item.id === this.selectedId;
      el.style.cssText = `
        position:absolute;
        left:${item.px}%;
        top:${item.py}%;
        transform:translate(-50%,-50%);
        pointer-events:auto;
        cursor:${this.tool === 'select' ? 'grab' : this.tool === 'eraser' ? 'cell' : 'default'};
        user-select:none;
        display:flex;flex-direction:column;align-items:center;gap:2px;
      `;

      if (item.type === 'operator') {
        const iconKey = OP_ICON[item.label];
        const iconUrl = iconKey ? (ICON_BASE + iconKey + '.svg') : null;
        const borderColor = isSelected ? '#fff' : (item.side === 'attack' ? '#4a9eff' : '#e8b84b');
        const bgColor = item.side === 'attack' ? '#1a3a5a' : '#2a1a0a';
        const size = 36;

        if (iconUrl) {
          el.innerHTML = `
            <div style="width:${size}px;height:${size}px;border-radius:50%;background:${bgColor};border:2px solid ${borderColor};overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.6)">
              <img src="${iconUrl}" width="${size}" height="${size}" style="display:block;border-radius:50%" onerror="this.parentElement.innerHTML='<div style=width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${item.side==='attack'?'#fff':'#e8b84b'}'>${item.label.slice(0,3).toUpperCase()}</div>'">
            </div>
            <div style="font-size:10px;color:#fff;text-shadow:0 1px 3px #000;white-space:nowrap;font-family:'Barlow',sans-serif;font-weight:500">${item.label.length > 9 ? item.label.slice(0,9)+'…' : item.label}</div>
          `;
        } else {
          const initials = item.label.split(/[\s\-]/).map(w=>w[0]).join('').slice(0,3).toUpperCase();
          el.innerHTML = `
            <div style="width:${size}px;height:${size}px;border-radius:50%;background:${bgColor};border:2px solid ${borderColor};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:${item.side==='attack'?'#fff':'#e8b84b'};box-shadow:0 2px 6px rgba(0,0,0,0.6)">${initials}</div>
            <div style="font-size:10px;color:#fff;text-shadow:0 1px 3px #000;white-space:nowrap;font-family:'Barlow',sans-serif">${item.label.length > 9 ? item.label.slice(0,9)+'…' : item.label}</div>
          `;
        }

      } else if (item.type === 'gadget') {
        const borderColor = isSelected ? '#fff' : item.color;
        el.innerHTML = `
          <div style="min-width:32px;padding:2px 6px;border-radius:4px;background:${item.color}cc;border:2px solid ${borderColor};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.6);text-shadow:0 1px 2px #000;white-space:nowrap">${item.symbol || item.label.slice(0,6)}</div>
          <div style="font-size:9px;color:#fff;text-shadow:0 1px 3px #000;white-space:nowrap;font-family:'Barlow',sans-serif">${item.label.length > 10 ? item.label.slice(0,10)+'…' : item.label}</div>
        `;
      }

      // Drag events on icon elements
      el.addEventListener('mousedown', e => {
        if (this.tool !== 'select') return;
        e.stopPropagation();
        this.selectedId = item.id;
        this.isDragging = true;
        const pt = this._evtToPct(e);
        this.dragOffPx = pt.px - item.px;
        this.dragOffPy = pt.py - item.py;
        this.canvas.style.cursor = 'grabbing';
        this._renderOverlay();
      });

      this.overlay.appendChild(el);
    });
  }

  // IMAGE LOADING
  _loadImage(cb) {
    const floors = MAP_IMAGES[this.map] || [];
    const floor = floors[this.floorIndex];
    if (!floor) { this._render(); if (cb) cb(); return; }
    const src = './' + floor.file;
    if (imgCache[src]) {
      this.img = imgCache[src];
      this._fitCanvas(); this._render();
      if (cb) cb(); return;
    }
    const image = new Image();
    image.onload = () => {
      imgCache[src] = image; this.img = image;
      this._fitCanvas(); this._render();
      if (cb) cb();
    };
    image.onerror = () => {
      this.img = null; this._fitCanvas(); this._render();
      if (cb) cb();
    };
    image.src = src;
  }

  _fitCanvas() {
    const container = document.getElementById(this.containerId);
    const maxW = container ? Math.max(container.clientWidth - 8, 300) : 800;
    const imgW = this.img ? this.img.naturalWidth : 800;
    const imgH = this.img ? this.img.naturalHeight : 600;
    const scale = Math.min(1, maxW / imgW);
    this.canvas.width = Math.round(imgW * scale);
    this.canvas.height = Math.round(imgH * scale);
    this.displayW = this.canvas.width;
    this.displayH = this.canvas.height;
  }

  // SAVE / LOAD
  _scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this._saveState(), 1500);
  }

  async _saveState() {
    if (!this.saveKey) return;
    try {
      await setDoc(doc(db, 'map_plans', this.saveKey), {
        items: this.items, drawings: this.drawings,
        map: this.map, floorIndex: this.floorIndex, savedAt: serverTimestamp()
      });
      const ind = document.getElementById('planner-save-indicator');
      if (ind) { ind.style.opacity = '1'; setTimeout(() => ind.style.opacity = '0', 1500); }
      if (this.options.onSave) this.options.onSave(this.getData());
    } catch(e) { console.error('Save error', e); }
  }

  async _loadState() {
    if (!this.saveKey) return;
    try {
      const snap = await getDoc(doc(db, 'map_plans', this.saveKey));
      if (snap.exists()) {
        const data = snap.data();
        // Migrate old canvas-pixel coords to percentage coords if needed
        this.items = (data.items || []).map(item => {
          if (item.px === undefined && item.x !== undefined) {
            // Old format: x/y in canvas pixels - convert to rough percentage
            return { ...item, px: 50, py: 50 };
          }
          return item;
        });
        this.drawings = (data.drawings || []).map(d => {
          if (d.x1 > 100) return { ...d, x1: (d.x1/800)*100, y1: (d.y1/600)*100, x2: (d.x2/800)*100, y2: (d.y2/600)*100 };
          return d;
        });
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
  document.getElementById('brainstorm-canvas-area').style.display = 'block';
  document.getElementById('brainstorm-empty').style.display = 'none';
  document.getElementById('brainstorm-map-title').textContent = map;
  buildBrainstormFloorSelect(map);
  buildBrainstormToolbar();
  const saveKey = `brainstorm__${map}__0`.replace(/\s/g, '_');
  if (brainstormCanvas) { brainstormCanvas.map = map; brainstormCanvas.floorIndex = 0; brainstormCanvas.saveKey = saveKey; brainstormCanvas.items = []; brainstormCanvas.drawings = []; brainstormCanvas._loadImage(() => brainstormCanvas._loadState()); }
  else { brainstormCanvas = new MapCanvas('brainstorm-svg-container', saveKey, { map, floorIndex: 0, side: 'defense' }); brainstormCanvas.init(); brainstormCanvas._loadState(); }
  buildBrainstormPalettes('defense');
}

function buildBrainstormFloorSelect(map) {
  const sel = document.getElementById('brainstorm-floor-select');
  if (!sel) return;
  sel.innerHTML = (MAP_IMAGES[map] || []).map((f, i) => `<option value="${i}">${f.label}</option>`).join('');
  sel.onchange = () => {
    const idx = parseInt(sel.value);
    if (!brainstormCanvas) return;
    brainstormCanvas.saveKey = `brainstorm__${brainstormMap}__${idx}`.replace(/\s/g, '_');
    brainstormCanvas.setFloor(idx);
    brainstormCanvas._loadState();
  };
}

function buildBrainstormToolbar() {
  const tb = document.getElementById('brainstorm-toolbar');
  if (!tb || tb.dataset.built) return;
  tb.dataset.built = '1';
  tb.innerHTML = `
    <div class="planner-tool-group">
      <button class="planner-tool-btn active" id="bs-side-def" onclick="setBrainstormSide('defense')">Defense</button>
      <button class="planner-tool-btn" id="bs-side-atk" onclick="setBrainstormSide('attack')">Attack</button>
    </div>
    <div class="planner-tool-group">
      <button class="planner-tool-btn active" id="bs-tool-select" onclick="setBrainstormTool('select')">⊹ Select</button>
      <button class="planner-tool-btn" id="bs-tool-operator" onclick="setBrainstormTool('operator')">◉ Operator</button>
      <button class="planner-tool-btn" id="bs-tool-gadget" onclick="setBrainstormTool('gadget')">⬟ Gadget</button>
      <button class="planner-tool-btn" id="bs-tool-arrow" onclick="setBrainstormTool('arrow')">→ Arrow</button>
      <button class="planner-tool-btn" id="bs-tool-line" onclick="setBrainstormTool('line')">╱ Line</button>
      <button class="planner-tool-btn" id="bs-tool-eraser" onclick="setBrainstormTool('eraser')">⌫ Erase</button>
    </div>
    <button class="planner-tool-btn" id="brainstorm-svg-container-zoomin" title="Zoom in">＋</button>
    <button class="planner-tool-btn" id="brainstorm-svg-container-zoomout" title="Zoom out">－</button>
    <button class="planner-tool-btn" id="brainstorm-svg-container-zoomreset" title="Reset zoom">⊡</button>
    <button class="planner-tool-btn danger" onclick="clearBrainstorm()">🗑 Clear</button>
    <button class="planner-tool-btn accent" onclick="if(brainstormCanvas)brainstormCanvas._saveState()">💾 Save</button>
  `;
}

function buildBrainstormPalettes(side) {
  const ops = side === 'attack' ? ATTACK_OPERATORS : DEFENSE_OPERATORS;
  const opPal = document.getElementById('brainstorm-op-palette');
  if (opPal) {
    opPal.innerHTML = `<div class="section-title" style="margin-bottom:5px">${side === 'attack' ? 'Attackers' : 'Defenders'}</div>
      <div style="display:flex;flex-wrap:wrap;gap:3px">
        ${ops.map(op => {
          const iconKey = OP_ICON[op];
          const iconUrl = iconKey ? (ICON_BASE + iconKey + '.svg') : null;
          return `<button class="planner-op-btn" onclick="bsSelectOp('${op.replace(/'/g,"\\'")}');buildBSPalettes('${side}')" title="${op}" style="display:flex;align-items:center;gap:3px;padding:3px 6px">
            ${iconUrl ? `<img src="${iconUrl}" width="16" height="16" style="border-radius:50%;vertical-align:middle" onerror="this.style.display='none'">` : ''}
            ${op.length > 7 ? op.slice(0,7)+'…' : op}
          </button>`;
        }).join('')}
      </div>`;
  }
  const gadgets = side === 'attack' ? GADGETS.attack : GADGETS.defense;
  const gadPal = document.getElementById('brainstorm-gadget-palette');
  if (gadPal) {
    gadPal.innerHTML = `<div class="section-title" style="margin-bottom:5px">Gadgets</div>
      <div style="display:flex;flex-wrap:wrap;gap:3px">
        ${gadgets.map(g => `<button class="planner-op-btn" style="border-color:${g.color}66;color:${g.color}" onclick="bsSelectGadget('${g.id}')" title="${g.label}">${g.symbol}</button>`).join('')}
      </div>`;
  }
}
window.buildBSPalettes = buildBrainstormPalettes;

window.setBrainstormSide = function(side) {
  if (!brainstormCanvas) return;
  brainstormCanvas.setSide(side);
  document.getElementById('bs-side-def')?.classList.toggle('active', side === 'defense');
  document.getElementById('bs-side-atk')?.classList.toggle('active', side === 'attack');
  buildBrainstormPalettes(side);
};
window.setBrainstormTool = function(tool) {
  if (!brainstormCanvas) return;
  brainstormCanvas.setTool(tool);
  ['select','operator','gadget','arrow','line','eraser'].forEach(t =>
    document.getElementById(`bs-tool-${t}`)?.classList.toggle('active', t === tool));
};
window.bsSelectOp = function(op) {
  if (!brainstormCanvas) return;
  brainstormCanvas.setOperator(op);
  setBrainstormTool('operator');
};
window.bsSelectGadget = function(id) {
  const all = [...GADGETS.attack, ...GADGETS.defense];
  const g = all.find(x => x.id === id);
  if (!brainstormCanvas || !g) return;
  brainstormCanvas.setGadget(g);
  setBrainstormTool('gadget');
};
window.clearBrainstorm = function() {
  if (brainstormCanvas && confirm('Clear this floor?')) brainstormCanvas.clear();
};

export { MAP_IMAGES };
