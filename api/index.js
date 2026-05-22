import { trackRequest, sendPrettyJSON } from "./_tracker.js";
import figlet from "figlet";
import chalk from "chalk";

/**
 * Main entry point for the API.
 */
export default async function handler(req, res) {
  await trackRequest('/');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return sendPrettyJSON(req, res, { error: 'Method Not Allowed', message: 'Use GET for this endpoint.' }, 405);
  }

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  if (userAgent.includes('curl')) {
    const card = figlet.textSync('PRASANNA', { font: 'Standard', horizontalLayout: 'fitted' });
    const welcome = `
${chalk.cyan(card)}
Welcome to the Developer API Portfolio (v1.3.1)
-----------------------------------------------
* It's 2026. Every portfolio is a Three.js particle explosion with an AI chatbot
  that hallucinates my job history.
* This one runs in your terminal.

[ Interactive CLI ]
  npx prasanna

[ Raw Endpoints ]
  curl https://api.prasanna19.xyz/me          : Identity & skills
  curl https://api.prasanna19.xyz/projects    : Top repositories
  curl https://api.prasanna19.xyz/experience  : Timeline
  curl https://api.prasanna19.xyz/stats       : Live GitHub stats
  curl https://api.prasanna19.xyz/now         : What I'm building

[ Tip ]
  Add '-H "Accept: application/json"' to your curl command or visit these in a browser to see the raw data.
`;
    return res.status(200).send(welcome);
  }

  sendPrettyJSON(req, res, {
    message: 'Welcome to Prasanna\'s Developer API Portfolio.',
    why_this_exists_in_2026: 'Everyone vibe-coded a portfolio site in 2026. Nobody thought to make the data actually accessible.this is directly connected to the cli as well, so any updates here will reflect in the cli.',
    how_to_use: 'Run `npx prasanna` for the CLI, hit the endpoints for raw JSON, or visit prasanna10.xyz if you still need a website to believe I exist.',
    endpoints: {
      '/me': 'Identity & skills',
      '/projects': 'Top repositories',
      '/experience': 'Timeline',
      '/stats': 'Live GitHub stats',
      '/now': 'What I\'m building'
    }
  });
}
