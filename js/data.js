// ============================================================
// R6 STRAT BOARD — DATA FILE
// All maps, bomb sites, operators, and meta reference data
// Update this file each season to keep meta data current
// ============================================================

export const ATTACK_OPERATORS = [
  "Ace","Amaru","Ash","Blackbeard","Blitz","Brava","Buck","Capitão","Deimos",
  "Dokkaebi","Finka","Flores","Fuze","Glaz","Gridlock","Grim","Hibana",
  "Iana","IQ","Jackal","Kali","Lion","Maverick","Montagne","Nøkk","Nomad",
  "Osa","Ram","Rauora","Sens","Sledge","Solid Snake","Striker","Thatcher","Thermite",
  "Twitch","Ying","Zero","Zofia"
];

export const DEFENSE_OPERATORS = [
  "Alibi","Aruni","Azami","Bandit","Castle","Caveira","Clash","Denari","Doc","Echo","Ela",
  "Fenrir","Frost","Goyo","Jäger","Kaid","Kapkan","Lesion","Maestro","Melusi",
  "Mira","Mozzie","Mute","Oryx","Pulse","Rook","Sentry","Skopós","Smoke","Solis","Tachanka",
  "Thorn","Thunderbird","Tubarão","Valkyrie","Vigil","Wamai","Warden"
];

export const ALL_OPERATORS = [...new Set([...ATTACK_OPERATORS, ...DEFENSE_OPERATORS])].sort();

