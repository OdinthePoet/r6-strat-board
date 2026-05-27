import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ===== META DATA =====
const META = {
  "Clubhouse": {
    siegegg: "https://www.siegegg.com/maps/clubhouse",
    sites: {
      "Bar / Stage": {
        atk: [
          { name: "Ash", role: "Entry fragger", desc: "Opens soft walls around Bar with CREM launcher, dictates pace of the push from Gym side." },
          { name: "Ace", role: "Hard breacher", desc: "SELMA charges on Bar reinforced wall and Stage double. Core of every execute." },
          { name: "Thatcher", role: "Support", desc: "EMPs destroy Bandit charges and Kaid claws on Bar wall. Never run Ace without him." },
          { name: "Buck", role: "Soft breacher", desc: "Skeleton Key opens vertical plays from Church roof down into Bar — essential on this site." },
          { name: "Nomad", role: "Flank watch", desc: "Airjabs seal Bike/Church flank routes post-execute. Protects the plant." }
        ],
        def: [
          { name: "Bandit", role: "Wall denial", desc: "Shock wires on Bar reinforced wall. Forces attackers to burn Thatcher utility before breaching." },
          { name: "Mira", role: "Anchor", desc: "Black Mirror in Bar facing Gym entrance — controls the primary push corridor." },
          { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Bar plant spots during final 30 seconds." },
          { name: "Jäger", role: "Utility denial", desc: "ADS catches grenades in tight Bar corridor. Strong fragger for early roam." },
          { name: "Lesion", role: "Intel", desc: "Gu needles in Stage corners slow attacker movement and reveal positions." }
        ],
        setup: "Reinforce Bar back wall and Stage left wall. Mira goes Bar facing Gym. Bandit shocks the two primary breach walls. Lesion seeds needles in Stage before roaming briefly. Smoke holds spawn kill angles from Bedroom balcony early, returns for plant denial. Jäger takes Bike Hall early, trades or returns.",
        tip: "Bar/Stage is one of the most reinforcement-hungry sites in the pool. Prioritize the two reinforced breach walls before anything else."
      },
      "Gym / CCTV": {
        atk: [
          { name: "Thermite", role: "Hard breacher", desc: "Exothermic charge on CCTV wall — more reliable than Ace when wall denial is expected." },
          { name: "Thatcher", role: "Support", desc: "EMPs through CCTV window and Gym exterior neutralize Bandit/Kaid before breach." },
          { name: "Sledge", role: "Soft breacher", desc: "Opens Gym ceiling for vertical play down into CCTV. Reliable, no gadget dependency." },
          { name: "Nomad", role: "Flank watch", desc: "Airjabs on Bike Hall and Church flank routes secure post-plant." },
          { name: "Ash", role: "Entry fragger", desc: "Clears utility from Gym windows before the push. Fast enough to contest early rotations." }
        ],
        def: [
          { name: "Kaid", role: "Wall denial", desc: "Rtila claws on CCTV reinforced wall — works where Bandit can't place shock wires." },
          { name: "Valkyrie", role: "Intel", desc: "Black Eye cameras in Gym exterior and Bike Hall give full picture of attacker positions." },
          { name: "Smoke", role: "Plant denial", desc: "Holds plant spot in CCTV room. Gas canisters reach both default plant and sneaky plant." },
          { name: "Echo", role: "Plant denial", desc: "Yokai drone disrupts Gym pushes and reveals positions mid-execute." },
          { name: "Jäger", role: "Roamer", desc: "Aggressive early roam in Armoury and Church to bleed attacker time." }
        ],
        setup: "Reinforce CCTV main wall and Gym side wall. Kaid claws the CCTV wall. Valkyrie places cameras in Gym exterior. Echo parks Yokai above CCTV plant. Smoke holds piano room or upper CCTV. One roamer (Jäger) works Church/Armoury early.",
        tip: "Gym/CCTV is defender-sided when anchors hold position. Avoid over-roaming — stay to contest the Gym push early."
      }
    }
  },
  "Consulate": {
    siegegg: "https://www.siegegg.com/maps/consulate",
    sites: {
      "Consul / Lobby": {
        atk: [
          { name: "Buck", role: "Soft breacher", desc: "Essential on Consulate. Opens Consul floor from above and soft walls for alternate entries." },
          { name: "Maverick", role: "Anti-wall denial", desc: "Blowtorch burns through reinforced walls without triggering Bandit/Kaid — nearly essential here." },
          { name: "Ash", role: "Entry fragger", desc: "Clears Lobby utility from distance. Fast enough for the aggressive Lobby angle." },
          { name: "Nomad", role: "Flank watch", desc: "Airjabs seal Tellers and Basement flank routes after the push commits." },
          { name: "Thatcher", role: "Support", desc: "EMPs on Lobby reinforced walls to enable Thermite or support Maverick." }
        ],
        def: [
          { name: "Mira", role: "Anchor", desc: "Black Mirror in Consul facing Lobby — one of the best Mira spots in the game." },
          { name: "Bandit", role: "Wall denial", desc: "Shocks Consul reinforced walls. Forces Maverick or Thatcher + Thermite chain." },
          { name: "Smoke", role: "Plant denial", desc: "Covers both plant spots in Lobby from above with gas canisters." },
          { name: "Lesion", role: "Intel", desc: "Gu needles in Tellers hallway slow and reveal flanking attackers." },
          { name: "Vigil", role: "Roamer", desc: "Drone immunity makes early Consulate roam very strong — denies attacker intel phase." }
        ],
        setup: "Reinforce Consul main wall and Lobby window wall. Mira goes Consul facing Lobby. Bandit shocks both. Smoke holds above Lobby or in Consul. Lesion seeds Tellers. Vigil roams Basement/Garage hard early, retreats when drones are burned.",
        tip: "Post-rework Consulate strongly favors a CQB anchor-heavy defense. Don't over-roam — the map punishes lone defenders getting caught in corridors."
      },
      "Visa / Archives": {
        atk: [
          { name: "Thermite", role: "Hard breacher", desc: "Opens Archives reinforced wall for the primary execute from Parking." },
          { name: "Thatcher", role: "Support", desc: "EMPs through Archives window before Thermite charges." },
          { name: "Buck", role: "Vertical", desc: "Opens Visa floor from Visa Offices above for a hard vertical angle." },
          { name: "Iana", role: "Intel", desc: "Gemini clone scouts Archives layout safely before committing the team." },
          { name: "Zofia", role: "Flex", desc: "Concussion grenades and impact grenades give flexibility on both entry and plant." }
        ],
        def: [
          { name: "Kaid", role: "Wall denial", desc: "Claws on Archives reinforced wall when Bandit can't cover it." },
          { name: "Azami", role: "Site reshaping", desc: "Kiba barriers reshape Archives doorways to create unexpected angles." },
          { name: "Echo", role: "Plant denial", desc: "Yokai covers Visa plant spot. Strong in the confined Archives layout." },
          { name: "Valkyrie", role: "Intel", desc: "Black Eye camera in Parking gives full attacker approach view." },
          { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Visa default plant during final push." }
        ],
        setup: "Reinforce Archives main and Parking side wall. Kaid claws Archives. Azami reshapes two doorways into Archives. Valkyrie cam in Parking. Echo Yokai above Visa plant. Smoke holds Visa or roams Garage briefly.",
        tip: "Visa/Archives rewards patient defense. Let attackers burn utility on Parking, then contest the Archives breach from Visa angles."
      }
    }
  },
  "Bank": {
    siegegg: "https://www.siegegg.com/maps/bank",
    sites: {
      "Vault / Lockers": {
        atk: [
          { name: "Ace", role: "Hard breacher", desc: "SELMA on Vault main reinforced wall — the standard breach point for this site." },
          { name: "Thatcher", role: "Support", desc: "EMPs neutralize Vault wall denial before Ace charges. Critical pairing." },
          { name: "Hibana", role: "Alt breacher", desc: "X-KAIROS pellets on Vault wall — useful if Ace is banned or wall denial is heavy." },
          { name: "Sledge", role: "Soft breacher", desc: "Opens Lockers ceiling from Office above for vertical pressure." },
          { name: "Nomad", role: "Flank watch", desc: "Airjabs on Server Room flank route protect the plant." }
        ],
        def: [
          { name: "Kaid", role: "Wall denial", desc: "Claws on Vault primary wall. Core wall denial anchor." },
          { name: "Bandit", role: "Wall denial", desc: "Shocks Vault secondary walls. Pairs with Kaid for double denial." },
          { name: "Mira", role: "Anchor", desc: "Black Mirror in Vault facing Lobby — one of the strongest Mira positions in competitive play." },
          { name: "Smoke", role: "Plant denial", desc: "Covers Vault and Lockers plant spots. Standard anchor pairing with Mira." },
          { name: "Jäger", role: "Roamer", desc: "ADS in Lockers absorbs grenades. Early roam through Archives then returns." }
        ],
        setup: "Reinforce Vault main and Lockers back wall. Kaid and Bandit stack wall denial. Mira Vault facing Lobby. Smoke holds Lockers or above Vault. Jäger takes Archives early, trades, returns to site.",
        tip: "Vault/Lockers is a fortress site when wall denial is maintained. If both Ace and Thatcher are banned, Bank becomes extremely defender-sided."
      },
      "CEO / Tellers": {
        atk: [
          { name: "Thermite", role: "Hard breacher", desc: "CEO reinforced wall from Main Lobby side. Standard breach on this site." },
          { name: "Thatcher", role: "Support", desc: "EMPs CEO wall gadgets before Thermite charges." },
          { name: "Ash", role: "Entry fragger", desc: "Clears Teller window utility from outside before entry." },
          { name: "Lion", role: "Intel", desc: "EE-ONE-D scan reveals defender positions during roam-clear phase." },
          { name: "Nomad", role: "Flank watch", desc: "Airjabs secure CEO flank from Basement stairs post-plant." }
        ],
        def: [
          { name: "Bandit", role: "Wall denial", desc: "Shock wires on CEO main reinforced wall." },
          { name: "Azami", role: "Site reshaping", desc: "Kiba barriers in Tellers doorways create unexpected defender angles." },
          { name: "Valkyrie", role: "Intel", desc: "Black Eyes in Lobby and Exterior provide attacker approach intel." },
          { name: "Smoke", role: "Plant denial", desc: "Covers CEO plant spot from above." },
          { name: "Echo", role: "Plant denial", desc: "Yokai disrupts plant attempts in CEO room." }
        ],
        setup: "Reinforce CEO main and side wall. Bandit shocks CEO wall. Azami reshapes Tellers doorways. Valkyrie drops cameras in Lobby. Echo parks Yokai above CEO plant. Smoke holds upper CEO or Tellers.",
        tip: "CEO/Tellers is a flexible site with multiple entry points. Prioritize intel (Valkyrie + Echo) so anchors know where to hold before attackers commit."
      }
    }
  },
  "Chalet": {
    siegegg: "https://www.siegegg.com/maps/chalet",
    sites: {
      "Garage / Snowmobile": {
        atk: [
          { name: "Ace", role: "Hard breacher", desc: "SELMA on Garage double reinforced wall — the primary execute point." },
          { name: "Thatcher", role: "Support", desc: "EMPs Garage double wall before Ace charges. Essential pairing." },
          { name: "Gridlock", role: "Area denial", desc: "Trax stingers block Garage run-outs and force defenders into site." },
          { name: "Ash", role: "Entry fragger", desc: "Clears Garage window utility from Bear's Den or Snowmobile side." },
          { name: "Nomad", role: "Flank watch", desc: "Airjabs on Kitchen and Trophy Room flank routes protect post-plant." }
        ],
        def: [
          { name: "Bandit", role: "Wall denial", desc: "Shocks Garage double wall — the single most important piece of utility on this site." },
          { name: "Kaid", role: "Wall denial", desc: "Backup claws on Garage wall when Bandit can't cover both panels." },
          { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Snowmobile plant spot." },
          { name: "Mira", role: "Anchor", desc: "Black Mirror in Garage facing Snowmobile — classic control anchor." },
          { name: "Jäger", role: "Roamer", desc: "ADS in Garage absorbs grenades. Roams Ski Room early." }
        ],
        setup: "Reinforce Garage double wall (both panels). Bandit shocks both, Kaid as backup claw. Mira goes Garage facing Snowmobile. Smoke holds Kitchen or Bear's Den. Jäger roams Ski Room, returns.",
        tip: "Garage double wall is the spine of this defense. If both breach panels fall without burning Thatcher + Ace, rotate immediately."
      },
      "Wine / Trophy": {
        atk: [
          { name: "Thermite", role: "Hard breacher", desc: "Opens Wine reinforced wall from Library side." },
          { name: "Thatcher", role: "Support", desc: "EMPs Wine wall gadgets before Thermite." },
          { name: "Buck", role: "Vertical", desc: "Opens Trophy ceiling from Master Bedroom above for hard vertical play." },
          { name: "Zofia", role: "Flex", desc: "Concussion grenades force defenders off Wine angles during entry." },
          { name: "Ash", role: "Entry fragger", desc: "Leads through Library window after wall opens." }
        ],
        def: [
          { name: "Mira", role: "Anchor", desc: "Black Mirror in Wine facing Library — standard control anchor." },
          { name: "Smoke", role: "Plant denial", desc: "Covers Trophy plant from above or Wine default." },
          { name: "Bandit", role: "Wall denial", desc: "Shocks Wine reinforced wall to force Maverick or Thatcher + Thermite chain." },
          { name: "Azami", role: "Site reshaping", desc: "Kiba barriers reshape Trophy doorways to deny attacker entry angles." },
          { name: "Lesion", role: "Intel", desc: "Gu needles in Library hallway slow and reveal attackers." }
        ],
        setup: "Reinforce Wine main and Trophy back wall. Bandit shocks Wine. Mira goes Wine facing Library. Azami reshapes Trophy doorways. Smoke holds above Trophy or in Wine. Lesion seeds Library before briefly roaming.",
        tip: "Wine/Trophy has the least natural cover of Chalet's sites. Mira and Azami together create the structure the site lacks by default."
      }
    }
  },
  "Oregon": {
    siegegg: "https://www.siegegg.com/maps/oregon",
    sites: {
      "Kitchen / Dining": {
        atk: [
          { name: "Ace", role: "Hard breacher", desc: "SELMA on Kitchen reinforced wall from Laundry side." },
          { name: "Thatcher", role: "Support", desc: "EMPs Kitchen wall denial before Ace charges." },
          { name: "Ash", role: "Entry fragger", desc: "Leads entry through Dining window after breach — fastest tempo operator for this site." },
          { name: "Nomad", role: "Flank watch", desc: "Airjabs on Dorms and Tower flank routes — Oregon has aggressive roamers." },
          { name: "Buck", role: "Vertical", desc: "Opens Dining ceiling from Dorms 2F for vertical pressure on anchors." }
        ],
        def: [
          { name: "Mira", role: "Anchor", desc: "Black Mirror in Kitchen facing Laundry — one of the highest-value Mira positions on Oregon." },
          { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Kitchen plant from Dining or Laundry." },
          { name: "Bandit", role: "Wall denial", desc: "Shocks Kitchen primary reinforced wall." },
          { name: "Nomad", role: "Roam / path denial", desc: "Airjabs on Tower and Dorms routes punish attacker movement during drone phase." },
          { name: "Lesion", role: "Intel", desc: "Gu needles in Laundry and Tower stairs reveal roam timings." }
        ],
        setup: "Reinforce Kitchen main wall and Dining back wall. Bandit shocks Kitchen. Mira goes Kitchen facing Laundry. Smoke holds Dining or Upper Kitchen. Nomad places Airjabs on Tower stairs and Dorm hallway. Lesion seeds Laundry before roaming Tower briefly.",
        tip: "Oregon's flank routes are some of the most aggressive in the pool. Anti-flank utility (Nomad, Lesion) is as important as wall denial on this map."
      },
      "Basement / Supply": {
        atk: [
          { name: "Thermite", role: "Hard breacher", desc: "Supply reinforced wall from Garage side — tight breach point but reliable." },
          { name: "Thatcher", role: "Support", desc: "EMPs Basement wall denial before Thermite." },
          { name: "Sledge", role: "Vertical", desc: "Opens Basement ceiling from Kitchen above for the hardest vertical angle on this site." },
          { name: "Iana", role: "Intel", desc: "Gemini clone scouts Basement layout safely — essential given how closed-off Basement is." },
          { name: "Zofia", role: "Flex", desc: "Concussion grenades force defenders off tight Basement angles during entry." }
        ],
        def: [
          { name: "Kaid", role: "Wall denial", desc: "Claws on Basement Supply reinforced wall — Bandit has difficulty wiring in tight Basement." },
          { name: "Echo", role: "Plant denial", desc: "Yokai covers Supply plant spot and disrupts Basement pushes." },
          { name: "Smoke", role: "Plant denial", desc: "Remote canisters reach Basement plant from Tower stairs." },
          { name: "Azami", role: "Site reshaping", desc: "Kiba barriers in Basement doorways create cover where none exists naturally." },
          { name: "Valkyrie", role: "Intel", desc: "Black Eyes in Garage and Laundry give full approach picture." }
        ],
        setup: "Reinforce Supply main wall and Basement back. Kaid claws Supply wall. Azami reshapes two doorways in Basement. Valkyrie drops cams in Garage. Echo Yokai above Supply plant. Smoke holds Tower stairs or Basement ceiling position.",
        tip: "Basement is naturally enclosed but easy to vertical — always protect the ceiling above Supply. Sledge or Buck from Kitchen is the number one threat on this site."
      }
    }
  },
  "Coastline": {
    siegegg: "https://www.siegegg.com/maps/coastline",
    sites: {
      "Hookah / Service": {
        atk: [
          { name: "Ace", role: "Hard breacher", desc: "SELMA on Hookah reinforced wall from Blue Bar side." },
          { name: "Thatcher", role: "Support", desc: "EMPs Hookah wall denial before Ace charges." },
          { name: "Osa", role: "Entry support", desc: "Talon-8 shields placed in Service entrance and Hookah window lock attacker angles." },
          { name: "Ash", role: "Entry fragger", desc: "Clears Hookah window utility from Blue Bar balcony before push." },
          { name: "Nomad", role: "Flank watch", desc: "Airjabs on Penthouse and Kitchen flank routes — Coastline roamers are aggressive." }
        ],
        def: [
          { name: "Solis", role: "Intel denial", desc: "SPEC-IO scanner removes attacker drones — essential on Coastline where drone phase is key." },
          { name: "Mira", role: "Anchor", desc: "Black Mirror in Hookah facing Service — standard Coastline anchor position." },
          { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Service plant spot during final 30 seconds." },
          { name: "Jäger", role: "Roamer", desc: "ADS absorbs grenades in Hookah. Roams Penthouse early." },
          { name: "Oryx", role: "Roamer", desc: "Hatch mobility on Coastline is excellent — punches between floors freely." }
        ],
        setup: "Reinforce Hookah main wall and Service back wall. Mira goes Hookah facing Service. Solis stays site and scans during drone phase. Smoke holds Kitchen or above Hookah. Jäger roams Penthouse early, Oryx works Blue Bar exterior to Penthouse.",
        tip: "Coastline rewards intel-heavy defense. Solis is especially strong here — attacker drones define how executes are built. Deny them early."
      },
      "VIP / Sunrise": {
        atk: [
          { name: "Thermite", role: "Hard breacher", desc: "VIP reinforced wall from Penthouse side." },
          { name: "Thatcher", role: "Support", desc: "EMPs VIP wall denial before Thermite." },
          { name: "Osa", role: "Entry support", desc: "Shields placed on VIP Balcony and Sunrise window create strong push angles." },
          { name: "Ying", role: "Entry fragger", desc: "Candela charges clear VIP room and force defenders off angles during rush." },
          { name: "Ash", role: "Entry fragger", desc: "Leads through Sunrise window after wall opens — fast tempo." }
        ],
        def: [
          { name: "Bandit", role: "Wall denial", desc: "Shocks VIP primary reinforced wall — core of this defense." },
          { name: "Azami", role: "Site reshaping", desc: "Kiba barriers reshape VIP doorways and Sunrise window for unconventional hold angles." },
          { name: "Echo", role: "Plant denial", desc: "Yokai covers VIP plant spot and disrupts Ying rushes." },
          { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Sunrise plant from Penthouse position." },
          { name: "Valkyrie", role: "Intel", desc: "Black Eye cameras in Penthouse and Blue Bar exterior give full approach picture." }
        ],
        setup: "Reinforce VIP main and Sunrise back wall. Bandit shocks VIP. Azami reshapes VIP doorways. Valkyrie drops cams in Penthouse and exterior. Echo Yokai above VIP plant. Smoke holds above Sunrise or in Penthouse.",
        tip: "VIP/Sunrise is one of the most attacker-sided sites in the pool. Wall denial (Bandit) and plant denial (Smoke + Echo) are non-negotiable."
      }
    }
  }
};

const MAPS = Object.keys(META);
const ALL_OPERATORS = [
  "Ace","Ash","Azami","Bandit","Blackbeard","Blitz","Brava","Buck","Capitão",
  "Caveira","Clash","Deimos","Doc","Dokkaebi","Echo","Ela","Fenrir","Finka",
  "Flores","Frost","Fuze","Glaz","Gridlock","Grim","Hibana","Iana","IQ",
  "Jackal","Jäger","Kaid","Kapkan","Lesion","Lion","Maestro","Maverick",
  "Melusi","Mira","Montagne","Mozzie","Mute","Nøkk","Nomad","Oryx","Osa",
  "Pulse","Ram","Rook","Sens","Sledge","Smoke","Solis","Solid Snake","Thorn",
  "Thatcher","Thermite","Twitch","Valkyrie","Vigil","Wamai","Ying","Zero","Zofia"
];

// ===== STATE =====
let currentUser = null;
let allStrats = [];
let allComps = [];
let selectedOps = [];
let compSelectedOps = [];
let stratSteps = [];
let editStratId = null;
let activeMap = MAPS[0];
let activeSite = Object.keys(META[MAPS[0]].sites)[0];
let activeMapPlanner = null;
let unsubStrats = null;
let unsubComps = null;

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
  const initials = name.slice(0,2).toUpperCase();
  document.getElementById('user-avatar').textContent = initials;
  document.getElementById('mobile-avatar').textContent = initials;
}

window.handleLogin = async function() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch(e) {
    errEl.textContent = friendlyAuthError(e.code);
  }
};

window.handleRegister = async function() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value;
  const errEl = document.getElementById('reg-error');
  errEl.textContent = '';
  if (!name) { errEl.textContent = 'Please enter a display name.'; return; }
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    await setDoc(doc(db, 'users', cred.user.uid), {
      displayName: name, email, joinedAt: serverTimestamp()
    });
  } catch(e) {
    errEl.textContent = friendlyAuthError(e.code);
  }
};

window.handleLogout = async function() {
  if (unsubStrats) unsubStrats();
  if (unsubComps) unsubComps();
  await signOut(auth);
};

window.switchTab = function(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.auth-tab').forEach((t, i) => {
    if ((i === 0 && tab === 'login') || (i === 1 && tab === 'register')) t.classList.add('active');
  });
};

