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
    const card = figlet.textSync('PRASANNA', { font: 'Slant' });
    const welcome = `
${chalk.cyan(card)}
Welcome to the Developer API Portfolio (v2.0.26)
-----------------------------------------------
> Sarcastic context: enabled
> Human interaction: simulated
> Latency: minimal (unless you use VR)

[ 2026 Context ]
While everyone else was building AI-generated VR portfolios that require a 4090 to render a button, 
I stayed in the terminal. It's faster, it's cleaner, and it actually works. 

[ Available Endpoints ]
- GET /me          : Who am I? (Bio & stack)
- GET /projects    : What have I built?
- GET /experience  : Where have I worked?
- GET /stats       : Live GitHub metrics
- GET /contact     : How to reach me
- GET /now         : Current status 

[ Tip ]
Add '-H "Accept: application/json"' to your curl command or visit these in a browser to see the raw data.
Try 'npx prasanna' for the interactive CLI experience.
`;
    return res.status(200).send(welcome);
  }

  sendPrettyJSON(req, res, {
    message: 'Welcome to Prasanna\'s Developer API Portfolio.',
    why_this_exists_in_2026: 'Because while everyone else is building VR portfolios that require a 4090 to render a button, I still believe in the beauty of raw bytes. It is also the only website that still works on a 2G connection (if those still exist).',
    how_to_use: 'You are probably an AI or a developer who lost their mouse. Use the endpoints below to explore my identity. If you are a human, run `npx prasanna` for a slightly more "visual" experience.',
    endpoints: [
      '/me',
      '/projects',
      '/experience',
      '/contact',
      '/now',
      '/stats'
    ]
  });
}
