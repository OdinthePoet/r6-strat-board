// ============================================================
// FIREBASE CONFIGURATION
// ============================================================
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (e.g. "r6-strat-board")
// 3. Click "Add app" > Web app icon </>
// 4. Register the app, then copy your firebaseConfig object
// 5. Replace the placeholder values below with your real config
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {

  apiKey: "AIzaSyDnZaiTjuFMCPpL-uoKqmniKeLUr4lxyZY",

  authDomain: "r6-strat-board.firebaseapp.com",

  projectId: "r6-strat-board",

  storageBucket: "r6-strat-board.firebasestorage.app",

  messagingSenderId: "96645747316",

  appId: "1:96645747316:web:da9cb82c8f80321d51f721",

  measurementId: "G-K4MHCR1TB9"

};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