function friendlyAuthError(code) {
  const map = {
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'That email is already registered.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/invalid-credential': 'Incorrect email or password.'
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// ===== APP INIT =====
function initApp() {
  populateMapSelects();
  initReference();
  initStratBuilder();
  initTeamComp();
  initMapPlanner();
  subscribeStrats();
  subscribeComps();
  loadMemberCount();
}

function populateMapSelects() {
  ['strat-map','comp-map'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '';
    MAPS.forEach(m => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      el.appendChild(o);
    });
  });
  ['sb-map-filter','tc-map-filter'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    MAPS.forEach(m => {
      const o = document.createElement('option');
      o.value = m; o.textContent = m;
      el.appendChild(o);
    });
  });
}

// ===== NAVIGATION =====
window.showPage = function(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`[data-page="${page}"]`).classList.add('active');
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
};
window.toggleSidebar = function() {
  document.getElementById('sidebar').classList.toggle('open');
};

// ===== REFERENCE =====
function initReference() {
  const mapSel = document.getElementById('ref-map');
  const siteSel = document.getElementById('ref-site');
  const pills = document.getElementById('ref-map-pills');
  MAPS.forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = m;
    mapSel.appendChild(o);
    const pill = document.createElement('button');
    pill.className = 'map-pill' + (m === activeMap ? ' active' : '');
    pill.textContent = m;
    pill.onclick = () => {
      activeMap = m;
      activeSite = Object.keys(META[m].sites)[0];
      mapSel.value = m;
      updateRefSites();
      updateRefPills();
      renderReference();
    };
    pills.appendChild(pill);
  });
  updateRefSites();
  renderReference();
}

