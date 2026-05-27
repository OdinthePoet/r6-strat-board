// ============================================================
// MAP SCHEMATIC DATA — All 16 ranked maps
// Each map has rooms defined as SVG rectangles with labels
// Bomb sites are marked with site zones
// ============================================================

export const MAP_SCHEMATICS = {

  "Bank": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "lobby", x: 50, y: 80, w: 180, h: 140, label: "Main Lobby", color: "#1a2a3a" },
          { id: "vault", x: 230, y: 80, w: 160, h: 140, label: "Vault", color: "#2a1a1a", site: true },
          { id: "lockers", x: 390, y: 80, w: 130, h: 140, label: "Lockers", color: "#2a1a1a", site: true },
          { id: "server", x: 520, y: 80, w: 140, h: 80, label: "Server Room", color: "#1a2a2a" },
          { id: "tellers", x: 50, y: 280, w: 200, h: 120, label: "Tellers", color: "#2a2a1a", site: true },
          { id: "ceo", x: 250, y: 280, w: 160, h: 120, label: "CEO Office", color: "#2a2a1a", site: true },
          { id: "archives", x: 410, y: 280, w: 140, h: 120, label: "Archives", color: "#1a2a1a" },
          { id: "security", x: 550, y: 220, w: 110, h: 80, label: "Security", color: "#1a1a2a" },
          { id: "ext_front", x: 50, y: 440, w: 340, h: 80, label: "Front Exterior", color: "#111" },
          { id: "ext_back", x: 400, y: 440, w: 260, h: 80, label: "Back Exterior", color: "#111" },
          { id: "stair_left", x: 220, y: 200, w: 40, h: 80, label: "Stairs", color: "#333" },
          { id: "stair_right", x: 520, y: 160, w: 40, h: 60, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 230, y1: 80, x2: 230, y2: 220 },
          { x1: 390, y1: 80, x2: 390, y2: 220 },
          { x1: 50, y1: 250, x2: 660, y2: 250 },
          { x1: 250, y1: 250, x2: 250, y2: 400 },
          { x1: 410, y1: 250, x2: 410, y2: 400 },
        ],
        doors: [
          { x: 310, y: 248, w: 30, h: 4, label: "D" },
          { x: 160, y: 248, w: 30, h: 4, label: "D" },
          { x: 460, y: 248, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 300, y: 140, label: "H" },
          { x: 480, y: 310, label: "H" },
        ],
        windows: [
          { x: 50, y: 150, w: 4, h: 30, label: "W" },
          { x: 655, y: 290, w: 4, h: 30, label: "W" },
        ]
      },
      "Basement": {
        rooms: [
          { id: "cafeteria", x: 50, y: 100, w: 220, h: 160, label: "Cafeteria", color: "#2a2a1a", site: true },
          { id: "bathroom", x: 270, y: 100, w: 120, h: 160, label: "Bathroom", color: "#1a2a2a" },
          { id: "lockers_b", x: 390, y: 100, w: 140, h: 100, label: "Basement Lockers", color: "#2a1a2a", site: true },
          { id: "security_b", x: 390, y: 200, w: 140, h: 80, label: "Security Rm", color: "#1a1a2a" },
          { id: "garage", x: 530, y: 100, w: 130, h: 180, label: "Garage", color: "#111" },
          { id: "stair_b", x: 220, y: 260, w: 60, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 270, y1: 100, x2: 270, y2: 280 },
          { x1: 390, y1: 100, x2: 390, y2: 280 },
          { x1: 530, y1: 100, x2: 530, y2: 280 },
        ],
        doors: [
          { x: 310, y: 178, w: 30, h: 4, label: "D" },
          { x: 450, y: 178, w: 30, h: 4, label: "D" },
        ],
        hatches: [{ x: 150, y: 150, label: "H" }],
        windows: []
      }
    }
  },

  "Clubhouse": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "bar", x: 60, y: 80, w: 200, h: 160, label: "Bar", color: "#2a1a1a", site: true },
          { id: "stage", x: 260, y: 80, w: 160, h: 160, label: "Stage", color: "#2a1a1a", site: true },
          { id: "gym", x: 420, y: 80, w: 160, h: 120, label: "Gym", color: "#2a2a1a", site: true },
          { id: "cctv", x: 580, y: 80, w: 120, h: 120, label: "CCTV Room", color: "#2a2a1a", site: true },
          { id: "cash", x: 60, y: 280, w: 180, h: 140, label: "Cash Room", color: "#1a2a1a", site: true },
          { id: "armory", x: 240, y: 280, w: 160, h: 140, label: "Armory", color: "#1a2a1a", site: true },
          { id: "church", x: 400, y: 280, w: 180, h: 140, label: "Church", color: "#1a1a2a" },
          { id: "arsenal", x: 580, y: 280, w: 120, h: 140, label: "Arsenal Drop", color: "#1a1a2a" },
          { id: "bike_hall", x: 60, y: 460, w: 200, h: 80, label: "Bike Hall", color: "#111" },
          { id: "ext_church", x: 400, y: 460, w: 300, h: 80, label: "Church Exterior", color: "#111" },
          { id: "stair_l", x: 220, y: 220, w: 50, h: 70, label: "Stairs", color: "#333" },
          { id: "stair_r", x: 560, y: 200, w: 50, h: 70, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 200 },
          { x1: 580, y1: 80, x2: 580, y2: 420 },
          { x1: 60, y1: 255, x2: 700, y2: 255 },
          { x1: 240, y1: 255, x2: 240, y2: 420 },
          { x1: 400, y1: 255, x2: 400, y2: 420 },
        ],
        doors: [
          { x: 150, y: 253, w: 30, h: 4, label: "D" },
          { x: 310, y: 253, w: 30, h: 4, label: "D" },
          { x: 480, y: 253, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 150, y: 150, label: "H" },
          { x: 480, y: 320, label: "H" },
        ],
        windows: [
          { x: 58, y: 150, w: 4, h: 30, label: "W" },
          { x: 695, y: 310, w: 4, h: 30, label: "W" },
        ]
      },
      "1st Floor": {
        rooms: [
          { id: "bedroom", x: 60, y: 80, w: 200, h: 160, label: "Bedroom", color: "#1a2a2a" },
          { id: "bathroom_1f", x: 260, y: 80, w: 120, h: 160, label: "Bathroom", color: "#1a1a2a" },
          { id: "office_1f", x: 380, y: 80, w: 180, h: 160, label: "DJ Booth", color: "#2a1a2a" },
          { id: "vip", x: 560, y: 80, w: 140, h: 160, label: "VIP Lounge", color: "#2a2a1a" },
          { id: "stair_l1", x: 220, y: 200, w: 50, h: 60, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 380, y1: 80, x2: 380, y2: 240 },
          { x1: 560, y1: 80, x2: 560, y2: 240 },
        ],
        doors: [{ x: 315, y: 160, w: 30, h: 4, label: "D" }],
        hatches: [{ x: 450, y: 140, label: "H" }],
        windows: [{ x: 58, y: 130, w: 4, h: 30, label: "W" }]
      }
    }
  },

  "Consulate": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "lobby", x: 60, y: 80, w: 200, h: 160, label: "Main Lobby", color: "#1a2a3a" },
          { id: "consul", x: 260, y: 80, w: 180, h: 160, label: "Consul Office", color: "#2a2a1a", site: true },
          { id: "tellers_c", x: 440, y: 80, w: 160, h: 100, label: "Tellers", color: "#2a2a1a", site: true },
          { id: "garage_c", x: 600, y: 80, w: 140, h: 160, label: "Garage", color: "#111" },
          { id: "visa", x: 60, y: 280, w: 180, h: 140, label: "Visa Office", color: "#1a2a2a", site: true },
          { id: "archives_c", x: 240, y: 280, w: 180, h: 140, label: "Archives", color: "#1a2a2a", site: true },
          { id: "parking", x: 420, y: 280, w: 200, h: 140, label: "Parking", color: "#111" },
          { id: "stair_c", x: 220, y: 200, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 440, y1: 80, x2: 440, y2: 180 },
          { x1: 600, y1: 80, x2: 600, y2: 240 },
          { x1: 60, y1: 255, x2: 620, y2: 255 },
          { x1: 240, y1: 255, x2: 240, y2: 420 },
          { x1: 420, y1: 255, x2: 420, y2: 420 },
        ],
        doors: [
          { x: 150, y: 253, w: 30, h: 4, label: "D" },
          { x: 320, y: 253, w: 30, h: 4, label: "D" },
        ],
        hatches: [{ x: 330, y: 140, label: "H" }],
        windows: [
          { x: 58, y: 140, w: 4, h: 30, label: "W" },
          { x: 58, y: 310, w: 4, h: 30, label: "W" },
        ]
      },
      "Basement": {
        rooms: [
          { id: "cafe_c", x: 60, y: 100, w: 220, h: 160, label: "Cafeteria", color: "#2a2a1a", site: true },
          { id: "basement_c", x: 280, y: 100, w: 160, h: 160, label: "Basement", color: "#1a2a1a", site: true },
          { id: "garage_b", x: 440, y: 100, w: 200, h: 160, label: "Garage Basement", color: "#111" },
          { id: "stair_bc", x: 250, y: 240, w: 50, h: 60, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 280, y1: 100, x2: 280, y2: 260 },
          { x1: 440, y1: 100, x2: 440, y2: 260 },
        ],
        doors: [{ x: 350, y: 178, w: 30, h: 4, label: "D" }],
        hatches: [{ x: 160, y: 160, label: "H" }],
        windows: []
      }
    }
  },

  "Chalet": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "garage_ch", x: 60, y: 60, w: 200, h: 160, label: "Garage", color: "#2a1a1a", site: true },
          { id: "snowmobile", x: 260, y: 60, w: 140, h: 160, label: "Snowmobile", color: "#2a1a1a", site: true },
          { id: "kitchen_ch", x: 400, y: 60, w: 180, h: 120, label: "Kitchen", color: "#1a2a1a", site: true },
          { id: "bar_ch", x: 580, y: 60, w: 160, h: 120, label: "Bar", color: "#1a2a1a", site: true },
          { id: "wine", x: 60, y: 260, w: 180, h: 140, label: "Wine Cellar", color: "#2a2a1a", site: true },
          { id: "trophy", x: 240, y: 260, w: 160, h: 140, label: "Trophy Room", color: "#2a2a1a", site: true },
          { id: "library", x: 400, y: 260, w: 180, h: 140, label: "Library", color: "#1a1a2a" },
          { id: "ski_room", x: 580, y: 260, w: 160, h: 140, label: "Ski Room", color: "#1a2a2a" },
          { id: "ext_front_ch", x: 60, y: 440, w: 680, h: 80, label: "Front Exterior", color: "#111" },
          { id: "stair_ch", x: 370, y: 180, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 60, x2: 260, y2: 220 },
          { x1: 400, y1: 60, x2: 400, y2: 180 },
          { x1: 580, y1: 60, x2: 580, y2: 400 },
          { x1: 60, y1: 240, x2: 740, y2: 240 },
          { x1: 240, y1: 240, x2: 240, y2: 400 },
          { x1: 400, y1: 240, x2: 400, y2: 400 },
        ],
        doors: [
          { x: 150, y: 238, w: 30, h: 4, label: "D" },
          { x: 310, y: 238, w: 30, h: 4, label: "D" },
          { x: 480, y: 238, w: 30, h: 4, label: "D" },
          { x: 630, y: 238, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 150, y: 130, label: "H" },
          { x: 480, y: 300, label: "H" },
        ],
        windows: [
          { x: 58, y: 100, w: 4, h: 30, label: "W" },
          { x: 735, y: 290, w: 4, h: 30, label: "W" },
        ]
      }
    }
  },

  "Oregon": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor", "Tower"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "kitchen_or", x: 60, y: 80, w: 200, h: 140, label: "Kitchen", color: "#2a2a1a", site: true },
          { id: "dining", x: 260, y: 80, w: 160, h: 140, label: "Dining Room", color: "#2a2a1a", site: true },
          { id: "laundry", x: 420, y: 80, w: 140, h: 100, label: "Laundry", color: "#1a2a1a" },
          { id: "garage_or", x: 560, y: 80, w: 180, h: 140, label: "Garage", color: "#111" },
          { id: "kids", x: 60, y: 260, w: 180, h: 140, label: "Kids Dorms", color: "#1a2a2a", site: true },
          { id: "meeting", x: 240, y: 260, w: 180, h: 140, label: "Meeting Room", color: "#1a2a2a", site: true },
          { id: "office_or", x: 420, y: 260, w: 160, h: 140, label: "Office", color: "#1a1a2a", site: true },
          { id: "tower_base", x: 580, y: 260, w: 160, h: 140, label: "Tower Base", color: "#2a1a2a" },
          { id: "ext_or", x: 60, y: 440, w: 680, h: 80, label: "Exterior", color: "#111" },
          { id: "stair_or", x: 220, y: 195, w: 50, h: 70, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 220 },
          { x1: 420, y1: 80, x2: 420, y2: 180 },
          { x1: 560, y1: 80, x2: 560, y2: 220 },
          { x1: 60, y1: 240, x2: 740, y2: 240 },
          { x1: 240, y1: 240, x2: 240, y2: 400 },
          { x1: 420, y1: 240, x2: 420, y2: 400 },
          { x1: 580, y1: 240, x2: 580, y2: 400 },
        ],
        doors: [
          { x: 150, y: 238, w: 30, h: 4, label: "D" },
          { x: 320, y: 238, w: 30, h: 4, label: "D" },
          { x: 480, y: 238, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 150, y: 140, label: "H" },
          { x: 500, y: 310, label: "H" },
        ],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 290, w: 4, h: 30, label: "W" },
        ]
      },
      "Basement": {
        rooms: [
          { id: "supply", x: 60, y: 100, w: 220, h: 160, label: "Supply Room", color: "#2a1a1a", site: true },
          { id: "basement_or", x: 280, y: 100, w: 180, h: 160, label: "Basement", color: "#2a1a1a", site: true },
          { id: "bathroom_or", x: 460, y: 100, w: 140, h: 100, label: "Bathroom", color: "#1a2a2a" },
          { id: "stair_bor", x: 250, y: 240, w: 50, h: 60, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 280, y1: 100, x2: 280, y2: 260 },
          { x1: 460, y1: 100, x2: 460, y2: 200 },
        ],
        doors: [{ x: 350, y: 178, w: 30, h: 4, label: "D" }],
        hatches: [{ x: 160, y: 160, label: "H" }],
        windows: []
      }
    }
  },

  "Coastline": {
    floors: ["Ground Floor", "1st Floor", "Roof"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "hookah", x: 60, y: 80, w: 200, h: 160, label: "Hookah Lounge", color: "#2a1a2a", site: true },
          { id: "service", x: 260, y: 80, w: 160, h: 160, label: "Service Entrance", color: "#2a1a2a", site: true },
          { id: "kitchen_co", x: 420, y: 80, w: 160, h: 120, label: "Kitchen", color: "#1a2a1a" },
          { id: "supply_co", x: 580, y: 80, w: 160, h: 120, label: "Supply", color: "#1a2a1a", site: true },
          { id: "billiard", x: 60, y: 280, w: 180, h: 140, label: "Billiard Room", color: "#1a2a2a", site: true },
          { id: "diving", x: 240, y: 280, w: 160, h: 140, label: "Diving", color: "#1a2a2a", site: true },
          { id: "blue_bar", x: 400, y: 280, w: 180, h: 140, label: "Blue Bar", color: "#1a1a2a" },
          { id: "ext_beach", x: 580, y: 280, w: 160, h: 140, label: "Beach Ext.", color: "#111" },
          { id: "ext_pool", x: 60, y: 460, w: 680, h: 80, label: "Pool Exterior", color: "#111" },
          { id: "stair_co", x: 380, y: 200, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 200 },
          { x1: 580, y1: 80, x2: 580, y2: 420 },
          { x1: 60, y1: 260, x2: 580, y2: 260 },
          { x1: 240, y1: 260, x2: 240, y2: 420 },
          { x1: 400, y1: 260, x2: 400, y2: 420 },
        ],
        doors: [
          { x: 150, y: 258, w: 30, h: 4, label: "D" },
          { x: 310, y: 258, w: 30, h: 4, label: "D" },
          { x: 480, y: 258, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 150, y: 140, label: "H" },
          { x: 460, y: 310, label: "H" },
        ],
        windows: [
          { x: 58, y: 130, w: 4, h: 30, label: "W" },
          { x: 735, y: 100, w: 4, h: 30, label: "W" },
        ]
      },
      "1st Floor": {
        rooms: [
          { id: "vip", x: 60, y: 80, w: 200, h: 160, label: "VIP Lounge", color: "#2a2a1a", site: true },
          { id: "sunrise", x: 260, y: 80, w: 160, h: 160, label: "Sunrise Bar", color: "#2a2a1a", site: true },
          { id: "penthouse", x: 420, y: 80, w: 180, h: 160, label: "Penthouse", color: "#1a2a2a" },
          { id: "bedroom_co", x: 600, y: 80, w: 140, h: 160, label: "Bedroom", color: "#1a1a2a" },
          { id: "stair_co1", x: 380, y: 200, w: 50, h: 60, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 240 },
          { x1: 600, y1: 80, x2: 600, y2: 240 },
        ],
        doors: [{ x: 320, y: 160, w: 30, h: 4, label: "D" }],
        hatches: [{ x: 490, y: 140, label: "H" }],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 120, w: 4, h: 30, label: "W" },
        ]
      }
    }
  },

  "Border": {
    floors: ["Ground Floor", "1st Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "armory_br", x: 60, y: 80, w: 180, h: 160, label: "Armory", color: "#2a1a1a", site: true },
          { id: "cctv_br", x: 240, y: 80, w: 160, h: 160, label: "CCTV Room", color: "#2a1a1a", site: true },
          { id: "supply_br", x: 400, y: 80, w: 160, h: 120, label: "Supply Room", color: "#1a2a1a", site: true },
          { id: "vent", x: 560, y: 80, w: 180, h: 120, label: "Ventilation", color: "#1a2a1a", site: true },
          { id: "bathroom_br", x: 60, y: 280, w: 180, h: 140, label: "Bathroom", color: "#2a2a1a", site: true },
          { id: "tellers_br", x: 240, y: 280, w: 160, h: 140, label: "Tellers", color: "#2a2a1a", site: true },
          { id: "customs", x: 400, y: 280, w: 180, h: 140, label: "Customs", color: "#1a1a2a", site: true },
          { id: "workshop_br", x: 580, y: 280, w: 160, h: 140, label: "Workshop", color: "#1a1a2a", site: true },
          { id: "ext_br", x: 60, y: 460, w: 680, h: 80, label: "Exterior", color: "#111" },
          { id: "stair_br", x: 360, y: 200, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 240, y1: 80, x2: 240, y2: 240 },
          { x1: 400, y1: 80, x2: 400, y2: 200 },
          { x1: 560, y1: 80, x2: 560, y2: 200 },
          { x1: 60, y1: 258, x2: 740, y2: 258 },
          { x1: 240, y1: 258, x2: 240, y2: 420 },
          { x1: 400, y1: 258, x2: 400, y2: 420 },
          { x1: 580, y1: 258, x2: 580, y2: 420 },
        ],
        doors: [
          { x: 140, y: 256, w: 30, h: 4, label: "D" },
          { x: 310, y: 256, w: 30, h: 4, label: "D" },
          { x: 470, y: 256, w: 30, h: 4, label: "D" },
          { x: 630, y: 256, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 140, y: 140, label: "H" },
          { x: 620, y: 310, label: "H" },
        ],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 310, w: 4, h: 30, label: "W" },
        ]
      }
    }
  },

  "Kafe Dostoyevsky": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor", "3rd Floor"],
    defaultFloor: "2nd Floor",
    width: 800, height: 600,
    floors_data: {
      "2nd Floor": {
        rooms: [
          { id: "reading", x: 60, y: 80, w: 220, h: 160, label: "Reading Room", color: "#2a2a1a", site: true },
          { id: "fire_bar", x: 280, y: 80, w: 180, h: 160, label: "Fire Bar", color: "#2a2a1a", site: true },
          { id: "cigar", x: 460, y: 80, w: 160, h: 160, label: "Cigar Room", color: "#1a2a1a" },
          { id: "bar_3f", x: 620, y: 80, w: 120, h: 160, label: "Bar", color: "#1a1a2a" },
          { id: "stair_kafe", x: 430, y: 200, w: 40, h: 60, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 280, y1: 80, x2: 280, y2: 240 },
          { x1: 460, y1: 80, x2: 460, y2: 240 },
          { x1: 620, y1: 80, x2: 620, y2: 240 },
        ],
        doors: [
          { x: 160, y: 160, w: 30, h: 4, label: "D" },
          { x: 355, y: 160, w: 30, h: 4, label: "D" },
        ],
        hatches: [{ x: 540, y: 140, label: "H" }],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 120, w: 4, h: 30, label: "W" },
        ]
      },
      "Ground Floor": {
        rooms: [
          { id: "kitchen_kafe", x: 60, y: 80, w: 200, h: 160, label: "Kitchen", color: "#2a1a1a", site: true },
          { id: "storage_kafe", x: 260, y: 80, w: 160, h: 160, label: "Storage", color: "#2a1a1a", site: true },
          { id: "dining_kafe", x: 420, y: 80, w: 180, h: 160, label: "Dining Hall", color: "#1a2a1a" },
          { id: "front_kafe", x: 60, y: 280, w: 340, h: 140, label: "Front of House", color: "#1a1a2a" },
          { id: "back_kafe", x: 400, y: 280, w: 200, h: 140, label: "Back Area", color: "#1a2a2a" },
          { id: "stair_kgf", x: 390, y: 200, w: 40, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 240 },
          { x1: 60, y1: 258, x2: 600, y2: 258 },
          { x1: 400, y1: 258, x2: 400, y2: 420 },
        ],
        doors: [
          { x: 150, y: 256, w: 30, h: 4, label: "D" },
          { x: 320, y: 256, w: 30, h: 4, label: "D" },
        ],
        hatches: [],
        windows: [{ x: 58, y: 120, w: 4, h: 30, label: "W" }]
      }
    }
  },

  "Kanal": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor"],
    defaultFloor: "1st Floor",
    width: 800, height: 600,
    floors_data: {
      "1st Floor": {
        rooms: [
          { id: "server_k", x: 60, y: 80, w: 180, h: 160, label: "Server Room", color: "#2a1a2a", site: true },
          { id: "security_k", x: 240, y: 80, w: 160, h: 160, label: "Security", color: "#2a1a2a", site: true },
          { id: "bridge", x: 400, y: 120, w: 80, h: 80, label: "Bridge", color: "#333" },
          { id: "coast_guard", x: 480, y: 80, w: 180, h: 160, label: "Coast Guard", color: "#1a2a2a", site: true },
          { id: "map_room", x: 660, y: 80, w: 100, h: 160, label: "Map Room", color: "#1a2a2a", site: true },
          { id: "radar", x: 60, y: 280, w: 200, h: 140, label: "Radar Room", color: "#1a1a2a", site: true },
          { id: "drone_k", x: 260, y: 280, w: 160, h: 140, label: "Drone Ops", color: "#1a1a2a", site: true },
          { id: "armory_k", x: 420, y: 280, w: 160, h: 140, label: "Armory", color: "#2a2a1a", site: true },
          { id: "kitchen_k", x: 580, y: 280, w: 180, h: 140, label: "Kitchen", color: "#2a2a1a", site: true },
          { id: "canal_ext", x: 60, y: 460, w: 680, h: 80, label: "Canal Exterior", color: "#111" },
          { id: "stair_k", x: 400, y: 200, w: 80, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 240, y1: 80, x2: 240, y2: 240 },
          { x1: 400, y1: 80, x2: 400, y2: 120 },
          { x1: 480, y1: 80, x2: 480, y2: 240 },
          { x1: 660, y1: 80, x2: 660, y2: 240 },
          { x1: 60, y1: 258, x2: 740, y2: 258 },
          { x1: 260, y1: 258, x2: 260, y2: 420 },
          { x1: 420, y1: 258, x2: 420, y2: 420 },
          { x1: 580, y1: 258, x2: 580, y2: 420 },
        ],
        doors: [
          { x: 150, y: 256, w: 30, h: 4, label: "D" },
          { x: 330, y: 256, w: 30, h: 4, label: "D" },
          { x: 490, y: 256, w: 30, h: 4, label: "D" },
          { x: 640, y: 256, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 150, y: 140, label: "H" },
          { x: 540, y: 310, label: "H" },
        ],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 310, w: 4, h: 30, label: "W" },
        ]
      }
    }
  },

  "Villa": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "game", x: 60, y: 80, w: 200, h: 160, label: "Game Room", color: "#2a2a1a", site: true },
          { id: "living", x: 260, y: 80, w: 160, h: 160, label: "Living Room", color: "#2a2a1a", site: true },
          { id: "dining_v", x: 420, y: 80, w: 160, h: 120, label: "Dining Room", color: "#1a2a1a", site: true },
          { id: "kitchen_v", x: 580, y: 80, w: 160, h: 120, label: "Kitchen", color: "#1a2a1a", site: true },
          { id: "aviator", x: 60, y: 280, w: 180, h: 140, label: "Aviator Lounge", color: "#1a2a2a", site: true },
          { id: "study", x: 240, y: 280, w: 180, h: 140, label: "Study", color: "#1a2a2a", site: true },
          { id: "courtyard", x: 420, y: 200, w: 160, h: 200, label: "Courtyard", color: "#111" },
          { id: "ext_v", x: 60, y: 460, w: 680, h: 80, label: "Exterior", color: "#111" },
          { id: "stair_v", x: 380, y: 180, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 200 },
          { x1: 580, y1: 80, x2: 580, y2: 200 },
          { x1: 60, y1: 258, x2: 420, y2: 258 },
          { x1: 240, y1: 258, x2: 240, y2: 420 },
        ],
        doors: [
          { x: 150, y: 256, w: 30, h: 4, label: "D" },
          { x: 320, y: 256, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 150, y: 140, label: "H" },
          { x: 490, y: 310, label: "H" },
        ],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 120, w: 4, h: 30, label: "W" },
        ]
      }
    }
  },

  "Outback": {
    floors: ["Ground Floor", "1st Floor", "2nd Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "bar_ob", x: 60, y: 80, w: 200, h: 160, label: "Bar", color: "#2a2a1a", site: true },
          { id: "stage_ob", x: 260, y: 80, w: 160, h: 160, label: "Stage", color: "#2a2a1a", site: true },
          { id: "supply_ob", x: 420, y: 80, w: 160, h: 120, label: "Supply Room", color: "#1a2a1a", site: true },
          { id: "kitchen_ob", x: 580, y: 80, w: 160, h: 120, label: "Kitchen", color: "#1a2a1a", site: true },
          { id: "workshop_ob", x: 60, y: 280, w: 200, h: 140, label: "Workshop", color: "#1a1a2a", site: true },
          { id: "garage_ob", x: 260, y: 280, w: 180, h: 140, label: "Garage", color: "#1a1a2a", site: true },
          { id: "ext_ob", x: 440, y: 280, w: 300, h: 140, label: "Exterior", color: "#111" },
          { id: "ext_ob2", x: 60, y: 460, w: 680, h: 80, label: "Outback Exterior", color: "#111" },
          { id: "stair_ob", x: 380, y: 200, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 200 },
          { x1: 580, y1: 80, x2: 580, y2: 200 },
          { x1: 60, y1: 258, x2: 440, y2: 258 },
          { x1: 260, y1: 258, x2: 260, y2: 420 },
        ],
        doors: [
          { x: 150, y: 256, w: 30, h: 4, label: "D" },
          { x: 330, y: 256, w: 30, h: 4, label: "D" },
        ],
        hatches: [{ x: 480, y: 120, label: "H" }],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 100, w: 4, h: 30, label: "W" },
        ]
      }
    }
  },

  "Skyscraper": {
    floors: ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "Roof"],
    defaultFloor: "2nd Floor",
    width: 800, height: 600,
    floors_data: {
      "2nd Floor": {
        rooms: [
          { id: "bedroom_sk", x: 60, y: 80, w: 200, h: 160, label: "Bedroom", color: "#2a1a2a", site: true },
          { id: "bathroom_sk", x: 260, y: 80, w: 140, h: 160, label: "Bathroom", color: "#2a1a2a", site: true },
          { id: "exhibition", x: 400, y: 80, w: 200, h: 160, label: "Exhibition", color: "#1a2a2a", site: true },
          { id: "office_sk", x: 600, y: 80, w: 140, h: 160, label: "Office", color: "#1a2a2a", site: true },
          { id: "stair_sk", x: 360, y: 200, w: 50, h: 60, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 400, y1: 80, x2: 400, y2: 240 },
          { x1: 600, y1: 80, x2: 600, y2: 240 },
        ],
        doors: [
          { x: 315, y: 160, w: 30, h: 4, label: "D" },
          { x: 490, y: 160, w: 30, h: 4, label: "D" },
        ],
        hatches: [{ x: 150, y: 140, label: "H" }],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 120, w: 4, h: 30, label: "W" },
        ]
      },
      "Ground Floor": {
        rooms: [
          { id: "kitchen_sk", x: 60, y: 80, w: 200, h: 160, label: "Kitchen", color: "#1a2a1a", site: true },
          { id: "bar_sk", x: 260, y: 80, w: 180, h: 160, label: "Bar", color: "#1a2a1a", site: true },
          { id: "penthouse", x: 440, y: 80, w: 200, h: 120, label: "Penthouse Lounge", color: "#2a2a1a", site: true },
          { id: "lounge_sk", x: 440, y: 200, w: 200, h: 80, label: "Lounge", color: "#2a2a1a", site: true },
          { id: "ext_sk", x: 60, y: 280, w: 580, h: 80, label: "Exterior", color: "#111" },
          { id: "stair_skgf", x: 400, y: 180, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 440, y1: 80, x2: 440, y2: 280 },
        ],
        doors: [{ x: 335, y: 160, w: 30, h: 4, label: "D" }],
        hatches: [],
        windows: [{ x: 58, y: 130, w: 4, h: 30, label: "W" }]
      }
    }
  },

  "Theme Park": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "throne", x: 60, y: 80, w: 200, h: 160, label: "Throne Room", color: "#2a1a1a", site: true },
          { id: "armory_tp", x: 260, y: 80, w: 160, h: 160, label: "Armory", color: "#2a1a1a", site: true },
          { id: "bunk", x: 420, y: 80, w: 160, h: 120, label: "Bunk", color: "#1a2a1a", site: true },
          { id: "initiation", x: 580, y: 80, w: 160, h: 120, label: "Initiation Room", color: "#1a2a1a", site: true },
          { id: "cafe_tp", x: 60, y: 280, w: 200, h: 140, label: "Cafe", color: "#1a2a2a", site: true },
          { id: "prize", x: 260, y: 280, w: 180, h: 140, label: "Prize Counter", color: "#1a2a2a", site: true },
          { id: "arcade", x: 440, y: 280, w: 160, h: 140, label: "Arcade", color: "#2a1a2a", site: true },
          { id: "lab_tp", x: 600, y: 280, w: 140, h: 140, label: "Lab", color: "#2a1a2a", site: true },
          { id: "ext_tp", x: 60, y: 460, w: 680, h: 80, label: "Park Exterior", color: "#111" },
          { id: "stair_tp", x: 390, y: 200, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 200 },
          { x1: 580, y1: 80, x2: 580, y2: 200 },
          { x1: 60, y1: 258, x2: 740, y2: 258 },
          { x1: 260, y1: 258, x2: 260, y2: 420 },
          { x1: 440, y1: 258, x2: 440, y2: 420 },
          { x1: 600, y1: 258, x2: 600, y2: 420 },
        ],
        doors: [
          { x: 150, y: 256, w: 30, h: 4, label: "D" },
          { x: 330, y: 256, w: 30, h: 4, label: "D" },
          { x: 510, y: 256, w: 30, h: 4, label: "D" },
          { x: 650, y: 256, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 150, y: 140, label: "H" },
          { x: 520, y: 310, label: "H" },
        ],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 310, w: 4, h: 30, label: "W" },
        ]
      }
    }
  },

  "Lair": {
    floors: ["Basement", "Ground Floor", "1st Floor", "2nd Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "server_l", x: 60, y: 80, w: 200, h: 160, label: "Server Room", color: "#2a1a2a", site: true },
          { id: "control", x: 260, y: 80, w: 160, h: 160, label: "Control Room", color: "#2a1a2a", site: true },
          { id: "lounge_l", x: 420, y: 80, w: 180, h: 120, label: "Lounge", color: "#1a2a1a", site: true },
          { id: "kitchen_l", x: 600, y: 80, w: 140, h: 120, label: "Kitchen", color: "#1a2a1a", site: true },
          { id: "garage_l", x: 60, y: 280, w: 200, h: 140, label: "Garage", color: "#111", site: true },
          { id: "workshop_l", x: 260, y: 280, w: 180, h: 140, label: "Workshop", color: "#1a1a2a", site: true },
          { id: "bio_lab", x: 440, y: 280, w: 180, h: 140, label: "Bio Lab", color: "#1a2a2a", site: true },
          { id: "armory_l", x: 620, y: 280, w: 120, h: 140, label: "Armory", color: "#2a2a1a", site: true },
          { id: "ext_l", x: 60, y: 460, w: 680, h: 80, label: "Exterior", color: "#111" },
          { id: "stair_l", x: 390, y: 200, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 200 },
          { x1: 600, y1: 80, x2: 600, y2: 200 },
          { x1: 60, y1: 258, x2: 740, y2: 258 },
          { x1: 260, y1: 258, x2: 260, y2: 420 },
          { x1: 440, y1: 258, x2: 440, y2: 420 },
          { x1: 620, y1: 258, x2: 620, y2: 420 },
        ],
        doors: [
          { x: 150, y: 256, w: 30, h: 4, label: "D" },
          { x: 330, y: 256, w: 30, h: 4, label: "D" },
          { x: 510, y: 256, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 150, y: 140, label: "H" },
          { x: 530, y: 310, label: "H" },
        ],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 310, w: 4, h: 30, label: "W" },
        ]
      }
    }
  },

  "Nighthaven Labs": {
    floors: ["Basement", "Ground Floor", "1st Floor", "Roof"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "server_nl", x: 60, y: 80, w: 200, h: 160, label: "Server Room", color: "#1a2a3a", site: true },
          { id: "security_nl", x: 260, y: 80, w: 160, h: 160, label: "Security", color: "#1a2a3a", site: true },
          { id: "labs", x: 420, y: 80, w: 180, h: 160, label: "Labs", color: "#2a1a2a", site: true },
          { id: "testing", x: 600, y: 80, w: 140, h: 160, label: "Testing Room", color: "#2a1a2a", site: true },
          { id: "armory_nl", x: 60, y: 280, w: 200, h: 140, label: "Armory", color: "#2a2a1a", site: true },
          { id: "cafeteria_nl", x: 260, y: 280, w: 180, h: 140, label: "Cafeteria", color: "#2a2a1a", site: true },
          { id: "storage_nl", x: 440, y: 280, w: 180, h: 140, label: "Storage", color: "#1a2a1a", site: true },
          { id: "ext_nl", x: 620, y: 280, w: 120, h: 140, label: "Exterior", color: "#111" },
          { id: "ext_nl2", x: 60, y: 460, w: 680, h: 80, label: "Exterior", color: "#111" },
          { id: "stair_nl", x: 385, y: 200, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 240 },
          { x1: 600, y1: 80, x2: 600, y2: 240 },
          { x1: 60, y1: 258, x2: 620, y2: 258 },
          { x1: 260, y1: 258, x2: 260, y2: 420 },
          { x1: 440, y1: 258, x2: 440, y2: 420 },
        ],
        doors: [
          { x: 150, y: 256, w: 30, h: 4, label: "D" },
          { x: 330, y: 256, w: 30, h: 4, label: "D" },
          { x: 510, y: 256, w: 30, h: 4, label: "D" },
        ],
        hatches: [
          { x: 150, y: 140, label: "H" },
          { x: 530, y: 310, label: "H" },
        ],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 618, y: 310, w: 4, h: 30, label: "W" },
        ]
      }
    }
  },

  "Emerald Plains": {
    floors: ["Basement", "Ground Floor", "1st Floor"],
    defaultFloor: "Ground Floor",
    width: 800, height: 600,
    floors_data: {
      "Ground Floor": {
        rooms: [
          { id: "dining_ep", x: 60, y: 80, w: 200, h: 160, label: "Dining Room", color: "#1a2a1a", site: true },
          { id: "study_ep", x: 260, y: 80, w: 160, h: 160, label: "Study", color: "#1a2a1a", site: true },
          { id: "bar_ep", x: 420, y: 80, w: 180, h: 120, label: "Bar", color: "#2a2a1a", site: true },
          { id: "pantry", x: 600, y: 80, w: 140, h: 120, label: "Pantry", color: "#2a2a1a", site: true },
          { id: "garage_ep", x: 60, y: 280, w: 200, h: 140, label: "Garage", color: "#111", site: true },
          { id: "living_ep", x: 260, y: 280, w: 180, h: 140, label: "Living Room", color: "#1a1a2a", site: true },
          { id: "ext_ep", x: 440, y: 280, w: 300, h: 140, label: "Exterior", color: "#111" },
          { id: "ext_ep2", x: 60, y: 460, w: 680, h: 80, label: "Exterior", color: "#111" },
          { id: "stair_ep", x: 390, y: 200, w: 50, h: 80, label: "Stairs", color: "#333" },
        ],
        walls: [
          { x1: 260, y1: 80, x2: 260, y2: 240 },
          { x1: 420, y1: 80, x2: 420, y2: 200 },
          { x1: 600, y1: 80, x2: 600, y2: 200 },
          { x1: 60, y1: 258, x2: 440, y2: 258 },
          { x1: 260, y1: 258, x2: 260, y2: 420 },
        ],
        doors: [
          { x: 150, y: 256, w: 30, h: 4, label: "D" },
          { x: 330, y: 256, w: 30, h: 4, label: "D" },
        ],
        hatches: [{ x: 490, y: 120, label: "H" }],
        windows: [
          { x: 58, y: 120, w: 4, h: 30, label: "W" },
          { x: 735, y: 100, w: 4, h: 30, label: "W" },
        ]
      }
    }
  }
};
