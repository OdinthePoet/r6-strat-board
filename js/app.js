import { auth, db } from './firebase-config.js';
import { MAPS, MAP_NAMES, ATTACK_OPERATORS, DEFENSE_OPERATORS, ALL_OPERATORS, META, GADGETS } from './data.js';
import { initMapPlanner } from './mapplanner.js';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, addDoc, getDocs, deleteDoc, doc, onSnapshot,
  query, orderBy, serverTimestamp, updateDoc, setDoc, getDoc, where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== STATE =====
let currentUser = null;
let allStrats = [];
let allMatches = [];
let allRoster = [];
let selectedStratOps = [];
let stratSteps = [];
let editStratId = null;
let activeStratId = null;
let currentBans = { atk: [], def: [] };
let opRoleEditStratId = null;
let opRoleEditOp = null;
let unsubStrats = null;
let unsubMatches = null;

// ===== AUTH =====
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await ensureUserProfile(user);
    showApp();
    initApp();
  } else {
    currentUser = null;
    showAuth();
  }
});

async function ensureUserProfile(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || user.email.split('@')[0],
      email: user.email,
      joinedAt: serverTimestamp()
    });
  }
}

function showAuth() {
  document.getElementById('auth-screen').classList.add('active');
  document.getElementById('app-screen').classList.remove('active');
}

function showApp() {
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  const name = currentUser.displayName || currentUser.email.split('@')[0];
  document.getElementById('user-name').textContent = name;
  const initials = name.slice(0, 2).toUpperCase();
  document.getElementById('user-avatar').textContent = initials;
  document.getElementById('mobile-avatar').textContent = initials;
  document.getElementById('profile-name').value = name;
}

window.handleLogin = async function () {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const err = document.getElementById('login-error');
  err.textContent = '';
  try { await signInWithEmailAndPassword(auth, email, pass); }
  catch (e) { err.textContent = friendlyError(e.code); }
};

window.handleRegister = async function () {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value;
  const err = document.getElementById('reg-error');
  err.textContent = '';
  if (!name) { err.textContent = 'Please enter a callsign.'; return; }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, 'users', cred.user.uid), { displayName: name, email, joinedAt: serverTimestamp() });
  } catch (e) { err.textContent = friendlyError(e.code); }
};

window.handleLogout = async function () {
  if (unsubStrats) unsubStrats();
  if (unsubMatches) unsubMatches();
  await signOut(auth);
};

window.switchTab = function (tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.auth-tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
  });
};

function friendlyError(code) {
  const m = {
    'auth/user-not-found': 'No account with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'Email already registered.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/invalid-credential': 'Incorrect email or password.'
  };
  return m[code] || 'Something went wrong. Try again.';
}

// ===== APP INIT =====
function initApp() {
  populateAllSelects();
  initStratBoard();
  initTeamHub();
  initStats();
  loadRoster();
  subscribeStrats();
  subscribeMatches();
  initMapPlanner(currentUser);
}

function populateAllSelects() {
  // Map selects
  ['strat-map', 'meta-map', 'bans-map-select', 'map-notes-select',
    'stats-map-filter'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    if (el.id === 'stats-map-filter') el.innerHTML = '<option value="">All maps</option>';
    MAP_NAMES.forEach(m => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      el.appendChild(o);
    });
  });

  // Operator ban selects
  ['atk-ban-select', 'def-ban-select'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const ops = i === 0 ? DEFENSE_OPERATORS : ATTACK_OPERATORS;
    el.innerHTML = '<option value="">Select operator...</option>';
    ops.forEach(op => {
      const o = document.createElement('option');
      o.value = op; o.textContent = op;
      el.appendChild(o);
    });
  });

  updateStratSites();
  updateMetaSites();
}

