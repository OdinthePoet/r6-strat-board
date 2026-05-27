# R6 Strat Board — Setup Guide

## What you have
A complete web app with:
- Individual accounts (email/password login)
- Meta reference (pro picks per site, Y11S1)
- Strat builder with real-time sync
- Team comp planner
- Map blueprint planner (via Siegegg.com)
- Activity feed
- PWA — installs to phone home screen

---

## Step 1 — Create your Firebase project (5 minutes)

1. Go to https://console.firebase.google.com
2. Click **Add project**, name it `r6-strat-board`, click through the setup
3. On the project dashboard, click the **web icon** `</>` to add a web app
4. Name it anything (e.g. "r6-strat-board-web"), click **Register app**
5. You'll see a `firebaseConfig` block. Copy it — you need it in Step 3.

---

## Step 2 — Enable Firebase services

Still in Firebase console:

### Authentication
1. Left sidebar → **Authentication** → **Get started**
2. **Sign-in method** tab → **Email/Password** → Enable → Save

### Firestore Database
1. Left sidebar → **Firestore Database** → **Create database**
2. Choose **Start in test mode** (fine for personal use)
3. Pick a location close to you (e.g. us-central1)
4. Click **Enable**

### Firestore Security Rules (important)
In Firestore → **Rules** tab, replace the content with:

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

Click **Publish**. This ensures only logged-in users can read/write data.

---

## Step 3 — Add your Firebase config to the app

Open `js/firebase-config.js` in any text editor (Notepad works).

Replace the placeholder values with your actual config from Step 1:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",           // your actual key
  authDomain: "r6-strat-board.firebaseapp.com",
  projectId: "r6-strat-board",
  storageBucket: "r6-strat-board.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Save the file.

---

## Step 4 — Host it on GitHub Pages (free)

### Create a GitHub account
Go to https://github.com and sign up (free).

### Create a repository
1. Click **+** → **New repository**
2. Name it `r6-strat-board` (or anything you like)
3. Set it to **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Upload your files
1. On the repository page, click **uploading an existing file**
2. Drag ALL the files and folders from your r6stratboard folder into the upload area:
   - `index.html`
   - `manifest.json`
   - `css/` folder
   - `js/` folder
3. Click **Commit changes**

### Enable GitHub Pages
1. Go to your repository **Settings** tab
2. Left sidebar → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Branch: **main**, folder: **/ (root)**
5. Click **Save**

After a minute or two, your app will be live at:
`https://YOUR-USERNAME.github.io/r6-strat-board/`

---

## Step 5 — Share with your team

Send your friends that URL. They:
1. Open it in their browser
2. Click **Create Account** and register
3. Start using the app immediately

On mobile, they can tap **Share → Add to Home Screen** in Safari (iOS) or the browser menu (Android) to install it like an app.

---

## Updating the app later

When you want to add maps, fix something, or add features:
1. Edit the files locally
2. Go to your GitHub repository
3. Click on the file you want to update → edit → commit
4. GitHub Pages updates automatically within a minute

---

## Firebase free tier limits

Firebase's free Spark plan includes:
- 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day
- 1GB stored data
- 10GB bandwidth/month

For a team of up to 10 people using this app, you will never come close to these limits.

---

## Troubleshooting

**"Firebase: Error (auth/configuration-not-found)"**
→ Your firebase-config.js still has the placeholder values. Re-check Step 3.

**Blank page / app not loading**
→ Open browser DevTools (F12) → Console tab. Share the error message.

**"Missing or insufficient permissions"**
→ Firestore security rules weren't set. Re-do the Rules section in Step 2.

**Friends can't log in / register**
→ Make sure Email/Password auth is enabled in Firebase (Step 2).
