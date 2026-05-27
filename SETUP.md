# R6 Strat Board — Setup Guide (Full App)

## What you have
A complete collaborative web app with:
- Individual accounts (email/password login)
- Hierarchical strat system (map → side → folders → strats)
- Operator role cards with setup notes per operator
- Match logging with K/D/A and KOST tracking per player
- Stats dashboard — win rates by map, strat, side; player KOST%
- Team Hub — Meta reference, shared notes, per-map notes, ban planner
- Interactive map planner — all 16 maps with SVG schematics, drag/drop operators and gadgets, arrow/line drawing tools, real-time team sync
- Team roster (auto-populated from registered accounts)
- PWA — installs to phone home screen

---

## Step 1 — Firebase project setup

### Create project
1. Go to https://console.firebase.google.com
2. Click **Add project**, name it `r6-strat-board`
3. Click through the setup wizard

### Enable Authentication
1. Left sidebar → **Authentication** → **Get started**
2. **Sign-in method** tab → **Email/Password** → Enable → Save

### Create Firestore Database
1. Left sidebar → **Firestore Database** → **Create database**
2. Choose **Start in test mode**
3. Pick location: **nam5** (US multi-region) or closest to you
4. Click **Enable** / **Create**

### Set Firestore Security Rules
In Firestore → **Rules** tab, replace ALL content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click **Publish**.

### Get your Firebase config
1. Go to **Project Overview** (top of left sidebar)
2. Click the **web icon** `</>` to add a web app
3. Name it anything, click **Register app**
4. Copy the `firebaseConfig` object shown

---

## Step 2 — Add Firebase config to the app

Open `js/firebase-config.js` in Notepad or any text editor.

Replace the placeholder values with your real Firebase config:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "r6-strat-board.firebaseapp.com",
  projectId: "r6-strat-board",
  storageBucket: "r6-strat-board.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Save the file.

---

## Step 3 — Upload to GitHub and enable GitHub Pages

### Create GitHub account
Go to https://github.com and sign up (free).

### Create repository
1. Click **+** → **New repository**
2. Name it `r6-strat-board`
3. Set to **Public**
4. Click **Create repository**

### Upload files
1. On the repository page, click **uploading an existing file**
2. Drag ALL files and folders from the unzipped folder:
   - `index.html`
   - `manifest.json`
   - `css/` folder
   - `js/` folder (contains `app.js`, `data.js`, `maps.js`, `mapplanner.js`, `firebase-config.js`)
3. Click **Commit changes**

### Enable GitHub Pages
1. Repository **Settings** tab
2. Left sidebar → **Pages**
3. Source: **Deploy from a branch**
4. Branch: **main**, folder: **/ (root)**
5. Click **Save**

Your app will be live at:
`https://YOUR-USERNAME.github.io/r6-strat-board/`

---

## Step 4 — Share with your team

Send the URL to your teammates. They:
1. Open it in browser
2. Click **Create Account** and register with their callsign
3. Start using immediately

On mobile: **Share → Add to Home Screen** (iOS Safari) or browser menu → **Add to Home Screen** (Android) to install as an app.

---

## Firebase free tier limits

The free Spark plan includes:
- 50,000 reads/day, 20,000 writes/day
- 1GB stored data, 10GB bandwidth/month

A team of 10 people will never approach these limits.

---

## Troubleshooting

**Blank page / nothing loads**
→ Open browser DevTools (F12) → Console. If you see a Firebase error, check your config values in `js/firebase-config.js`.

**"Missing or insufficient permissions"**
→ Firestore security rules weren't set correctly. Re-do the Rules section in Step 1.

**Map planner not saving**
→ You need to add `map_plans` as an allowed collection. The security rules above already cover it — just make sure they were published.

**Friends can't log in**
→ Make sure Email/Password auth is enabled in Firebase → Authentication → Sign-in method.

---

## How to update the app

See `HOW-TO-UPDATE.md` for a full guide on adding maps, operators, updating meta data, and pushing changes to GitHub.