// ===== NAVIGATION =====
window.showPage = function (page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const navEl = document.querySelector(`[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');
  if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
  if (page === 'stats') renderStats();
  if (page === 'dashboard') renderDashboard();
  if (page === 'settings') loadRoster();
};

window.toggleSidebar = function () {
  document.getElementById('sidebar').classList.toggle('open');
};

// ===== STRAT BOARD =====
function initStratBoard() {
  buildStratOpSelector();
}

function subscribeStrats() {
  const q = query(collection(db, 'strats'), orderBy('createdAt', 'desc'));
  unsubStrats = onSnapshot(q, snap => {
    allStrats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderStratTree();
    renderDashboard();
  });
}

function subscribeMatches() {
  const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'));
  unsubMatches = onSnapshot(q, snap => {
    allMatches = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderDashboard();
    if (document.getElementById('page-stats').classList.contains('active')) renderStats();
  });
}

window.renderStratTree = function () {
  const side = document.getElementById('sb-side-select').value;
  const strats = allStrats.filter(s => s.side === side);
  const tree = document.getElementById('strat-tree');

  // Group by map then folder
  const byMap = {};
  MAP_NAMES.forEach(m => { byMap[m] = {}; });
  strats.forEach(s => {
    if (!byMap[s.map]) byMap[s.map] = {};
    const folder = s.folder || 'General';
    if (!byMap[s.map][folder]) byMap[s.map][folder] = [];
    byMap[s.map][folder].push(s);
  });

  let html = '';
  MAP_NAMES.forEach(map => {
    const folders = byMap[map];
    const hasStrats = Object.values(folders).some(f => f.length > 0);
    const mapCategory = MAPS[map]?.category || 'ranked';
    html += `<div class="strat-map-item">
      <button class="strat-map-btn" onclick="toggleMapNode(this, '${map}')">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        ${map}
        <span class="badge badge-${mapCategory}" style="margin-left:auto;font-size:9px">${mapCategory}</span>
      </button>
      <div class="strat-children" id="map-node-${map.replace(/\s/g,'-')}" style="display:none">`;

    Object.keys(folders).forEach(folder => {
      if (!folders[folder].length) return;
      html += `<div>
        <button class="strat-folder-btn" onclick="toggleFolderNode(this, '${map}-${folder}')">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          ${folder}
        </button>
        <div id="folder-node-${map.replace(/\s/g,'-')}-${folder.replace(/\s/g,'-')}" style="display:none">`;
      folders[folder].forEach(s => {
        html += `<button class="strat-item-btn ${activeStratId === s.id ? 'active' : ''}" onclick="selectStrat('${s.id}')">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>
          ${s.name}
        </button>`;
      });
      html += `</div>
        <button class="add-strat-btn" onclick="openNewStratModalFor('${map}', '${folder}', '${side}')">+ Add strat</button>
      </div>`;
    });

    html += `<button class="add-strat-btn" onclick="openNewStratModalFor('${map}', '', '${side}')">+ New strat / folder</button>
      </div></div>`;
  });

  tree.innerHTML = html;

  // Re-open active map/folder if strat selected
  if (activeStratId) {
    const s = allStrats.find(x => x.id === activeStratId);
    if (s) {
      const mapNode = document.getElementById(`map-node-${s.map.replace(/\s/g, '-')}`);
      if (mapNode) {
        mapNode.style.display = 'block';
        const folder = s.folder || 'General';
        const folderNode = document.getElementById(`folder-node-${s.map.replace(/\s/g, '-')}-${folder.replace(/\s/g, '-')}`);
        if (folderNode) folderNode.style.display = 'block';
      }
    }
  }
};

window.toggleMapNode = function (btn, map) {
  const node = document.getElementById(`map-node-${map.replace(/\s/g, '-')}`);
  const open = node.style.display !== 'none';
  node.style.display = open ? 'none' : 'block';
  btn.classList.toggle('open', !open);
};

window.toggleFolderNode = function (btn, key) {
  const node = document.getElementById(`folder-node-${key.replace(/\s/g, '-')}`);
  if (!node) return;
  node.style.display = node.style.display === 'none' ? 'block' : 'none';
};

window.selectStrat = function (id) {
  activeStratId = id;
  renderStratTree();
  renderStratDetail(id);
};

function renderStratDetail(id) {
  const s = allStrats.find(x => x.id === id);
  if (!s) return;
  const matches = allMatches.filter(m => m.stratId === id);
  const wins = matches.filter(m => m.result === 'win').length;
  const winRate = matches.length ? Math.round((wins / matches.length) * 100) : null;
  const sideColor = s.side === 'attack' ? 'atk' : 'def';
  const isOwner = s.createdById === currentUser?.uid;

  const opRoles = s.opRoles || {};

  document.getElementById('strat-detail').innerHTML = `
    <div class="strat-detail-header">
      <div class="strat-detail-title">${s.name}</div>
      <span class="badge badge-${sideColor}">${s.side}</span>
      <span class="badge badge-role">${s.map} — ${s.site || ''}</span>
      <span class="badge badge-${s.difficulty}">${s.difficulty}</span>
      ${winRate !== null ? `<span class="badge" style="background:rgba(76,175,125,0.12);color:var(--success)">${winRate}% WR</span>` : ''}
      <button class="btn-accent-sm" onclick="openMatchModal('${id}')">Log match</button>
      ${isOwner ? `<button class="btn-danger" onclick="deleteStrat('${id}')">Delete</button>` : ''}
    </div>
    <div class="strat-tabs">
      <button class="strat-tab active" onclick="switchStratTab(this,'overview')">Overview</button>
      <button class="strat-tab" onclick="switchStratTab(this,'roles')">Operator Roles</button>
      <button class="strat-tab" onclick="switchStratTab(this,'matchlog')">Match Log (${matches.length})</button>
      <button class="strat-tab" onclick="switchStratTab(this,'bans')">Bans</button>
    </div>

    <div id="strat-tab-overview" class="strat-tab-content active">
      ${s.description ? `<p style="font-size:13px;color:var(--text-2);line-height:1.8;margin-bottom:1rem">${s.description}</p>` : ''}
      ${s.operators?.length ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1rem">${s.operators.map(o => `<span class="badge badge-role" style="font-size:12px;padding:4px 10px">${o}</span>`).join('')}</div>` : ''}
      ${s.steps?.length ? `<div class="section-title" style="margin-bottom:.5rem">Steps</div>
      <div style="display:flex;flex-direction:column;gap:6px">${s.steps.map((st, i) => `
        <div style="display:flex;gap:10px;align-items:flex-start">
          <div style="width:20px;height:20px;border-radius:50%;background:var(--gold-dim);border:1px solid var(--gold-border);color:var(--gold);font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px">${i + 1}</div>
          <div style="font-size:13px;color:var(--text-2);line-height:1.7">${st}</div>
        </div>`).join('')}</div>` : ''}
      ${isOwner ? `<button class="btn-sm" onclick="openEditStratModal('${id}')" style="margin-top:1rem">Edit strat</button>` : ''}
    </div>

    <div id="strat-tab-roles" class="strat-tab-content">
      <div class="section-title" style="margin-bottom:.75rem">Operator role cards</div>
      ${s.operators?.length ? `<div class="op-role-grid">${s.operators.map(op => `
        <div class="op-role-card">
          <div class="op-role-header">
            <div class="op-role-name">${op}</div>
            <button class="btn-sm" onclick="openOpRoleModal('${id}','${op}')">Edit role</button>
          </div>
          <div class="op-role-notes">${opRoles[op] || '<span style="color:var(--text-3);font-style:italic">No role notes yet. Click edit to add setup tasks, timing, and positioning.</span>'}</div>
        </div>`).join('')}</div>` : '<div class="empty-state">No operators assigned to this strat yet.</div>'}
    </div>

    <div id="strat-tab-matchlog" class="strat-tab-content">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
        <div class="section-title">Match history</div>
        <button class="btn-accent-sm" onclick="openMatchModal('${id}')">+ Log match</button>
      </div>
      ${matches.length ? `
        <div style="display:flex;gap:12px;margin-bottom:1.25rem;flex-wrap:wrap">
          <div class="stat-card" style="flex:1;min-width:100px"><div class="stat-label">Played</div><div class="stat-value">${matches.length}</div></div>
          <div class="stat-card" style="flex:1;min-width:100px"><div class="stat-label">Wins</div><div class="stat-value green">${wins}</div></div>
          <div class="stat-card" style="flex:1;min-width:100px"><div class="stat-label">Win rate</div><div class="stat-value gold">${winRate}%</div></div>
        </div>
        <div class="match-log-list">${matches.map(m => matchItemHTML(m)).join('')}</div>` :
        '<div class="empty-state">No matches logged yet for this strat.</div>'}
    </div>

    <div id="strat-tab-bans" class="strat-tab-content">
      <p style="font-size:13px;color:var(--text-2);margin-bottom:1rem">Suggested bans for <strong style="color:var(--text-1)">${s.map}</strong>. Set team-wide ban preferences in Team Hub → Ban Planner.</p>
      ${renderInlineBans(s.map)}
    </div>
  `;
}

function renderInlineBans(map) {
  const bansDoc = currentBans;
  if (!bansDoc.atk?.length && !bansDoc.def?.length) {
    return `<div class="empty-state">No bans set for this map yet. Go to Team Hub → Ban Planner to set them.</div>`;
  }
  return `<div class="ban-panel">
    <div><div class="section-title">Attack bans</div><div class="ban-list">${(bansDoc.atk||[]).map(b => `<span class="ban-chip">${b}</span>`).join('') || '<span style="color:var(--text-3);font-size:13px">None set</span>'}</div></div>
    <div><div class="section-title">Defense bans</div><div class="ban-list">${(bansDoc.def||[]).map(b => `<span class="ban-chip">${b}</span>`).join('') || '<span style="color:var(--text-3);font-size:13px">None set</span>'}</div></div>
  </div>`;
}

window.switchStratTab = function (btn, tab) {
  document.querySelectorAll('.strat-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.strat-tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(`strat-tab-${tab}`);
  if (el) el.classList.add('active');
};

function matchItemHTML(m) {
  const playerRows = (m.players || []).map(p => `
    <div class="player-stat-row">
      <div class="player-stat-name">${p.name}</div>
      <div class="player-stat-vals">
        <span>${p.kills}K</span><span>${p.deaths}D</span><span>${p.assists}A</span>
        <span class="kost-${p.kost ? 'yes' : 'no'}">KOST:${p.kost ? '✓' : '✗'}</span>
      </div>
    </div>`).join('');
  return `<div class="match-item">
    <div class="match-item-header">
      <div class="match-result ${m.result}">${m.result.toUpperCase()}</div>
      <span style="font-size:12px;color:var(--text-3)">Rounds: ${m.rounds || '—'}</span>
      <span class="activity-time">${m.createdAt?.toDate ? timeAgo(m.createdAt.toDate()) : ''}</span>
    </div>
    ${m.notes ? `<p style="font-size:12px;color:var(--text-2);margin-bottom:.5rem">${m.notes}</p>` : ''}
    ${playerRows ? `<div class="match-stats-grid">${playerRows}</div>` : ''}
  </div>`;
}

// ===== NEW STRAT MODAL =====
window.openNewStratModal = function () {
  editStratId = null;
  selectedStratOps = [];
  stratSteps = [];
  document.getElementById('strat-modal-title').textContent = 'New Strat';
  document.getElementById('strat-name').value = '';
  document.getElementById('strat-desc').value = '';
  document.getElementById('strat-folder').value = '';
  document.getElementById('strat-map').value = MAP_NAMES[0];
  document.getElementById('strat-side').value = 'defense';
  document.getElementById('strat-difficulty').value = 'intermediate';
  document.getElementById('strat-steps-list').innerHTML = '';
  updateStratSites();
  buildStratOpSelector();
  document.getElementById('strat-modal').style.display = 'flex';
};

window.openNewStratModalFor = function (map, folder, side) {
  openNewStratModal();
  document.getElementById('strat-map').value = map;
  document.getElementById('strat-folder').value = folder;
  document.getElementById('strat-side').value = side;
  updateStratSites();
  buildStratOpSelector();
};

window.openEditStratModal = function (id) {
  const s = allStrats.find(x => x.id === id);
  if (!s) return;
  editStratId = id;
  selectedStratOps = [...(s.operators || [])];
  stratSteps = [...(s.steps || [])];
  document.getElementById('strat-modal-title').textContent = 'Edit Strat';
  document.getElementById('strat-name').value = s.name;
  document.getElementById('strat-desc').value = s.description || '';
  document.getElementById('strat-folder').value = s.folder || '';
  document.getElementById('strat-map').value = s.map;
  document.getElementById('strat-side').value = s.side;
  document.getElementById('strat-difficulty').value = s.difficulty;
  updateStratSites();
  setTimeout(() => { document.getElementById('strat-site').value = s.site; }, 50);
  buildStratOpSelector();
  const list = document.getElementById('strat-steps-list');
  list.innerHTML = '';
  stratSteps.forEach((st, i) => {
    const row = document.createElement('div');
    row.className = 'step-row';
    row.innerHTML = `<div class="step-num">${i+1}</div><input type="text" id="step-${i}" value="${st}">`;
    list.appendChild(row);
  });
  document.getElementById('strat-modal').style.display = 'flex';
};

window.updateStratSites = function () {
  const map = document.getElementById('strat-map')?.value;
  const siteSel = document.getElementById('strat-site');
  if (!siteSel || !map || !MAPS[map]) return;
  siteSel.innerHTML = '';
  MAPS[map].sites.forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    siteSel.appendChild(o);
  });
};

function buildStratOpSelector() {
  const side = document.getElementById('strat-side')?.value || 'defense';
  const ops = side === 'attack' ? ATTACK_OPERATORS : DEFENSE_OPERATORS;
  const grid = document.getElementById('strat-op-grid');
  if (!grid) return;
  grid.innerHTML = '';
  ops.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'op-btn' + (selectedStratOps.includes(op) ? ' selected' : '');
    btn.textContent = op;
    btn.onclick = () => toggleStratOp(op);
    grid.appendChild(btn);
  });
  renderSelectedStratOps();
}

document.addEventListener('change', e => {
  if (e.target.id === 'strat-side') buildStratOpSelector();
});

function toggleStratOp(op) {
  const idx = selectedStratOps.indexOf(op);
  if (idx > -1) { selectedStratOps.splice(idx, 1); }
  else {
    if (selectedStratOps.length >= 5) { showToast('Max 5 operators'); return; }
    selectedStratOps.push(op);
  }
  buildStratOpSelector();
}

function renderSelectedStratOps() {
  const display = document.getElementById('strat-selected-ops');
  if (!display) return;
  display.innerHTML = selectedStratOps.map(op => `
    <div class="op-tag">${op}<button onclick="toggleStratOp('${op}')" aria-label="Remove">×</button></div>
  `).join('');
}

window.addStep = function () {
  const idx = stratSteps.length;
  stratSteps.push('');
  const list = document.getElementById('strat-steps-list');
  const row = document.createElement('div');
  row.className = 'step-row';
  row.innerHTML = `<div class="step-num">${idx + 1}</div><input type="text" id="step-${idx}" placeholder="Step ${idx + 1}...">`;
  list.appendChild(row);
};

window.saveStrat = async function () {
  const name = document.getElementById('strat-name').value.trim();
  if (!name) { showToast('Please enter a strat name', 'error'); return; }
  const steps = stratSteps.map((_, i) => document.getElementById(`step-${i}`)?.value || '').filter(Boolean);
  const data = {
    name,
    map: document.getElementById('strat-map').value,
    site: document.getElementById('strat-site').value,
    side: document.getElementById('strat-side').value,
    difficulty: document.getElementById('strat-difficulty').value,
    folder: document.getElementById('strat-folder').value.trim() || 'General',
    operators: [...selectedStratOps],
    description: document.getElementById('strat-desc').value.trim(),
    steps,
    createdBy: currentUser.displayName || currentUser.email,
    createdById: currentUser.uid,
    updatedAt: serverTimestamp()
  };
  try {
    if (editStratId) {
      await updateDoc(doc(db, 'strats', editStratId), data);
      showToast('Strat updated', 'success');
    } else {
      data.createdAt = serverTimestamp();
      const ref = await addDoc(collection(db, 'strats'), data);
      activeStratId = ref.id;
      await logActivity(`created strat "${name}"`);
      showToast('Strat saved', 'success');
    }
    closeModal('strat-modal');
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
};

window.deleteStrat = async function (id) {
  if (!confirm('Delete this strat? This cannot be undone.')) return;
  await deleteDoc(doc(db, 'strats', id));
  activeStratId = null;
  document.getElementById('strat-detail').innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-3);font-size:13px">Select a strat from the left panel</div>';
  showToast('Strat deleted');
};

// ===== OPERATOR ROLE MODAL =====
window.openOpRoleModal = function (stratId, op) {
  opRoleEditStratId = stratId;
  opRoleEditOp = op;
  const s = allStrats.find(x => x.id === stratId);
  document.getElementById('op-role-modal-title').textContent = op + ' — Role Notes';
  document.getElementById('op-role-op').value = op;
  document.getElementById('op-role-notes').value = s?.opRoles?.[op] || '';
  document.getElementById('op-role-modal').style.display = 'flex';
};

window.saveOpRole = async function () {
  const notes = document.getElementById('op-role-notes').value.trim();
  const s = allStrats.find(x => x.id === opRoleEditStratId);
  if (!s) return;
  const opRoles = { ...(s.opRoles || {}), [opRoleEditOp]: notes };
  await updateDoc(doc(db, 'strats', opRoleEditStratId), { opRoles });
  showToast('Role notes saved', 'success');
  closeModal('op-role-modal');
  renderStratDetail(opRoleEditStratId);
};

// ===== MATCH LOG =====
window.openMatchModal = function (stratId) {
  const s = allStrats.find(x => x.id === stratId);
  if (!s) return;
  document.getElementById('match-modal').dataset.stratId = stratId;
  document.getElementById('match-result').value = 'win';
  document.getElementById('match-rounds').value = '7';
  document.getElementById('match-notes').value = '';
  buildMatchPlayersList();
  document.getElementById('match-modal').style.display = 'flex';
};

function buildMatchPlayersList() {
  const list = document.getElementById('match-players-list');
  if (!list) return;
  if (!allRoster.length) {
    list.innerHTML = '<div class="empty-state">No team members found. Have your team register accounts first.</div>';
    return;
  }
  list.innerHTML = allRoster.map(member => `
    <div style="background:var(--bg-2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:.75rem 1rem;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:.75rem">
        <input type="checkbox" id="player-check-${member.uid}" checked style="accent-color:var(--gold)">
        <label for="player-check-${member.uid}" style="font-size:14px;font-weight:500;color:var(--gold);cursor:pointer">${member.displayName}</label>
      </div>
      <div class="form-row-3" style="gap:8px">
        <div class="form-group" style="margin:0">
          <label>Kills</label>
          <input type="number" id="kills-${member.uid}" min="0" max="20" value="0">
        </div>
        <div class="form-group" style="margin:0">
          <label>Deaths</label>
          <input type="number" id="deaths-${member.uid}" min="0" max="20" value="0">
        </div>
        <div class="form-group" style="margin:0">
          <label>Assists</label>
          <input type="number" id="assists-${member.uid}" min="0" max="20" value="0">
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:.5rem">
        <input type="checkbox" id="kost-${member.uid}" style="accent-color:var(--gold)">
        <label for="kost-${member.uid}" style="font-size:13px;color:var(--text-2);cursor:pointer">KOST — had positive impact this round (K/O/S/T)</label>
      </div>
    </div>
  `).join('');
}

window.saveMatch = async function () {
  const stratId = document.getElementById('match-modal').dataset.stratId;
  const s = allStrats.find(x => x.id === stratId);
  if (!s) return;
  const players = allRoster
    .filter(m => document.getElementById(`player-check-${m.uid}`)?.checked)
    .map(m => ({
      name: m.displayName,
      uid: m.uid,
      kills: parseInt(document.getElementById(`kills-${m.uid}`)?.value || 0),
      deaths: parseInt(document.getElementById(`deaths-${m.uid}`)?.value || 0),
      assists: parseInt(document.getElementById(`assists-${m.uid}`)?.value || 0),
      kost: document.getElementById(`kost-${m.uid}`)?.checked || false
    }));
  const data = {
    stratId,
    stratName: s.name,
    map: s.map,
    site: s.site,
    side: s.side,
    result: document.getElementById('match-result').value,
    rounds: parseInt(document.getElementById('match-rounds').value),
    notes: document.getElementById('match-notes').value.trim(),
    players,
    loggedBy: currentUser.displayName || currentUser.email,
    loggedById: currentUser.uid,
    createdAt: serverTimestamp()
  };
  try {
    await addDoc(collection(db, 'matches'), data);
    await logActivity(`logged a ${data.result} on "${s.name}"`);
    showToast('Match logged', 'success');
    closeModal('match-modal');
    if (activeStratId === stratId) renderStratDetail(stratId);
  } catch (e) { showToast('Error: ' + e.message, 'error'); }
};

// ===== STATS =====
function initStats() {
  const mapSel = document.getElementById('stats-map-filter');
  if (mapSel) {
    mapSel.innerHTML = '<option value="">All maps</option>';
    MAP_NAMES.forEach(m => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      mapSel.appendChild(o);
    });
  }
}

window.renderStats = function () {
  const mapFilter = document.getElementById('stats-map-filter')?.value || '';
  const sideFilter = document.getElementById('stats-side-filter')?.value || '';
  let matches = allMatches;
  if (mapFilter) matches = matches.filter(m => m.map === mapFilter);
  if (sideFilter) matches = matches.filter(m => m.side === sideFilter);

  const container = document.getElementById('stats-content');
  if (!matches.length) {
    container.innerHTML = '<div class="empty-state">No matches logged yet. Log matches on your strats to see stats here.</div>';
    return;
  }

  const wins = matches.filter(m => m.result === 'win').length;
  const overallWR = Math.round((wins / matches.length) * 100);

  // By map
  const byMap = {};
  matches.forEach(m => {
    if (!byMap[m.map]) byMap[m.map] = { wins: 0, total: 0 };
    byMap[m.map].total++;
    if (m.result === 'win') byMap[m.map].wins++;
  });

  // By strat
  const byStrat = {};
  matches.forEach(m => {
    if (!byStrat[m.stratName]) byStrat[m.stratName] = { wins: 0, total: 0, map: m.map };
    byStrat[m.stratName].total++;
    if (m.result === 'win') byStrat[m.stratName].wins++;
  });

  // By player (KOST)
  const byPlayer = {};
  matches.forEach(m => {
    (m.players || []).forEach(p => {
      if (!byPlayer[p.name]) byPlayer[p.name] = { kills: 0, deaths: 0, assists: 0, kost: 0, rounds: 0 };
      byPlayer[p.name].kills += p.kills || 0;
      byPlayer[p.name].deaths += p.deaths || 0;
      byPlayer[p.name].assists += p.assists || 0;
      byPlayer[p.name].rounds++;
      if (p.kost) byPlayer[p.name].kost++;
    });
  });

  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Matches played</div><div class="stat-value">${matches.length}</div></div>
      <div class="stat-card"><div class="stat-label">Wins</div><div class="stat-value green">${wins}</div></div>
      <div class="stat-card"><div class="stat-label">Overall win rate</div><div class="stat-value gold">${overallWR}%</div></div>
      <div class="stat-card"><div class="stat-label">Losses</div><div class="stat-value">${matches.length - wins}</div></div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem;margin-bottom:1.5rem">
      <div class="stats-card">
        <div class="stats-card-title">Win rate by map</div>
        ${Object.entries(byMap).sort((a,b) => (b[1].wins/b[1].total)-(a[1].wins/a[1].total)).map(([map, d]) => {
          const wr = Math.round((d.wins/d.total)*100);
          return `<div class="stats-row">
            <span class="stats-row-label">${map}</span>
            <span class="stats-row-val">${wr}% <span style="color:var(--text-3);font-weight:400">(${d.total})</span></span>
          </div>
          <div class="win-rate-bar"><div class="win-rate-fill" style="width:${wr}%"></div></div>`;
        }).join('')}
      </div>
      <div class="stats-card">
        <div class="stats-card-title">Win rate by strat</div>
        ${Object.entries(byStrat).sort((a,b) => b[1].total-a[1].total).slice(0,10).map(([name, d]) => {
          const wr = Math.round((d.wins/d.total)*100);
          return `<div class="stats-row">
            <span class="stats-row-label" style="font-size:12px">${name}</span>
            <span class="stats-row-val">${wr}% <span style="color:var(--text-3);font-weight:400">(${d.total})</span></span>
          </div>`;
        }).join('')}
      </div>
    </div>

    ${Object.keys(byPlayer).length ? `
    <div class="stats-card">
      <div class="stats-card-title">Player stats</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="border-bottom:1px solid var(--border)">
              <th style="text-align:left;padding:8px 12px;color:var(--text-3);font-weight:600;letter-spacing:.05em">Player</th>
              <th style="text-align:center;padding:8px;color:var(--text-3)">Matches</th>
              <th style="text-align:center;padding:8px;color:var(--text-3)">K</th>
              <th style="text-align:center;padding:8px;color:var(--text-3)">D</th>
              <th style="text-align:center;padding:8px;color:var(--text-3)">A</th>
              <th style="text-align:center;padding:8px;color:var(--text-3)">K/D</th>
              <th style="text-align:center;padding:8px;color:var(--text-3)">KOST%</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(byPlayer).map(([name, p]) => {
              const kd = p.deaths ? (p.kills/p.deaths).toFixed(2) : p.kills.toFixed(2);
              const kostPct = p.rounds ? Math.round((p.kost/p.rounds)*100) : 0;
              return `<tr style="border-bottom:1px solid var(--border)">
                <td style="padding:8px 12px;color:var(--gold);font-weight:500">${name}</td>
                <td style="text-align:center;padding:8px;color:var(--text-2)">${p.rounds}</td>
                <td style="text-align:center;padding:8px;color:var(--success)">${p.kills}</td>
                <td style="text-align:center;padding:8px;color:var(--danger)">${p.deaths}</td>
                <td style="text-align:center;padding:8px;color:var(--text-2)">${p.assists}</td>
                <td style="text-align:center;padding:8px;color:var(--text-1);font-weight:600">${kd}</td>
                <td style="text-align:center;padding:8px;color:${kostPct >= 50 ? 'var(--success)' : 'var(--danger)'};font-weight:600">${kostPct}%</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}
  `;
};

// ===== TEAM HUB =====
function initTeamHub() {
  // Meta map/site selects
  const metaMapSel = document.getElementById('meta-map');
  if (metaMapSel) {
    Object.keys(META).forEach(m => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      metaMapSel.appendChild(o);
    });
  }
  updateMetaSites();
  renderMeta();

  // Map notes select
  const mapNotesSel = document.getElementById('map-notes-select');
  if (mapNotesSel) {
    MAP_NAMES.forEach(m => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      mapNotesSel.appendChild(o);
    });
  }

  // Bans map select
  const bansMapSel = document.getElementById('bans-map-select');
  if (bansMapSel) {
    MAP_NAMES.forEach(m => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      bansMapSel.appendChild(o);
    });
    loadBans();
  }

  loadTeamNotes();
}

window.showHubTab = function (tab) {
  ['meta', 'notes', 'bans'].forEach(t => {
    document.getElementById(`hub-${t}`).style.display = t === tab ? 'block' : 'none';
    const btn = document.getElementById(`hub-tab-${t}`);
    if (btn) btn.style.borderColor = t === tab ? 'var(--gold)' : 'var(--border)';
    if (btn) btn.style.color = t === tab ? 'var(--gold)' : 'var(--text-2)';
  });
  if (tab === 'notes') loadTeamNotes();
  if (tab === 'bans') loadBans();
};

window.updateMetaSites = function () {
  const map = document.getElementById('meta-map')?.value;
  const siteSel = document.getElementById('meta-site');
  if (!siteSel || !map || !META[map]) return;
  siteSel.innerHTML = '';
  Object.keys(META[map]).forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    siteSel.appendChild(o);
  });
};

