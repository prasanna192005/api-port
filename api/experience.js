import fs from 'fs/promises';
import path from 'path';

/**
 * @swagger
 * /experience:
 *   get:
 *     summary: Get work experience
 *     description: Returns work/internship history as an array.
 *     responses:
 *       200:
 *         description: Array of experiences
 */
import { trackRequest, getPortfolioData, sendPrettyJSON } from "./_tracker.js";

export default async function handler(req, res) {
  await trackRequest('/experience');
  try {
    const filePath = path.join(process.cwd(), 'data', 'experience.json');
    const localData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    // Fetch from Firestore, fallback to local JSON
    const data = await getPortfolioData("configs", "experience", localData);
    
    sendPrettyJSON(res, data);
  } catch (error) {
    sendPrettyJSON(res, { error: 'Failed to read data' }, 500);
  }
}
