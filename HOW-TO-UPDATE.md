# How to Update the R6 Strat Board App

This guide covers everything you need to update the app yourself —
no coding experience required beyond copy-pasting.

---

## How GitHub updates work

Every time you change a file in your GitHub repository, GitHub Pages
automatically rebuilds and deploys the app within 1-2 minutes.

The process is always:
1. Open the file on GitHub
2. Click the pencil (edit) icon
3. Make your changes
4. Click **Commit changes**
5. Wait 1-2 minutes, then refresh the app

---

## Adding a new map

Open `js/data.js` on GitHub.

Find the `MAPS` object near the top. Add a new entry following this pattern:

```js
"New Map Name": {
  sites: ["Site 1 / Site 2", "Site 3 / Site 4", "Site 5 / Site 6", "Site 7 / Site 8"],
  floors: ["Basement", "Ground Floor", "1st Floor"],
  category: "ranked"   // or "pro" for pro league maps
},
```

The sites array should list all bomb sites for that map.
Commit the change — the map will appear everywhere in the app automatically.

Then open `js/maps.js` and add a schematic entry for the map following
the same pattern as the existing maps. Copy an existing simple map entry
and rename the rooms to match the new map.

---

## Adding a new operator

Open `js/data.js` on GitHub.

Find the `ATTACK_OPERATORS` or `DEFENSE_OPERATORS` array.
Add the operator name as a string in alphabetical order:

```js
export const ATTACK_OPERATORS = [
  "Ace","Ash","Azami", // ...
  "New Operator",      // add here in alphabetical order
  // ...
];
```

Commit — the operator appears in all dropdowns automatically.

---

## Updating meta reference data (each season)

Open `js/data.js` on GitHub.

Find the `META` object. Each map has sites, and each site has:
- `atk` — array of attack operators with name, role, and desc
- `def` — array of defense operators
- `setup` — the setup description text
- `tip` — the pro tip text
- `suggestedAtkBans` — array of suggested attack bans
- `suggestedDefBans` — array of suggested defense bans

Update any of these values to reflect the current season meta.

Example — changing an operator's description:
```js
{ name: "Ace", role: "Hard breacher", desc: "Updated description here." },
```

---

## Adding meta data for a new site

In `js/data.js`, find the `META` object and add a new site entry
inside the map:

```js
"Clubhouse": {
  "New Site / Room": {
    atk: [
      { name: "Ace", role: "Hard breacher", desc: "Description..." },
      // up to 5 operators
    ],
    def: [
      { name: "Mira", role: "Anchor", desc: "Description..." },
      // up to 5 operators
    ],
    setup: "Setup instructions here...",
    tip: "Pro tip here...",
    suggestedAtkBans: ["Mira", "Bandit"],
    suggestedDefBans: ["Thatcher", "Ace"]
  },
  // existing sites...
},
```

---

## Updating the competitive map pool

In `js/data.js`, each map in the `MAPS` object has a `category` field:
- `"pro"` — appears highlighted as a pro league map
- `"ranked"` — standard ranked map

To move a map from ranked to pro league (or back):
```js
"Fortress": {
  sites: [...],
  floors: [...],
  category: "pro"   // change from "ranked" to "pro"
},
```

---

## Pushing updates from your computer (advanced)

If you prefer editing files locally rather than on GitHub:

1. Install Git: https://git-scm.com
2. Clone your repo: `git clone https://github.com/YOUR-USERNAME/r6-strat-board.git`
3. Edit files locally
4. Run:
   ```
   git add .
   git commit -m "Update: describe what you changed"
   git push
   ```
5. GitHub Pages updates automatically

---

## Backing up your data

Your strats, match logs, and team data live in Firebase Firestore.
To export a backup:
1. Go to Firebase console → Firestore Database
2. Click the three dots (⋮) menu → **Export data**
3. Follow the prompts to export to Google Cloud Storage

Do this monthly if you're logging lots of matches.

---

## Questions

If something breaks or you want to add a feature not covered here,
bring the question to Claude with the relevant file content and
describe what you want to change.
