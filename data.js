// ============================================================
// R6 STRAT BOARD — DATA FILE v3
// Full operator roster, all maps, all sites, meta data
// ============================================================

// Operator icon base URL — pattern: ICON_BASE + iconKey + '/' + iconKey + '.svg'
export const ICON_BASE = 'https://raw.githubusercontent.com/marcopixel/r6operators/master/operators/';

// Maps operator display name to icon filename
// Icon repo has icons for established ops; newer ops (Rauora, Deimos, Denari, Skopós,
// Solid Snake, Striker, Sentry) fall back to initials automatically via onerror handler.
export const OP_ICON = {
  // Attackers
  "Ace": "ace", "Amaru": "amaru", "Ash": "ash", "Blackbeard": "blackbeard",
  "Blitz": "blitz", "Brava": "brava", "Buck": "buck", "Capitão": "capitao",
  "Deimos": null, "Dokkaebi": "dokkaebi", "Finka": "finka", "Flores": "flores",
  "Fuze": "fuze", "Glaz": "glaz", "Gridlock": "gridlock", "Grim": "grim",
  "Hibana": "hibana", "Iana": "iana", "IQ": "iq", "Jackal": "jackal",
  "Kali": "kali", "Lion": "lion", "Maverick": "maverick", "Montagne": "montagne",
  "Nøkk": "nokk", "Nomad": "nomad", "Osa": "osa", "Ram": "ram",
  "Rauora": null, "Sens": "sens", "Sledge": "sledge", "Solid Snake": null,
  "Striker": null, "Thatcher": "thatcher", "Thermite": "thermite",
  "Twitch": "twitch", "Ying": "ying", "Zero": "zero", "Zofia": "zofia",
  // Defenders
  "Alibi": "alibi", "Aruni": "aruni", "Azami": "azami", "Bandit": "bandit",
  "Castle": "castle", "Caveira": "caveira", "Clash": "clash", "Denari": null,
  "Doc": "doc", "Echo": "echo", "Ela": "ela", "Fenrir": "fenrir",
  "Frost": "frost", "Goyo": "goyo", "Jäger": "jager", "Kaid": "kaid",
  "Kapkan": "kapkan", "Lesion": "lesion", "Maestro": "maestro", "Melusi": "melusi",
  "Mira": "mira", "Mozzie": "mozzie", "Mute": "mute", "Oryx": "oryx",
  "Pulse": "pulse", "Rook": "rook", "Sentry": null, "Skopós": null,
  "Smoke": "smoke", "Solis": "solis", "Tachanka": "tachanka", "Thorn": "thorn",
  "Thunderbird": "thunderbird", "Tubarão": "tubarao",
  "Valkyrie": "valkyrie", "Wamai": "wamai", "Warden": "warden"
};

// ── Exact rosters from the game (alphabetical within each side) ──────────────
export const ATTACK_OPERATORS = [
  "Ace","Amaru","Ash","Blackbeard","Blitz","Brava","Buck","Capitão",
  "Deimos","Dokkaebi","Finka","Flores","Fuze","Glaz","Gridlock","Grim",
  "Hibana","Iana","IQ","Jackal","Kali","Lion","Maverick","Montagne",
  "Nøkk","Nomad","Osa","Ram","Rauora","Sens","Sledge","Solid Snake",
  "Striker","Thatcher","Thermite","Twitch","Ying","Zero","Zofia"
];

export const DEFENSE_OPERATORS = [
  "Alibi","Aruni","Azami","Bandit","Castle","Caveira","Clash","Denari",
  "Doc","Echo","Ela","Fenrir","Frost","Goyo","Jäger","Kaid",
  "Kapkan","Lesion","Maestro","Melusi","Mira","Mozzie","Mute","Oryx",
  "Pulse","Rook","Sentry","Skopós","Smoke","Solis","Tachanka","Thorn",
  "Thunderbird","Tubarão","Valkyrie","Wamai","Warden"
];

