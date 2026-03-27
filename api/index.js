/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     description: Returns a welcome message and interactive CLI details.
 *     responses:
 *       200:
 *         description: Welcome message and links to documentation.
 */
import { trackRequest } from "./_tracker.js";

export default async function handler(req, res) {
  await trackRequest('/');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  if (userAgent.includes('curl')) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    const reset = '\x1b[0m';
    const boldCyan = '\x1b[1;36m';
    const boldMagenta = '\x1b[1;35m';
    const gray = '\x1b[90m';
    const green = '\x1b[1;32m';

    const card = `
${boldCyan}    ____                                           ${reset}
${boldCyan}   / __ \\_________ __________ _____  ____  ____ _  ${reset}
${boldCyan}  / /_/ / ___/ __ \`/ ___/ __ \`/ __ \\/ __ \\/ __ \`/  ${reset}
${boldCyan} / ____/ /  / /_/ (__  ) /_/ / / / / / / / /_/ /   ${reset}
${boldCyan}/_/   /_/   \\__,_/____/\\__,_/_/ /_/_/ /_/\\__,_/    ${reset}
${gray}--------------------------------------------------${reset}
  ${boldMagenta}Prasanna${reset} | ${green}Full Stack Developer${reset}
  ${gray}Maharashtra, India${reset}

  ${boldCyan}>${reset} ${boldMagenta}GitHub:${reset}   https://github.com/prasanna192005
  ${boldCyan}>${reset} ${boldMagenta}LinkedIn:${reset} https://linkedin.com/in/prasanna192005
  ${boldCyan}>${reset} ${boldMagenta}CLI:${reset}      npx prasanna
${gray}--------------------------------------------------${reset}
Explore the JSON endpoints:
  ${green}GET${reset} /me            ${green}GET${reset} /projects
  ${green}GET${reset} /experience    ${green}GET${reset} /contact
  ${green}GET${reset} /now           ${green}GET${reset} /stats
  ${green}GET${reset} /projects/all
  
Or view full docs in your browser at: /docs
`;
    return res.status(200).send(card);
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    message: 'Welcome to Prasanna\'s Developer API Portfolio.',
    documentation: '/docs',
    cli: 'Run `npx prasanna` in your terminal to see the interactive version.',
    endpoints: [
      '/me',
      '/projects',
      '/projects/all',
      '/experience',
      '/contact',
      '/now',
      '/stats'
    ]
  });
}
