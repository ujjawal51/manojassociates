/**
 * Firebase Configuration & Realtime Database Bridge
 * Manoj Associates Admin & Homepage Sync
 */

const FIREBASE_ACTIVE = true;

const firebaseConfig = {
  apiKey: "AIzaSyBbbVQ4DaKKmR0Lj3bWdCRv4FKFwmIS0uw",
  authDomain: "manojassociates-a1135.firebaseapp.com",
  databaseURL: "https://manojassociates-a1135-default-rtdb.firebaseio.com",
  projectId: "manojassociates-a1135",
  storageBucket: "manojassociates-a1135.firebasestorage.app",
  messagingSenderId: "637740702420",
  appId: "1:637740702420:web:af8f126496a77146e4b941"
};

// Initialize Firebase
let fbApp = null;
let fbDb = null;

try {
  if (FIREBASE_ACTIVE && typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    if (!firebase.apps || !firebase.apps.length) {
      fbApp = firebase.initializeApp(firebaseConfig);
    } else {
      fbApp = firebase.app();
    }
    fbDb = firebase.database();
    console.log("✅ Firebase Realtime Database connected successfully for manojassociates-a1135.");
  }
} catch (e) {
  console.warn("Firebase initialization warning (fallback to local):", e);
}

// Helper to normalize Firebase object / array structures
function toArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') return Object.values(val);
  return [];
}

/**
 * Universal Cloud Storage Layer (Firebase + localStorage fallback)
 */
const CloudDB = {
  isCloudReady() {
    return fbDb !== null;
  },

  // Listen to live database changes across all devices/browsers in real-time
  listen(path, callback) {
    if (this.isCloudReady()) {
      try {
        fbDb.ref(path).on('value', (snapshot) => {
          const data = snapshot.val();
          callback(data);
        }, (error) => {
          console.error("Firebase listen error on path " + path, error);
        });
      } catch (err) {
        console.warn("Firebase listen attach error:", err);
      }
    }
  },

  // Read once from Firebase, fallback to localStorage
  async get(key, fallbackLocalKey) {
    if (this.isCloudReady()) {
      try {
        const snapshot = await fbDb.ref(key).once('value');
        let val = snapshot.val();
        if (val !== null && val !== undefined) {
          if (key === 'ma_applications' || key === 'ma_requirements') {
            val = toArray(val);
          }
          localStorage.setItem(fallbackLocalKey || key, JSON.stringify(val));
          return val;
        }
      } catch (err) {
        console.warn("Cloud read error, using local fallback:", err);
      }
    }
    try {
      let localVal = JSON.parse(localStorage.getItem(fallbackLocalKey || key));
      if (key === 'ma_applications' || key === 'ma_requirements') {
        localVal = toArray(localVal);
      }
      return localVal;
    } catch {
      return (key === 'ma_applications' || key === 'ma_requirements') ? [] : null;
    }
  },

  // Save to Firebase and localStorage simultaneously
  async set(key, val, fallbackLocalKey) {
    // 1. Save local
    localStorage.setItem(fallbackLocalKey || key, JSON.stringify(val));
    localStorage.setItem('ma_last_updated', Date.now().toString());

    // 2. Save cloud
    if (this.isCloudReady()) {
      try {
        await fbDb.ref(key).set(val);
        await fbDb.ref('last_updated').set(Date.now());
        console.log(`Cloud database updated: ${key}`);
      } catch (err) {
        console.error("Cloud save error on " + key + ":", err);
      }
    }
  },

  // Submit candidate application safely to Cloud and Local
  async submitApplication(appData) {
    // 1. Save locally
    let currentApps = [];
    try {
      currentApps = toArray(JSON.parse(localStorage.getItem('ma_applications')));
    } catch {
      currentApps = [];
    }
    currentApps.unshift(appData);
    localStorage.setItem('ma_applications', JSON.stringify(currentApps));
    localStorage.setItem('ma_last_updated', Date.now().toString());

    // 2. Save to Cloud
    if (this.isCloudReady()) {
      try {
        // Fetch latest list from Cloud first to prevent overwriting
        const snap = await fbDb.ref('ma_applications').once('value');
        let cloudList = toArray(snap.val());
        cloudList.unshift(appData);
        await fbDb.ref('ma_applications').set(cloudList);
        await fbDb.ref('last_updated').set(Date.now());
        console.log("✅ Candidate application synced to Firebase cloud successfully.");
      } catch (e) {
        console.error("Cloud application submit error:", e);
      }
    }
  }
};
