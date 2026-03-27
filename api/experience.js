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
import { trackRequest, getPortfolioData } from "./_tracker.js";

export default async function handler(req, res) {
  await trackRequest('/experience');
  try {
    const filePath = path.join(process.cwd(), 'data', 'experience.json');
    const localData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    // Fetch from Firestore, fallback to local JSON
    const data = await getPortfolioData("configs", "experience", localData);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
}
