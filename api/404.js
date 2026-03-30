import { sendPrettyJSON } from './_tracker.js';

export default async function handler(req, res) {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // If the user is curl, send raw ASCII
  if (userAgent.includes('curl')) {
    return res.status(404).send(`
    
  [ SYSTEM FAILURE ]
  Error 404: Endpoint not found in this dimension.
  
  The URL you requested does not exist in the API Matrix.
  Type 'npx prasanna' instead to navigate safely.
  
`);
  }

  // Developer-themed JSON response for browsers/apps
  sendPrettyJSON(req, res, {
    error: "404 Not Found",
    status_code: 404,
    message: "Even Google's crawler gave up looking for this page.",
    suggestion: "Try hitting /me or /projects to find something that actually exists.",
    easter_egg: "You fell out of the world. Please respawn."
  }, 404);
}
