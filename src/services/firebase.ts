import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export interface AppStats {
  visits: number;
  scans: Record<string, number>;
}

const GLOBAL_STATS_DOC = 'analytics/global';

export const subscribeToStats = (callback: (stats: AppStats) => void) => {
  return onSnapshot(doc(db, GLOBAL_STATS_DOC), (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as AppStats);
    } else {
      // Initialize if doesn't exist
      const initialStats: AppStats = { visits: 0, scans: {} };
      setDoc(doc(db, GLOBAL_STATS_DOC), initialStats);
      callback(initialStats);
    }
  }, (error) => {
    console.error("Error subscribing to stats:", error);
  });
};

export const incrementVisit = async () => {
  const statsRef = doc(db, GLOBAL_STATS_DOC);
  try {
    const snap = await getDoc(statsRef);
    if (!snap.exists()) {
      await setDoc(statsRef, { visits: 1, scans: {} });
    } else {
      await updateDoc(statsRef, {
        visits: increment(1)
      });
    }
  } catch (error) {
    console.error("Error incrementing visit:", error);
  }
};

export const incrementScan = async (deviceId: string) => {
  const statsRef = doc(db, GLOBAL_STATS_DOC);
  try {
    const snap = await getDoc(statsRef);
    if (!snap.exists()) {
      await setDoc(statsRef, { visits: 0, scans: { [deviceId]: 1 } });
    } else {
      await updateDoc(statsRef, {
        [`scans.${deviceId}`]: increment(1)
      });
    }
  } catch (error) {
    console.error("Error incrementing scan:", error);
  }
};
