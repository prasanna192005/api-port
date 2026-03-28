import fs from 'fs/promises';
import path from 'path';

/**
 * @swagger
 * /now:
 *   get:
 *     summary: Get current status
 *     description: Returns what Prasanna is currently working on.
 *     responses:
 *       200:
 *         description: Current status data
 */
import { trackRequest, getPortfolioData, sendPrettyJSON } from "./_tracker.js";

export default async function handler(req, res) {
  await trackRequest('/now');
  try {
    const filePath = path.join(process.cwd(), 'data', 'now.json');
    const localData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    // Fetch from Firestore, fallback to local JSON
    const data = await getPortfolioData("configs", "now", localData);
    
    sendPrettyJSON(res, data);
  } catch (error) {
    sendPrettyJSON(res, { error: 'Failed to read data' }, 500);
  }
}