function updateRefSites() {
  const siteSel = document.getElementById('ref-site');
  siteSel.innerHTML = '';
  Object.keys(META[activeMap].sites).forEach(s => {
    const o = document.createElement('option');
    o.value = s; o.textContent = s;
    siteSel.appendChild(o);
  });
  siteSel.value = activeSite;
}

function updateRefPills() {
  document.querySelectorAll('#ref-map-pills .map-pill').forEach((p, i) => {
    p.classList.toggle('active', MAPS[i] === activeMap);
  });
}

window.renderReference = function() {
  activeMap = document.getElementById('ref-map').value;
  activeSite = document.getElementById('ref-site').value;
  updateRefPills();
  const site = META[activeMap].sites[activeSite];
  const html = `
    <div class="ref-site-header">${activeMap} — ${activeSite}</div>
    <div class="ref-site-sub">Pro meta operator picks and setup notes · Y11S1</div>
    <div class="ref-section-label">Attack operators</div>
    <div class="op-grid">${site.atk.map(o => opCardHTML(o, 'atk')).join('')}</div>
    <hr class="ref-divider">
    <div class="ref-section-label">Defense operators</div>
    <div class="op-grid">${site.def.map(o => opCardHTML(o, 'def')).join('')}</div>
    <hr class="ref-divider">
    <div class="ref-section-label">Setup notes</div>
    <div class="setup-card"><p>${site.setup}</p></div>
    <div class="tip-card"><strong>Pro tip:</strong> ${site.tip}</div>
  `;
  document.getElementById('ref-content').innerHTML = html;
};

