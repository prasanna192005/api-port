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
export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'data', 'contact.json');
    const data = await fs.readFile(filePath, 'utf8');
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
}
