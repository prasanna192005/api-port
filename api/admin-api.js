import { doc, getDoc, getDocs, collection, query, limit, orderBy } from "firebase/firestore/lite";
import { db } from "./_firebase.js";
import { updatePortfolioData, sendPrettyJSON } from "./_tracker.js";
import fs from "node:fs/promises";
import path from "node:path";

export default async function handler(req, res) {
  const passcode = req.headers['x-admin-passcode'] || req.query.passcode || '';
  const adminPasscode = process.env.ADMIN_PASSCODE ? String(process.env.ADMIN_PASSCODE).trim() : '846884';

  if (passcode.trim() !== adminPasscode) {
    return sendPrettyJSON(res, { 
      error: 'Unauthorized: Invalid passcode.',
      _debug: { 
        received: passcode, 
        expected: "Check your terminal logs for the expected value",
        env_status: process.env.ADMIN_PASSCODE ? 'Set' : 'Using Fallback'
      }
    }, 401);
  }

  const { action } = req.query;

  try {
    if (req.method === 'GET') {
      if (action === 'getStats') {
        const statsRef = doc(db, "admin", "stats");
        const statsDoc = await getDoc(statsRef);
        
        // Also get daily stats for a simple chart
        const dailyQuery = query(collection(db, "admin"), orderBy("date", "desc"), limit(7));
        const dailyDocs = await getDocs(dailyQuery);
        const history = [];
        dailyDocs.forEach(docSnap => {
          if (docSnap.id.startsWith('stats_')) history.push(docSnap.data());
        });

        return sendPrettyJSON(res, {
          stats: statsDoc.exists() ? statsDoc.data() : { total_visitors: 0, endpoints: {} },
          history
        });
      }

      if (action === 'getConfigs') {
        const dataDir = path.join(process.cwd(), 'data');
        const files = await fs.readdir(dataDir);
        const configs = {};

        for (const file of files) {
          if (file.endsWith('.json')) {
            const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
            const key = file.replace('.json', '');
            
            // Check Firestore for the "live" version
            const docRef = doc(db, "configs", key);
            const docSnap = await getDoc(docRef);
            configs[file] = docSnap.exists() ? docSnap.data().content : JSON.parse(content);
          }
        }

        return sendPrettyJSON(res, { configs });
      }
    }

    if (req.method === 'POST') {
      const { action: postAction, fileName, content } = req.body;

      if (postAction === 'updateConfig') {
        const key = fileName.replace('.json', '');
        
        // SECURITY: Ensure we only write to the data directory and only .json files
        if (!fileName.endsWith('.json') || fileName.includes('..')) {
          return sendPrettyJSON(res, { error: 'Invalid file name.' }, 400);
        }

        // 1. Sync to Firestore (for production persistence)
        await updatePortfolioData("configs", key, content);

        // 2. Try to update local file (for local dev parity)
        try {
          const filePath = path.join(process.cwd(), 'data', fileName);
          await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
        } catch (e) {
          console.warn("Could not save to local filesystem (likely production). Changes are live in Firestore.");
        }

        return sendPrettyJSON(res, { message: `Successfully updated ${fileName} in Firestore and local storage.` });
      }
    }

    sendPrettyJSON(res, { error: 'Invalid action or method.' }, 400);

  } catch (error) {
    console.error("Admin API error:", error);
    sendPrettyJSON(res, { error: 'Internal server error.', details: error.message }, 500);
  }
}