window.renderMeta = function () {
  const map = document.getElementById('meta-map')?.value;
  const site = document.getElementById('meta-site')?.value;
  updateMetaSites();
  if (!map || !site || !META[map]?.[site]) {
    document.getElementById('meta-content').innerHTML = '<div class="empty-state">No meta data for this site yet.</div>';
    return;
  }
  const d = META[map][site];
  document.getElementById('meta-content').innerHTML = `
    <div style="margin-bottom:1rem"><strong style="color:var(--text-1)">${map} — ${site}</strong> <span style="color:var(--text-3);font-size:12px">Y11S1 pro meta</span></div>
    <div class="section-title">Attack operators</div>
    <div class="meta-ref-grid">${d.atk.map(op => `<div class="meta-op-card"><div class="meta-op-name">${op.name} <span class="badge badge-role" style="font-size:9px">${op.role}</span></div><div class="meta-op-desc">${op.desc}</div></div>`).join('')}</div>
    <div class="section-title" style="margin-top:1rem">Defense operators</div>
    <div class="meta-ref-grid">${d.def.map(op => `<div class="meta-op-card"><div class="meta-op-name">${op.name} <span class="badge badge-role" style="font-size:9px">${op.role}</span></div><div class="meta-op-desc">${op.desc}</div></div>`).join('')}</div>
    <div class="meta-setup">${d.setup}</div>
    <div class="meta-tip"><strong>Pro tip:</strong> ${d.tip}</div>
  `;
};