// All ranked maps with all bomb sites
export const MAPS = {
  "Bank": {
    sites: ["Vault / Lockers","CEO / Tellers","Archives / Security","Basement / Cafeteria"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor","Roof"],
    category: "pro"
  },
  "Border": {
    sites: ["Armory / CCTV","Supply Room / Ventilation","Bathroom / Tellers","Workshop / Customs"],
    floors: ["Ground Floor","1st Floor","Roof"],
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
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor","Roof"],
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
    sites: ["Reading / Fireplace","Mining / Fireplace","Kitchen / Service","Bar / Cocktail"],
    floors: ["Ground Floor","1st Floor","2nd Floor","Roof"],
    category: "pro"
  },
  "Kanal": {
    sites: ["Server / Security","Coast Guard / Map","Radar / Drone","Armory / Kitchen"],
    floors: ["Basement","Ground Floor","1st Floor","2nd Floor","Roof"],
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

// Pro meta reference data per site (pro league maps)
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
      tip: "CEO/Tellers has multiple entry points. Prioritize intel (Valkyrie + Echo) so anchors know where to hold before attackers commit.",
      suggestedAtkBans: ["Mira","Echo"],
      suggestedDefBans: ["Thatcher","Thermite"]
    }
  },
  "Clubhouse": {
    "Bar / Stage": {
      atk: [
        { name: "Ash", role: "Entry fragger", desc: "Opens soft walls around Bar with CREM launcher, dictates pace from Gym side." },
        { name: "Ace", role: "Hard breacher", desc: "SELMA charges on Bar reinforced wall and Stage double. Core of every execute." },
        { name: "Thatcher", role: "Support", desc: "EMPs destroy Bandit charges and Kaid claws on Bar wall. Never run Ace without him." },
        { name: "Buck", role: "Soft breacher", desc: "Skeleton Key opens vertical plays from Church roof down into Bar." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs seal Bike/Church flank routes post-execute." }
      ],
      def: [
        { name: "Bandit", role: "Wall denial", desc: "Shock wires on Bar reinforced wall. Forces attackers to burn Thatcher utility." },
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Bar facing Gym entrance — controls the primary push corridor." },
        { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Bar plant spots during final 30 seconds." },
        { name: "Jäger", role: "Utility denial", desc: "ADS catches grenades in tight Bar corridor. Strong fragger for early roam." },
        { name: "Lesion", role: "Intel", desc: "Gu needles in Stage corners slow attacker movement and reveal positions." }
      ],
      setup: "Reinforce Bar back wall and Stage left wall. Mira goes Bar facing Gym. Bandit shocks the two primary breach walls. Lesion seeds needles in Stage. Smoke holds Bedroom balcony early, returns for plant denial. Jäger takes Bike Hall early.",
      tip: "Bar/Stage is one of the most reinforcement-hungry sites in the pool. Prioritize the two reinforced breach walls before anything else.",
      suggestedAtkBans: ["Mira","Bandit"],
      suggestedDefBans: ["Thatcher","Ace"]
    },
    "Gym / CCTV": {
      atk: [
        { name: "Thermite", role: "Hard breacher", desc: "Exothermic charge on CCTV wall — more reliable when wall denial is expected." },
        { name: "Thatcher", role: "Support", desc: "EMPs through CCTV window neutralize Bandit/Kaid before breach." },
        { name: "Sledge", role: "Soft breacher", desc: "Opens Gym ceiling for vertical play down into CCTV." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs on Bike Hall and Church flank routes secure post-plant." },
        { name: "Ash", role: "Entry fragger", desc: "Clears utility from Gym windows before the push." }
      ],
      def: [
        { name: "Kaid", role: "Wall denial", desc: "Rtila claws on CCTV reinforced wall." },
        { name: "Valkyrie", role: "Intel", desc: "Black Eye cameras in Gym exterior and Bike Hall." },
        { name: "Smoke", role: "Plant denial", desc: "Gas canisters reach both default and sneaky plant spots." },
        { name: "Echo", role: "Plant denial", desc: "Yokai drone disrupts Gym pushes and reveals positions mid-execute." },
        { name: "Jäger", role: "Roamer", desc: "Aggressive early roam in Armoury and Church to bleed attacker time." }
      ],
      setup: "Reinforce CCTV main wall and Gym side wall. Kaid claws the CCTV wall. Valkyrie places cameras in Gym exterior. Echo parks Yokai above CCTV plant. Smoke holds piano room or upper CCTV. Jäger works Church/Armoury early.",
      tip: "Gym/CCTV is defender-sided when anchors hold position. Avoid over-roaming — stay to contest the Gym push early.",
      suggestedAtkBans: ["Mira","Echo"],
      suggestedDefBans: ["Thatcher","Sledge"]
    }
  },
  "Consulate": {
    "Consul / Lobby": {
      atk: [
        { name: "Buck", role: "Soft breacher", desc: "Essential on Consulate. Opens Consul floor from above." },
        { name: "Maverick", role: "Anti-wall denial", desc: "Blowtorch burns through reinforced walls without triggering Bandit/Kaid." },
        { name: "Ash", role: "Entry fragger", desc: "Clears Lobby utility from distance." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs seal Tellers and Basement flank routes." },
        { name: "Thatcher", role: "Support", desc: "EMPs on Lobby reinforced walls to enable Thermite or support Maverick." }
      ],
      def: [
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Consul facing Lobby — one of the best Mira spots in the game." },
        { name: "Bandit", role: "Wall denial", desc: "Shocks Consul reinforced walls. Forces Maverick or Thatcher + Thermite chain." },
        { name: "Smoke", role: "Plant denial", desc: "Covers both plant spots in Lobby from above." },
        { name: "Lesion", role: "Intel", desc: "Gu needles in Tellers hallway reveal flanking attackers." },
        { name: "Vigil", role: "Roamer", desc: "Drone immunity makes early Consulate roam very strong." }
      ],
      setup: "Reinforce Consul main wall and Lobby window wall. Mira goes Consul facing Lobby. Bandit shocks both. Smoke holds above Lobby. Lesion seeds Tellers. Vigil roams Basement/Garage hard early.",
      tip: "Post-rework Consulate favors CQB anchor-heavy defense. Don't over-roam — corridors punish lone defenders.",
      suggestedAtkBans: ["Mira","Bandit"],
      suggestedDefBans: ["Buck","Maverick"]
    }
  },
  "Chalet": {
    "Garage / Snowmobile": {
      atk: [
        { name: "Ace", role: "Hard breacher", desc: "SELMA on Garage double reinforced wall — the primary execute point." },
        { name: "Thatcher", role: "Support", desc: "EMPs Garage double wall before Ace charges. Essential pairing." },
        { name: "Gridlock", role: "Area denial", desc: "Trax stingers block Garage run-outs and force defenders into site." },
        { name: "Ash", role: "Entry fragger", desc: "Clears Garage window utility from Bear's Den or Snowmobile side." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs on Kitchen and Trophy Room flank routes." }
      ],
      def: [
        { name: "Bandit", role: "Wall denial", desc: "Shocks Garage double wall — the most important utility on this site." },
        { name: "Kaid", role: "Wall denial", desc: "Backup claws on Garage wall when Bandit can't cover both panels." },
        { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Snowmobile plant spot." },
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Garage facing Snowmobile." },
        { name: "Jäger", role: "Roamer", desc: "ADS in Garage absorbs grenades. Roams Ski Room early." }
      ],
      setup: "Reinforce Garage double wall (both panels). Bandit shocks both, Kaid as backup. Mira goes Garage facing Snowmobile. Smoke holds Kitchen or Bear's Den. Jäger roams Ski Room, returns.",
      tip: "Garage double wall is the spine of this defense. If both breach panels fall without burning Thatcher + Ace, rotate immediately.",
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
        { name: "Buck", role: "Vertical", desc: "Opens Dining ceiling from Dorms 2F for vertical pressure." }
      ],
      def: [
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Kitchen facing Laundry — highest-value Mira position on Oregon." },
        { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Kitchen plant from Dining or Laundry." },
        { name: "Bandit", role: "Wall denial", desc: "Shocks Kitchen primary reinforced wall." },
        { name: "Nomad", role: "Roam denial", desc: "Airjabs on Tower and Dorms routes punish attacker movement." },
        { name: "Lesion", role: "Intel", desc: "Gu needles in Laundry and Tower stairs reveal roam timings." }
      ],
      setup: "Reinforce Kitchen main wall and Dining back wall. Bandit shocks Kitchen. Mira goes Kitchen facing Laundry. Smoke holds Dining or Upper Kitchen. Nomad places Airjabs on Tower stairs and Dorm hallway. Lesion seeds Laundry.",
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
        { name: "Osa", role: "Entry support", desc: "Talon-8 shields placed in Service entrance and Hookah window lock angles." },
        { name: "Ash", role: "Entry fragger", desc: "Clears Hookah window utility from Blue Bar balcony." },
        { name: "Nomad", role: "Flank watch", desc: "Airjabs on Penthouse and Kitchen flank routes." }
      ],
      def: [
        { name: "Solis", role: "Intel denial", desc: "SPEC-IO scanner removes attacker drones — essential where drone phase is key." },
        { name: "Mira", role: "Anchor", desc: "Black Mirror in Hookah facing Service." },
        { name: "Smoke", role: "Plant denial", desc: "Remote canisters cover Service plant spot." },
        { name: "Jäger", role: "Roamer", desc: "ADS absorbs grenades in Hookah. Roams Penthouse early." },
        { name: "Oryx", role: "Roamer", desc: "Hatch mobility is excellent on Coastline — punches between floors freely." }
      ],
      setup: "Reinforce Hookah main wall and Service back wall. Mira goes Hookah facing Service. Solis scans during drone phase. Smoke holds Kitchen or above Hookah. Jäger roams Penthouse early.",
      tip: "Coastline rewards intel-heavy defense. Solis is especially strong here — deny attacker drones early.",
      suggestedAtkBans: ["Mira","Solis"],
      suggestedDefBans: ["Thatcher","Ace"]
    }
  }
};

// Gadget types for map planning
export const GADGETS = {
  attack: [
    { id: "breach_charge", label: "Breach Charge", color: "#e8b84b" },
    { id: "drone", label: "Drone", color: "#4a9eff" },
    { id: "claymore", label: "Claymore", color: "#ff5555" },
    { id: "smoke_grenade", label: "Smoke Grenade", color: "#888880" },
    { id: "flash_grenade", label: "Flash Grenade", color: "#fff" },
    { id: "hard_breach", label: "Hard Breach", color: "#e8b84b" },
    { id: "grapple", label: "Grapple Hook", color: "#4caf7d" }
  ],
  defense: [
    { id: "barbed_wire", label: "Barbed Wire", color: "#888880" },
    { id: "deployable_shield", label: "Deploy Shield", color: "#4a9eff" },
    { id: "nitro_cell", label: "Nitro Cell", color: "#ff5555" },
    { id: "bulletproof_cam", label: "BP Camera", color: "#4a9eff" },
    { id: "proximity_alarm", label: "Prox Alarm", color: "#e8b84b" },
    { id: "reinforcement", label: "Reinforcement", color: "#888880" },
    { id: "ads", label: "ADS", color: "#4caf7d" }
  ]
};
