/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Get live GitHub stats
 *     description: Fetches live data from GitHub API
 *     responses:
 *       200:
 *         description: Stats data
 */
import { trackRequest, sendPrettyJSON } from "./_tracker.js";

export default async function handler(req, res) {
  await trackRequest('/stats');

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
    // Fetch user details
    const userRes = await fetch(`https://api.github.com/users/${githubUser}`, { headers });
    
    if (!userRes.ok) {
      throw new Error('Failed to fetch user from GitHub API');
    }
    
    const userData = await userRes.json();

    // Fetch repositories to calculate total stars
    const reposRes = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`, { headers });
    let totalStars = 0;
    
    if (reposRes.ok) {
      const reposData = await reposRes.json();
      totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
    }

    sendPrettyJSON(req, res, {
      followers: userData.followers,
      publicRepos: userData.public_repos,
      totalStars,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    sendPrettyJSON(req, res, { 
      error: 'Failed to fetch external stats', 
      details: error.message 
    }, 500);
  }
}
