import fs from 'fs/promises';
import path from 'path';

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Get contact info
 *     description: Returns contact details (email, GitHub, LinkedIn, Twitter).
 *     responses:
 *       200:
 *         description: Contact data
 */
import { trackRequest, getPortfolioData, sendPrettyJSON } from "./_tracker.js";

export default async function handler(req, res) {
  await trackRequest('/contact');
  try {
    const filePath = path.join(process.cwd(), 'data', 'contact.json');
    const localData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    // Fetch from Firestore, fallback to local JSON
    const data = await getPortfolioData("configs", "contact", localData);
    
    sendPrettyJSON(res, data);
  } catch (error) {
    sendPrettyJSON(res, { error: 'Failed to read data' }, 500);
  }
}
