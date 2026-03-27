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
export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'experience.json');
    const data = await fs.readFile(filePath, 'utf8');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
}