function opCardHTML(op, side) {
  return `<div class="op-card">
    <div class="op-card-name">${op.name}</div>
    <div class="op-card-badges">
      <span class="badge badge-${side}">${side === 'atk' ? 'Attack' : 'Defense'}</span>
      <span class="badge badge-role">${op.role}</span>
    </div>
    <div class="op-card-desc">${op.desc}</div>
  </div>`;
}

// ===== STRAT BUILDER =====
function initStratBuilder() {
  buildOpSelector('op-selector', selectedOps, 'selected-ops', 5);
  updateStratSitesInternal();
}

window.updateStratSites = function() {
  updateStratSitesInternal();
};
function updateStratSitesInternal() {
  const map = document.getElementById('strat-map').value;
  const siteSel = document.getElementById('strat-site');
  siteSel.innerHTML = '';
  if (META[map]) {
    Object.keys(META[map].sites).forEach(s => {
      const o = document.createElement('option');
      o.value = s; o.textContent = s;
      siteSel.appendChild(o);
    });
  }
}

window.openNewStratModal = function() {
  editStratId = null;
  selectedOps = [];
  stratSteps = [];
  document.getElementById('strat-modal-title').textContent = 'New Strat';
  document.getElementById('strat-name').value = '';
  document.getElementById('strat-desc').value = '';
  document.getElementById('strat-map').value = MAPS[0];
  updateStratSitesInternal();
  document.getElementById('strat-side').value = 'attack';
  document.getElementById('strat-difficulty').value = 'intermediate';
  document.getElementById('strat-steps-list').innerHTML = '';
  buildOpSelector('op-selector', selectedOps, 'selected-ops', 5);
  document.getElementById('strat-modal').style.display = 'flex';
};

