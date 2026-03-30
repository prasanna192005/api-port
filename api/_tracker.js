import { track } from '@vercel/analytics/server';

/**
 * Tracks API requests natively using Vercel Analytics Events.
 */
export async function trackRequest(endpoint) {
  try {
    await track('api_hit', { endpoint });
  } catch (err) {
    // Fail silently if analytics is blocked or unconfigured
  }
}

/**
 * Git CMS directly feeds from the Vercel deployed filesystem, which
 * endpoints pass in as the fallback data. We just return it directly!
 */
export async function getPortfolioData(collectionName, key, fallbackData) {
  return fallbackData;
}

/**
 * Sends a pretty-printed JSON response.
 */
export async function sendPrettyJSON(req, res, data, status = 200) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.status(status).send(JSON.stringify(data, null, 2));
}