// All ranked maps with all bomb sites
export const MAPS = {
  "Bank": {
    sites: ["Vault / Lockers","CEO / Tellers","Archives / Security","Basement / Cafeteria"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor"],
    category: "pro"
  },
  "Border": {
    sites: ["Armory / CCTV","Supply Room / Ventilation","Bathroom / Tellers","Workshop / Customs"],
    floors: ["Ground Floor","1st Floor"],
    category: "ranked"
  },
    "Calypso Casino": {
    sites: ["2F Cigar Room / Pool", "1F Blackjack / Poker", "1F Bar / Betting", "B CCTV / Vault Checkpoint"],
    floors: ["Basement", "1st Floor", "2nd Floor"],
    category: "ranked"
  },
  "Chalet": {
    sites: ["Garage / Snowmobile","Wine / Trophy","Bedroom / Office","Kitchen / Bar"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor"],
    category: "pro"
  },
  "Clubhouse": {
    sites: ["Bar / Stage","Gym / CCTV","Cash / Armory","Church / Arsenal"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor"],
    category: "pro"
  },
  "Consulate": {
    sites: ["Consul / Lobby","Visa / Archives","Garage / Tellers","Basement / Cafeteria"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor"],
    category: "pro"
  },
  "Coastline": {
    sites: ["Hookah / Service","VIP / Sunrise","Billiard / Diving","Kitchen / Supply"],
    floors: ["Ground Floor","1st Floor","Roof"],
    category: "pro"
  },
  "Emerald Plains": {
    sites: ["Dining / Study","Master Bedroom / Office","Bar / Pantry","Garage / Living"],
    floors: ["Basement","Ground Floor","1st Floor"],
    category: "ranked"
  },
  "Kafe Dostoyevsky": {
    sites: ["Reading / Fire Bar","Mining / Armory","Kitchen / Storage","Basement / Tasting"],
    floors: ["Ground Floor","1st Floor","2nd Floor","Roof"],
    category: "ranked"
  },
  "Kanal": {
    sites: ["Server / Security","Coast Guard / Map","Radar / Drone","Armory / Kitchen"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor"],
    category: "ranked"
  },
  "Lair": {
    sites: ["Server / Control","Bio Lab / Armory","Lounge / Kitchen","Garage / Workshop"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor"],
    category: "ranked"
  },
  "Nighthaven Labs": {
    sites: ["Server / Security","Labs / Testing","Armory / Cafeteria","Basement / Storage"],
    floors: ["Basement","Ground Floor","1st Floor","Roof"],
    category: "ranked"
  },
  "Oregon": {
    sites: ["Kitchen / Dining","Basement / Supply","Meeting / Office","Kids / Laundry"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor","Tower"],
    category: "pro"
  },
  "Outback": {
    sites: ["Bar / Stage","Office / Bedroom","Kitchen / Supply","Workshop / Garage"],
    floors: ["Ground Floor","1st Floor","2nd Floor"],
    category: "ranked"
  },
  "Skyscraper": {
    sites: ["Exhibition / Office","Bedroom / Bathroom","Kitchen / Bar","Penthouse / Lounge"],
    floors: ["Ground Floor","1st Floor","2nd Floor","3rd Floor","Roof"],
    category: "ranked"
  },
  "Theme Park": {
    sites: ["Throne / Armory","Bunk / Initiation","Cafe / Prize","Arcade / Lab"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor"],
    category: "ranked"
  },
  "Villa": {
    sites: ["Game / Living","Aviator / Study","Kitchen / Dining","Basement / Laundry"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor"],
    category: "ranked"
  }
};

export const MAP_NAMES = Object.keys(MAPS).sort();

// Gadget types for map planning
export const GADGETS = {
  attack: [
    { id: "breach_charge", label: "Breach", color: "#e8b84b", symbol: "B" },
    { id: "drone", label: "Drone", color: "#4a9eff", symbol: "D" },
    { id: "claymore", label: "Claymore", color: "#ff5555", symbol: "C" },
    { id: "smoke_grenade", label: "Smoke", color: "#888880", symbol: "S" },
    { id: "flash_grenade", label: "Flash", color: "#ffffff", symbol: "F" },
    { id: "hard_breach", label: "Hard Breach", color: "#e8b84b", symbol: "HB" },
    { id: "grapple", label: "Grapple", color: "#4caf7d", symbol: "G" },
    { id: "frag_grenade", label: "Frag", color: "#ff8800", symbol: "FR" },
    { id: "emp", label: "EMP", color: "#aa44ff", symbol: "E" }
  ],
  defense: [
    { id: "barbed_wire", label: "Barbed Wire", color: "#888880", symbol: "BW" },
    { id: "deployable_shield", label: "Shield", color: "#4a9eff", symbol: "DS" },
    { id: "nitro_cell", label: "Nitro Cell", color: "#ff5555", symbol: "N" },
    { id: "bulletproof_cam", label: "BP Cam", color: "#4a9eff", symbol: "BC" },
    { id: "proximity_alarm", label: "Prox Alarm", color: "#e8b84b", symbol: "PA" },
    { id: "reinforcement", label: "Reinforce", color: "#888880", symbol: "R" },
    { id: "ads", label: "ADS", color: "#4caf7d", symbol: "ADS" },
    { id: "observation_blocker", label: "Obs Block", color: "#aa4400", symbol: "OB" },
    { id: "impact_grenade", label: "Impact", color: "#ff8800", symbol: "IG" }
  ]
};

// Pro meta reference data
export const META = {
  "Bank": {
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
      tip: "Vault/Lockers is a fortress site when wall denial is maintained. If both Ace and Thatcher are banned, Bank becomes extremely defender-sided.",
      suggestedAtkBans: ["Mira","Bandit"],
      suggestedDefBans: ["Thatcher","Ace"]
    },
    "CEO / Tellers": {
      atk: [
        { name: "Thermite", role: "Hard breacher", desc: "CEO reinforced wall from Main Lobby side." },
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
      setup: "Reinforce CEO main and side wall. Bandit shocks CEO wall. Azami reshapes Tellers doorways. Valkyrie drops cameras in Lobby. Echo parks Yokai above CEO plant.",
      tip: "CEO/Tellers has multiple entry points. Prioritize intel so anchors know where to hold before attackers commit.",
      suggestedAtkBans: ["Mira","Echo"],
      suggestedDefBans: ["Thatcher","Thermite"]
    }
  },
  "Clubhouse": {
    "Bar / Stage": {
      atk: [
        { name: "Ash", role: "Entry fragger", desc: "Opens soft walls around Bar with CREM launcher from Gym side." },
        { name: "Ace", role: "Hard breacher", desc: "SELMA charges on Bar reinforced wall and Stage double." },
        { name: "Thatcher", role: "Support", desc: "EMPs destroy Bandit charges and Kaid claws on Bar wall." },
        { name: "Buck", role: "Soft breacher", desc: "Skeleton Key opens vertical plays from Church roof into Bar." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs seal Bike/Church flank routes post-execute." }
      ],
      def: [
        { name: "Bandit", role: "Wall denial", desc: "Shock wires on Bar reinforced wall." },
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Bar facing Gym entrance." },
        { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Bar plant spots." },
        { name: "Jäger", role: "Utility denial", desc: "ADS catches grenades in tight Bar corridor." },
        { name: "Lesion", role: "Intel", desc: "Gu needles in Stage corners slow attacker movement." }
      ],
      setup: "Reinforce Bar back wall and Stage left wall. Mira goes Bar facing Gym. Bandit shocks the two primary breach walls. Lesion seeds Stage. Smoke holds Bedroom balcony early.",
      tip: "Bar/Stage is reinforcement-hungry. Prioritize the two reinforced breach walls before anything else.",
      suggestedAtkBans: ["Mira","Bandit"],
      suggestedDefBans: ["Thatcher","Ace"]
    },
    "Gym / CCTV": {
      atk: [
        { name: "Thermite", role: "Hard breacher", desc: "Exothermic charge on CCTV wall." },
        { name: "Thatcher", role: "Support", desc: "EMPs through CCTV window neutralize Bandit/Kaid." },
        { name: "Sledge", role: "Soft breacher", desc: "Opens Gym ceiling for vertical play into CCTV." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs on Bike Hall and Church flank routes." },
        { name: "Ash", role: "Entry fragger", desc: "Clears utility from Gym windows before the push." }
      ],
      def: [
        { name: "Kaid", role: "Wall denial", desc: "Rtila claws on CCTV reinforced wall." },
        { name: "Valkyrie", role: "Intel", desc: "Black Eye cameras in Gym exterior and Bike Hall." },
        { name: "Smoke", role: "Plant denial", desc: "Gas canisters reach both default and sneaky plant spots." },
        { name: "Echo", role: "Plant denial", desc: "Yokai drone disrupts Gym pushes." },
        { name: "Jäger", role: "Roamer", desc: "Aggressive early roam in Armoury and Church." }
      ],
      setup: "Reinforce CCTV main wall and Gym side wall. Kaid claws CCTV. Valkyrie cameras in Gym exterior. Echo Yokai above CCTV plant. Jäger works Church early.",
      tip: "Gym/CCTV is defender-sided when anchors hold position. Avoid over-roaming.",
      suggestedAtkBans: ["Mira","Echo"],
      suggestedDefBans: ["Thatcher","Sledge"]
    }
  },
  "Consulate": {
    "Consul / Lobby": {
      atk: [
        { name: "Buck", role: "Soft breacher", desc: "Opens Consul floor from above and soft walls for alternate entries." },
        { name: "Maverick", role: "Anti-wall denial", desc: "Blowtorch burns through reinforced walls without triggering Bandit/Kaid." },
        { name: "Ash", role: "Entry fragger", desc: "Clears Lobby utility from distance." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs seal Tellers and Basement flank routes." },
        { name: "Thatcher", role: "Support", desc: "EMPs on Lobby reinforced walls." }
      ],
      def: [
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Consul facing Lobby — one of the best Mira spots in the game." },
        { name: "Bandit", role: "Wall denial", desc: "Shocks Consul reinforced walls." },
        { name: "Smoke", role: "Plant denial", desc: "Covers both plant spots in Lobby from above." },
        { name: "Lesion", role: "Intel", desc: "Gu needles in Tellers hallway." },
        { name: "Vigil", role: "Roamer", desc: "Drone immunity makes early Consulate roam very strong." }
      ],
      setup: "Reinforce Consul main and Lobby window wall. Mira faces Lobby. Bandit shocks both. Smoke above Lobby. Lesion seeds Tellers. Vigil roams Basement early.",
      tip: "Post-rework Consulate favors CQB anchor-heavy defense. Don't over-roam.",
      suggestedAtkBans: ["Mira","Bandit"],
      suggestedDefBans: ["Buck","Maverick"]
    }
  },
  "Chalet": {
    "Garage / Snowmobile": {
      atk: [
        { name: "Ace", role: "Hard breacher", desc: "SELMA on Garage double reinforced wall." },
        { name: "Thatcher", role: "Support", desc: "EMPs Garage double wall before Ace charges." },
        { name: "Gridlock", role: "Area denial", desc: "Trax stingers block Garage run-outs." },
        { name: "Ash", role: "Entry fragger", desc: "Clears Garage window utility." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs on Kitchen and Trophy Room flank routes." }
      ],
      def: [
        { name: "Bandit", role: "Wall denial", desc: "Shocks Garage double wall — the most important utility on this site." },
        { name: "Kaid", role: "Wall denial", desc: "Backup claws on Garage wall." },
        { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Snowmobile plant spot." },
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Garage facing Snowmobile." },
        { name: "Jäger", role: "Roamer", desc: "ADS in Garage absorbs grenades. Roams Ski Room early." }
      ],
      setup: "Reinforce Garage double wall (both panels). Bandit shocks both, Kaid as backup. Mira faces Snowmobile. Smoke holds Kitchen or Bear's Den. Jäger roams Ski Room.",
      tip: "If both breach panels fall without burning Thatcher + Ace, rotate immediately.",
      suggestedAtkBans: ["Mira","Bandit"],
      suggestedDefBans: ["Thatcher","Ace"]
    }
  },
  "Oregon": {
    "Kitchen / Dining": {
      atk: [
        { name: "Ace", role: "Hard breacher", desc: "SELMA on Kitchen reinforced wall from Laundry side." },
        { name: "Thatcher", role: "Support", desc: "EMPs Kitchen wall denial before Ace charges." },
        { name: "Ash", role: "Entry fragger", desc: "Leads entry through Dining window after breach." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs on Dorms and Tower flank routes." },
        { name: "Buck", role: "Vertical", desc: "Opens Dining ceiling from Dorms 2F." }
      ],
      def: [
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Kitchen facing Laundry." },
        { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Kitchen plant." },
        { name: "Bandit", role: "Wall denial", desc: "Shocks Kitchen primary reinforced wall." },
        { name: "Nomad", role: "Roam denial", desc: "Airjabs on Tower and Dorms routes." },
        { name: "Lesion", role: "Intel", desc: "Gu needles in Laundry and Tower stairs." }
      ],
      setup: "Reinforce Kitchen main and Dining back wall. Bandit shocks Kitchen. Mira faces Laundry. Smoke holds Dining. Nomad Airjabs Tower stairs. Lesion seeds Laundry.",
      tip: "Oregon's flank routes are the most aggressive in the pool. Anti-flank utility is as important as wall denial.",
      suggestedAtkBans: ["Mira","Lesion"],
      suggestedDefBans: ["Thatcher","Ace"]
    }
  },
  "Coastline": {
    "Hookah / Service": {
      atk: [
        { name: "Ace", role: "Hard breacher", desc: "SELMA on Hookah reinforced wall from Blue Bar side." },
        { name: "Thatcher", role: "Support", desc: "EMPs Hookah wall denial before Ace charges." },
        { name: "Osa", role: "Entry support", desc: "Talon-8 shields in Service entrance and Hookah window." },
        { name: "Ash", role: "Entry fragger", desc: "Clears Hookah window utility from Blue Bar balcony." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs on Penthouse and Kitchen flank routes." }
      ],
      def: [
        { name: "Solis", role: "Intel denial", desc: "SPEC-IO scanner removes attacker drones." },
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Hookah facing Service." },
        { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Service plant spot." },
        { name: "Jäger", role: "Roamer", desc: "ADS absorbs grenades in Hookah. Roams Penthouse early." },
        { name: "Oryx", role: "Roamer", desc: "Hatch mobility is excellent on Coastline." }
      ],
      setup: "Reinforce Hookah main and Service back wall. Mira faces Service. Solis scans drone phase. Smoke holds Kitchen or above Hookah. Jäger roams Penthouse.",
      tip: "Coastline rewards intel-heavy defense. Deny attacker drones early.",
      suggestedAtkBans: ["Mira","Solis"],
      suggestedDefBans: ["Thatcher","Ace"]
    }
  }
};