window.saveStrat = async function() {
  const name = document.getElementById('strat-name').value.trim();
  if (!name) { showToast('Please enter a strat name', 'error'); return; }
  const data = {
    name,
    map: document.getElementById('strat-map').value,
    site: document.getElementById('strat-site').value,
    side: document.getElementById('strat-side').value,
    difficulty: document.getElementById('strat-difficulty').value,
    operators: [...selectedOps],
    description: document.getElementById('strat-desc').value.trim(),
    steps: stratSteps.map((_, i) => document.getElementById('step-' + i)?.value || '').filter(Boolean),
    createdBy: currentUser.displayName || currentUser.email,
    createdById: currentUser.uid,
    createdAt: serverTimestamp()
  };
  try {
    if (editStratId) {
      await updateDoc(doc(db, 'strats', editStratId), data);
      showToast('Strat updated', 'success');
    } else {
      await addDoc(collection(db, 'strats'), data);
      await logActivity(`created strat "${name}"`);
      showToast('Strat saved', 'success');
    }
    closeModal('strat-modal');
  } catch(e) {
    showToast('Failed to save: ' + e.message, 'error');
  }
};

window.addStep = function() {
  const idx = stratSteps.length;
  stratSteps.push('');
  const list = document.getElementById('strat-steps-list');
  const row = document.createElement('div');
  row.className = 'step-row';
  row.innerHTML = `<div class="step-num">${idx + 1}</div><input type="text" id="step-${idx}" placeholder="Step ${idx + 1}...">`;
  list.appendChild(row);
};

