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
export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'me.json');
    const data = await fs.readFile(filePath, 'utf8');
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
}
