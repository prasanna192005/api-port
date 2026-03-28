import { doc, getDoc, setDoc, increment, serverTimestamp } from "firebase/firestore/lite";
import { db } from "./_firebase.js";

/**
 * Tracks a request to a specific endpoint.
 */
export async function trackRequest(endpoint) {
  try {
    const statsRef = doc(db, "admin", "stats");
    const today = new Date().toISOString().split('T')[0];
    const dailyRef = doc(db, "admin", `stats_${today}`);

    // Update global stats
    await setDoc(statsRef, {
      total_visitors: increment(1),
      [`endpoints.${endpoint.replace(/\//g, '_')}`]: increment(1),
      last_activity: new Date().toISOString() // serverTimestamp() can be tricky in some Lite versions, ISO is safer
    }, { merge: true });

    // Update daily stats for the chart
    await setDoc(dailyRef, {
      hits: increment(1),
      date: today,
      last_updated: new Date().toISOString()
    }, { merge: true });

  } catch (error) {
    console.error("Error tracking request:", error);
  }
}

/**
 * Gets portfolio data from Firestore or falls back to local JSON.
 */
export async function getPortfolioData(collectionName, key, fallbackData) {
  try {
    const docRef = doc(db, collectionName, key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().content;
    }
  } catch (error) {
    console.error(`Error fetching \${key} from Firestore:`, error);
  }
  return fallbackData;
}

/**
 * Updates portfolio data in Firestore.
 */
export async function updatePortfolioData(collectionName, key, data) {
  const docRef = doc(db, collectionName, key);
  await setDoc(docRef, {
    content: data,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Sends a pretty-printed JSON response.
 */
export function sendPrettyJSON(res, data, status = 200) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).send(JSON.stringify(data, null, 2));
}