// ===== NOTES =====
async function loadTeamNotes() {
  try {
    const snap = await getDoc(doc(db, 'team_data', 'notes'));
    if (snap.exists()) document.getElementById('team-notes-area').value = snap.data().text || '';
  } catch (e) {}
}

window.saveTeamNotes = async function () {
  const text = document.getElementById('team-notes-area').value;
  await setDoc(doc(db, 'team_data', 'notes'), { text, updatedBy: currentUser.displayName, updatedAt: serverTimestamp() });
  showToast('Notes saved', 'success');
};

window.loadMapNotes = async function () {
  const map = document.getElementById('map-notes-select')?.value;
  if (!map) return;
  try {
    const snap = await getDoc(doc(db, 'map_notes', map));
    document.getElementById('map-notes-area').value = snap.exists() ? snap.data().text || '' : '';
  } catch (e) {}
};

window.saveMapNotes = async function () {
  const map = document.getElementById('map-notes-select')?.value;
  const text = document.getElementById('map-notes-area').value;
  await setDoc(doc(db, 'map_notes', map), { text, updatedBy: currentUser.displayName, updatedAt: serverTimestamp() });
  showToast('Map notes saved', 'success');
};

// ===== BANS =====
window.loadBans = async function () {
  const map = document.getElementById('bans-map-select')?.value;
  if (!map) return;
  try {
    const snap = await getDoc(doc(db, 'bans', map));
    currentBans = snap.exists() ? { atk: snap.data().atk || [], def: snap.data().def || [] } : { atk: [], def: [] };
  } catch (e) { currentBans = { atk: [], def: [] }; }
  renderBanLists();
};

