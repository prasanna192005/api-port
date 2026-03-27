import fs from 'fs/promises';
import path from 'path';

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get list of projects
 *     description: Returns a list of projects or a single project by ID if ?id= is provided.
 *     responses:
 *       200:
 *         description: Projects data
 */
import { trackRequest, getPortfolioData } from "./_tracker.js";

export default async function handler(req, res) {
  await trackRequest('/projects');
  try {
    const filePath = path.join(process.cwd(), 'data', 'projects.json');
    const localData = JSON.parse(await fs.readFile(filePath, 'utf8'));
    
    // Fetch from Firestore, fallback to local JSON
    const data = await getPortfolioData("configs", "projects", localData);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    
    // Check if an ID was passed in query or path (rewrites)
    // The rewrite passes /projects/:id, but Vercel exposes it via req.query.id
    const { id } = req.query;
    
    if (id) {
      const project = data.find(p => p.id === parseInt(id, 10));
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(200).json(project);
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read data' });
  }
}
