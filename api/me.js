import fs from 'fs/promises';
import path from 'path';

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get profile information
 *     description: Returns bio, skills, and availability.
 *     responses:
 *       200:
 *         description: Profile data
 */
import { trackRequest, getPortfolioData, sendPrettyJSON } from "./_tracker.js";

export default async function handler(req, res) {
  await trackRequest('/me');
  try {
    const filePath = path.join(process.cwd(), 'data', 'me.json');
    const localData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    // Fetch from Firestore, fallback to local JSON
    const data = await getPortfolioData("configs", "me", localData);
    
    sendPrettyJSON(req, res, data);
  } catch (error) {
    sendPrettyJSON(req, res, { error: 'Failed to read data' }, 500);
  }
}