function renderBanLists() {
  ['atk', 'def'].forEach(side => {
    const list = document.getElementById(`${side}-ban-list`);
    if (!list) return;
    list.innerHTML = currentBans[side].map(op => `
      <div class="ban-chip">${op}<button onclick="removeBan('${side}','${op}')">×</button></div>
    `).join('') || `<span style="color:var(--text-3);font-size:13px">None set</span>`;
  });
}

window.addBan = function (side) {
  const sel = document.getElementById(`${side}-ban-select`);
  const op = sel?.value;
  if (!op) return;
  if (!currentBans[side].includes(op)) {
    currentBans[side].push(op);
    renderBanLists();
  }
};

window.removeBan = function (side, op) {
  currentBans[side] = currentBans[side].filter(x => x !== op);
  renderBanLists();
};

window.saveBans = async function () {
  const map = document.getElementById('bans-map-select')?.value;
  if (!map) return;
  await setDoc(doc(db, 'bans', map), { ...currentBans, updatedBy: currentUser.displayName, updatedAt: serverTimestamp() });
  showToast('Bans saved', 'success');
};

// ===== DASHBOARD =====
function renderDashboard() {
  const wins = allMatches.filter(m => m.result === 'win').length;
  const wr = allMatches.length ? Math.round((wins / allMatches.length) * 100) + '%' : '—';
  document.getElementById('dash-strat-count').textContent = allStrats.length || '—';
  document.getElementById('dash-match-count').textContent = allMatches.length || '—';
  document.getElementById('dash-winrate').textContent = wr;
  document.getElementById('dash-members').textContent = allRoster.length || '—';
  loadDashActivity();
}