function subscribeStrats() {
  const q = query(collection(db, 'strats'), orderBy('createdAt', 'desc'));
  unsubStrats = onSnapshot(q, snap => {
    allStrats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderStratCards();
    renderRecentStrats();
    document.getElementById('strat-count').textContent = allStrats.length;
  });
}

function renderStratCards() {
  const mapFilter = document.getElementById('sb-map-filter')?.value || '';
  const sideFilter = document.getElementById('sb-side-filter')?.value || '';
  let strats = allStrats;
  if (mapFilter) strats = strats.filter(s => s.map === mapFilter);
  if (sideFilter) strats = strats.filter(s => s.side === sideFilter);
  const container = document.getElementById('strat-list-container');
  if (!strats.length) {
    container.innerHTML = '<div class="empty-state">No strats yet. Click "+ New Strat" to create one.</div>';
    return;
  }
  container.innerHTML = strats.map(s => stratCardHTML(s)).join('');
}

function stratCardHTML(s) {
  const sideColor = s.side === 'attack' ? 'atk' : 'def';
  const ops = (s.operators || []).map(o => `<span class="op-chip">${o}</span>`).join('');
  const isOwner = s.createdById === currentUser?.uid;
  return `<div class="strat-card">
    <div class="strat-card-header">
      <div class="strat-card-name">${s.name}</div>
    </div>
    <div class="strat-card-meta">
      <span class="badge badge-${sideColor}">${s.side}</span>
      <span class="badge badge-role">${s.map}</span>
      <span class="badge badge-role">${s.site || ''}</span>
      <span class="badge badge-difficulty-${s.difficulty}">${s.difficulty}</span>
    </div>
    ${ops ? `<div class="strat-card-ops">${ops}</div>` : ''}
    ${s.description ? `<div class="strat-card-desc">${s.description}</div>` : ''}
    <div class="strat-card-footer">
      <span class="strat-card-author">by ${s.createdBy || 'Unknown'}</span>
      ${isOwner ? `<button class="btn-danger" onclick="deleteStrat('${s.id}')">Delete</button>` : ''}
    </div>
  </div>`;
}

