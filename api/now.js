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
export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'now.json');
    const data = await fs.readFile(filePath, 'utf8');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
}