async function loadDashActivity() {
  try {
    const q = query(collection(db, 'activity'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const feed = document.getElementById('dash-activity');
    const items = snap.docs.slice(0, 8);
    if (!items.length) { feed.innerHTML = '<div class="empty-state">No activity yet.</div>'; return; }
    feed.innerHTML = items.map(d => {
      const a = d.data();
      return `<div class="activity-item">
        <span class="activity-user">${a.user}</span>
        <span>${a.action}</span>
        <span class="activity-time">${a.createdAt?.toDate ? timeAgo(a.createdAt.toDate()) : ''}</span>
      </div>`;
    }).join('');
  } catch (e) {}
}

// ===== ROSTER =====
async function loadRoster() {
  try {
    const snap = await getDocs(collection(db, 'users'));
    allRoster = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
    document.getElementById('dash-members').textContent = allRoster.length || '—';
    renderRoster();
  } catch (e) {}
}

function renderRoster() {
  const list = document.getElementById('roster-list');
  if (!list) return;
  if (!allRoster.length) { list.innerHTML = '<div class="empty-state">No members yet.</div>'; return; }
  list.innerHTML = allRoster.map(m => `
    <div class="roster-item">
      <div class="user-avatar sm">${m.displayName?.slice(0,2).toUpperCase() || '?'}</div>
      <div class="roster-item-name">${m.displayName}</div>
      <div class="roster-item-email">${m.email}</div>
    </div>
  `).join('');
}

// ===== PROFILE =====
window.saveProfile = async function () {
  const name = document.getElementById('profile-name').value.trim();
  if (!name) return;
  await updateProfile(currentUser, { displayName: name });
  await updateDoc(doc(db, 'users', currentUser.uid), { displayName: name });
  document.getElementById('user-name').textContent = name;
  document.getElementById('user-avatar').textContent = name.slice(0,2).toUpperCase();
  showToast('Profile saved', 'success');
};

// ===== ACTIVITY =====
async function logActivity(action) {
  try {
    await addDoc(collection(db, 'activity'), {
      user: currentUser.displayName || currentUser.email,
      action,
      createdAt: serverTimestamp()
    });
  } catch (e) {}
}

// ===== MODALS =====
window.closeModal = function (id) {
  document.getElementById(id).style.display = 'none';
};

// ===== TOAST =====
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (type ? ' ' + type : '') + ' show';
  setTimeout(() => t.classList.remove('show'), 2800);
}
window.showToast = showToast;

// ===== UTILS =====
function timeAgo(date) {
  const s = Math.floor((new Date() - date) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  return Math.floor(s/86400) + 'd ago';
}