function renderRecentStrats() {
  const container = document.getElementById('recent-strats');
  const recent = allStrats.slice(0, 5);
  if (!recent.length) {
    container.innerHTML = '<div class="empty-state">No strats saved yet.</div>';
    return;
  }
  container.innerHTML = recent.map(s => `
    <div class="activity-item">
      <span class="badge badge-${s.side === 'attack' ? 'atk' : 'def'}">${s.side}</span>
      <span>${s.name}</span>
      <span class="badge badge-role" style="margin-left:4px">${s.map}</span>
      <span class="activity-time">${s.createdBy}</span>
    </div>
  `).join('');
}

window.filterStrats = function() { renderStratCards(); };

window.deleteStrat = async function(id) {
  if (!confirm('Delete this strat?')) return;
  await deleteDoc(doc(db, 'strats', id));
  showToast('Strat deleted');
};

// ===== TEAM COMP =====
function initTeamComp() {
  buildOpSelector('comp-op-selector', compSelectedOps, 'comp-selected-ops', 5);
  updateCompSitesInternal();
}

window.updateCompSites = function() { updateCompSitesInternal(); };
function updateCompSitesInternal() {
  const map = document.getElementById('comp-map').value;
  const siteSel = document.getElementById('comp-site');
  siteSel.innerHTML = '';
  if (META[map]) {
    Object.keys(META[map].sites).forEach(s => {
      const o = document.createElement('option');
      o.value = s; o.textContent = s;
      siteSel.appendChild(o);
    });
  }
}

window.openNewCompModal = function() {
  compSelectedOps = [];
  document.getElementById('comp-map').value = MAPS[0];
  updateCompSitesInternal();
  document.getElementById('comp-name').value = '';
  document.getElementById('comp-notes').value = '';
  document.getElementById('comp-side').value = 'attack';
  buildOpSelector('comp-op-selector', compSelectedOps, 'comp-selected-ops', 5);
  document.getElementById('comp-modal').style.display = 'flex';
};

window.saveComp = async function() {
  const name = document.getElementById('comp-name').value.trim();
  if (!name) { showToast('Please enter a comp name', 'error'); return; }
  if (compSelectedOps.length !== 5) { showToast('Please select exactly 5 operators', 'error'); return; }
  const data = {
    name,
    map: document.getElementById('comp-map').value,
    site: document.getElementById('comp-site').value,
    side: document.getElementById('comp-side').value,
    operators: [...compSelectedOps],
    notes: document.getElementById('comp-notes').value.trim(),
    createdBy: currentUser.displayName || currentUser.email,
    createdById: currentUser.uid,
    createdAt: serverTimestamp()
  };
  try {
    await addDoc(collection(db, 'comps'), data);
    await logActivity(`saved comp "${name}"`);
    showToast('Comp saved', 'success');
    closeModal('comp-modal');
  } catch(e) {
    showToast('Failed to save: ' + e.message, 'error');
  }
};

function subscribeComps() {
  const q = query(collection(db, 'comps'), orderBy('createdAt', 'desc'));
  unsubComps = onSnapshot(q, snap => {
    allComps = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderCompCards();
    document.getElementById('comp-count').textContent = allComps.length;
  });
}

