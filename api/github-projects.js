/**
 * @swagger
 * /projects/all:
 *   get:
 *     summary: Get all live GitHub projects
 *     description: Fetches all repositories directly from the GitHub API.
 *     responses:
 *       200:
 *         description: Array of all public repositories
 */
import { trackRequest, sendPrettyJSON } from "./_tracker.js";

export default async function handler(req, res) {
  await trackRequest('/projects/all');

  const githubUser = 'prasanna192005';
  const token = process.env.GITHUB_TOKEN;

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'api-portfolio',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const reposRes = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100&sort=updated`, { headers });
    
    if (!reposRes.ok) {
      throw new Error('Failed to fetch from GitHub API');
    }
    
    const reposData = await reposRes.json();
    
    // Map the GitHub format to a simpler portfolio format
    const formattedProjects = reposData.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      live: repo.homepage || null,
      stars: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics || [],
      updatedAt: repo.updated_at
    }));

    sendPrettyJSON(res, formattedProjects);
  } catch (error) {
    sendPrettyJSON(res, { 
      error: 'Failed to fetch github projects', 
      details: error.message 
    }, 500);
  }
}
