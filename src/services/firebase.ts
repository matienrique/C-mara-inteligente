import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, onSnapshot, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface AppStats {
  visits: number;
  scans: Record<string, number>;
}

const GLOBAL_STATS_DOC = 'analytics/global';

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connection established");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Client is offline.");
    } else {
      console.error("Firebase connection test failed:", error);
    }
  }
}
testConnection();

export const subscribeToStats = (callback: (stats: AppStats) => void) => {
  const statsRef = doc(db, GLOBAL_STATS_DOC);
  return onSnapshot(statsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as AppStats);
    } else {
      // Document doesn't exist, provide empty state but don't force write here to avoid loops
      callback({ visits: 0, scans: {} });
    }
  }, (error) => {
    console.error("Error subscribing to stats:", error);
  });
};

export const incrementVisit = async () => {
  const statsRef = doc(db, GLOBAL_STATS_DOC);
  try {
    // Use setDoc with merge and increment for atomicity even on first creation
    await setDoc(statsRef, { 
      visits: increment(1) 
    }, { merge: true });
  } catch (error) {
    console.error("Error incrementing visit:", error);
  }
};

export const incrementScan = async (deviceId: string) => {
  const statsRef = doc(db, GLOBAL_STATS_DOC);
  try {
    // Using a dynamic key with increment in setDoc merge mode is safe
    await setDoc(statsRef, {
      scans: {
        [deviceId]: increment(1)
      }
    }, { merge: true });
  } catch (error) {
    console.error("Error incrementing scan:", error);
  }
};