function renderCompCards() {
  const mapFilter = document.getElementById('tc-map-filter')?.value || '';
  let comps = allComps;
  if (mapFilter) comps = comps.filter(c => c.map === mapFilter);
  const container = document.getElementById('comp-list-container');
  if (!comps.length) {
    container.innerHTML = '<div class="empty-state">No team comps yet. Click "+ New Comp" to build one.</div>';
    return;
  }
  container.innerHTML = comps.map(c => {
    const ops = (c.operators || []).map(o => `<span class="op-chip">${o}</span>`).join('');
    const isOwner = c.createdById === currentUser?.uid;
    const sideColor = c.side === 'attack' ? 'atk' : 'def';
    return `<div class="strat-card">
      <div class="strat-card-header"><div class="strat-card-name">${c.name}</div></div>
      <div class="strat-card-meta">
        <span class="badge badge-${sideColor}">${c.side}</span>
        <span class="badge badge-role">${c.map}</span>
        <span class="badge badge-role">${c.site || ''}</span>
      </div>
      <div class="strat-card-ops">${ops}</div>
      ${c.notes ? `<div class="strat-card-desc">${c.notes}</div>` : ''}
      <div class="strat-card-footer">
        <span class="strat-card-author">by ${c.createdBy || 'Unknown'}</span>
        ${isOwner ? `<button class="btn-danger" onclick="deleteComp('${c.id}')">Delete</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

window.filterComps = function() { renderCompCards(); };

window.deleteComp = async function(id) {
  if (!confirm('Delete this comp?')) return;
  await deleteDoc(doc(db, 'comps', id));
  showToast('Comp deleted');
};

// ===== MAP PLANNER =====
function initMapPlanner() {
  const list = document.getElementById('map-planner-list');
  MAPS.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'map-planner-btn';
    btn.textContent = m;
    btn.onclick = () => selectMapPlanner(m, btn);
    list.appendChild(btn);
  });
}

function selectMapPlanner(map, btn) {
  activeMapPlanner = map;
  document.querySelectorAll('.map-planner-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('map-view-title').textContent = map + ' — Blueprints';
  document.getElementById('map-view-actions').style.display = 'flex';
  document.getElementById('map-notes-bar').style.display = 'flex';
  const container = document.getElementById('map-iframe-container');
  container.innerHTML = `<iframe src="${META[map].siegegg}" title="${map} map blueprint from Siegegg.com" loading="lazy"></iframe>`;
  loadMapNotes(map);
}

window.openSiegeGG = function() {
  if (activeMapPlanner) window.open(META[activeMapPlanner].siegegg, '_blank');
};

window.openFloorSelect = function() {
  showToast('Open on Siegegg.com to browse floors and sites directly');
};

window.saveMapNote = async function() {
  const input = document.getElementById('map-note-input');
  const text = input.value.trim();
  if (!text || !activeMapPlanner) return;
  await addDoc(collection(db, 'mapnotes'), {
    map: activeMapPlanner,
    text,
    author: currentUser.displayName || currentUser.email,
    authorId: currentUser.uid,
    createdAt: serverTimestamp()
  });
  input.value = '';
  showToast('Note saved', 'success');
};

async function loadMapNotes(map) {
  const q = query(collection(db, 'mapnotes'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const notes = snap.docs.map(d => d.data()).filter(n => n.map === map);
  const container = document.getElementById('map-notes-list');
  if (!notes.length) {
    container.innerHTML = '<div style="font-size:12px;color:var(--text-muted);padding:8px 0">No notes yet for this map.</div>';
    return;
  }
  container.innerHTML = notes.map(n => `
    <div class="map-note-item">
      <span class="map-note-author">${n.author}</span>
      <span>${n.text}</span>
      <span class="map-note-time">${n.createdAt?.toDate ? timeAgo(n.createdAt.toDate()) : ''}</span>
    </div>
  `).join('');
}

// ===== OPERATOR SELECTOR =====
function buildOpSelector(selectorId, selectedArr, selectedDisplayId, max) {
  const container = document.getElementById(selectorId);
  const display = document.getElementById(selectedDisplayId);
  container.innerHTML = '';
  ALL_OPERATORS.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'op-btn' + (selectedArr.includes(op) ? ' selected' : '');
    btn.textContent = op;
    btn.onclick = () => toggleOp(op, selectedArr, max, selectorId, selectedDisplayId);
    container.appendChild(btn);
  });
  renderSelectedOps(selectedArr, selectedDisplayId, selectorId, max);
}

function toggleOp(op, arr, max, selectorId, displayId) {
  const idx = arr.indexOf(op);
  if (idx > -1) {
    arr.splice(idx, 1);
  } else {
    if (arr.length >= max) { showToast(`Max ${max} operators`); return; }
    arr.push(op);
  }
  buildOpSelector(selectorId, arr, displayId, max);
}

function renderSelectedOps(arr, displayId, selectorId, max) {
  const display = document.getElementById(displayId);
  if (!arr.length) { display.innerHTML = ''; return; }
  display.innerHTML = arr.map(op => `
    <div class="selected-op-tag">
      ${op}
      <button onclick="toggleOp('${op}', ${displayId === 'selected-ops' ? 'selectedOps' : 'compSelectedOps'}, ${max}, '${selectorId}', '${displayId}')" aria-label="Remove ${op}">×</button>
    </div>
  `).join('');
}

// ===== ACTIVITY =====
async function logActivity(action) {
  await addDoc(collection(db, 'activity'), {
    user: currentUser.displayName || currentUser.email,
    action,
    createdAt: serverTimestamp()
  });
}

async function loadActivity() {
  const q = query(collection(db, 'activity'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  const feed = document.getElementById('activity-feed');
  const items = snap.docs.slice(0, 10).map(d => d.data());
  if (!items.length) { feed.innerHTML = '<div class="empty-state">No activity yet.</div>'; return; }
  feed.innerHTML = items.map(a => `
    <div class="activity-item">
      <span class="activity-user">${a.user}</span>
      <span>${a.action}</span>
      <span class="activity-time">${a.createdAt?.toDate ? timeAgo(a.createdAt.toDate()) : ''}</span>
    </div>
  `).join('');
}

async function loadMemberCount() {
  const snap = await getDocs(collection(db, 'users'));
  document.getElementById('member-count').textContent = snap.size;
  document.getElementById('online-count').textContent = snap.size + ' member' + (snap.size !== 1 ? 's' : '');
  loadActivity();
}

// ===== MODALS =====
window.closeModal = function(id) {
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
  const secs = Math.floor((new Date() - date) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return Math.floor(secs/60) + 'm ago';
  if (secs < 86400) return Math.floor(secs/3600) + 'h ago';
  return Math.floor(secs/86400) + 'd ago';
}
