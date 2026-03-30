import { sendPrettyJSON } from "./_tracker.js";
import fs from "node:fs/promises";
import path from "node:path";

export default async function handler(req, res) {
  const passcode = req.headers['x-admin-passcode'] || req.query.passcode || '';
  const adminPasscode = process.env.ADMIN_PASSCODE ? String(process.env.ADMIN_PASSCODE).trim() : 'prasannadada';

  if (passcode.trim() !== adminPasscode) {
    return sendPrettyJSON(req, res, { 
      error: 'Unauthorized: Invalid passcode.',
      _debug: { 
        received: passcode, 
        expected: "Check your terminal logs for the expected value",
        env_status: process.env.ADMIN_PASSCODE ? 'Set' : 'Using Fallback'
      }
    }, 401);
  }

  const { action } = req.query;

  try {
    if (req.method === 'GET') {
      if (action === 'getStats') {
        // Analytics disabled in API layer. Use Vercel Web Analytics.
        return sendPrettyJSON(req, res, {
          stats: { total_visitors: "Live in Vercel Analytics", endpoints: {} },
          history: []
        });
      }

      if (action === 'getConfigs') {
        const dataDir = path.join(process.cwd(), 'data');
        const files = await fs.readdir(dataDir);
        const configs = {};

        for (const file of files) {
          if (file.endsWith('.json')) {
            const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
            configs[file] = JSON.parse(content);
          }
        }

        return sendPrettyJSON(req, res, { configs });
      }
    }

    if (req.method === 'POST') {
      const { action: postAction, fileName, content } = req.body;

      if (postAction === 'updateConfig') {
        
        // SECURITY: Ensure we only write to the data directory and only .json files
        if (!fileName || !fileName.endsWith('.json') || fileName.includes('..')) {
          return sendPrettyJSON(req, res, { error: 'Invalid file name.' }, 400);
        }

        const GH_TOKEN = process.env.GITHUB_TOKEN;
        const GH_OWNER = process.env.GITHUB_OWNER;
        const GH_REPO = process.env.GITHUB_REPO;

        // If GitHub isn't configured, try local write (works in vercel dev)
        if (!GH_TOKEN || !GH_OWNER || !GH_REPO) {
          try {
            const filePath = path.join(process.cwd(), 'data', fileName);
            await fs.writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
            return sendPrettyJSON(req, res, { message: `Saved locally. (GitHub CMS not configured in .env)`});
          } catch(e) {
            return sendPrettyJSON(req, res, { error: 'GitHub CMS not configured, and local disk is read-only in production. Add GITHUB_TOKEN to .env' }, 500);
          }
        }

        // --- GITHUB CMS LOGIC ---
        const filePathUrl = `data/${fileName}`;
        const url = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${filePathUrl}`;
        
        const ghHeaders = {
            'Authorization': `Bearer ${GH_TOKEN}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'API-Portfolio-CMS'
        };
        
        // 1. Get the current file SHA (needed for update)
        const getRes = await fetch(url, { headers: ghHeaders });
        let sha = undefined;
        if (getRes.ok) {
            const getJson = await getRes.json();
            sha = getJson.sha;
        }
        
        // 2. Put the new commit
        const newContentB64 = Buffer.from(JSON.stringify(content, null, 2), 'utf-8').toString('base64');
        const commitBody = {
            message: `Automated content update via Admin UI: ${fileName}`,
            content: newContentB64,
        };
        if (sha) {
            commitBody.sha = sha;
        }
        
        const putRes = await fetch(url, {
            method: 'PUT',
            headers: ghHeaders,
            body: JSON.stringify(commitBody)
        });
        
        if (!putRes.ok) {
            const putErr = await putRes.text();
            throw new Error(`GitHub API Error: ${putErr}`);
        }

        return sendPrettyJSON(req, res, { message: `Successfully committed ${fileName} to GitHub. Vercel is auto-deploying!` });
      }
    }

    sendPrettyJSON(req, res, { error: 'Invalid action or method.' }, 400);

  } catch (error) {
    console.error("Admin API error:", error);
    sendPrettyJSON(req, res, { error: 'Internal server error.', details: error.message }, 500);
  }
}
