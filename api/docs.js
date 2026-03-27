import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

export default function handler(req, res) {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Prasanna API Portfolio',
        version: '1.0.0',
      },
      servers: [
        { url: 'https://prasanna-dev-api.vercel.app' },
        { url: 'http://localhost:3000' }
      ]
    },
    apis: [path.join(process.cwd(), 'api', '*.js')],
  };

  const swaggerSpec = swaggerJsdoc(options);
  const paths = swaggerSpec.paths || {};
  
  // Dynamically build the endpoint cards using our parsed JSDoc
  let endpointsHtml = '';
  for (const [route, methods] of Object.entries(paths)) {
    for (const [method, details] of Object.entries(methods)) {
      const methodUpper = method.toUpperCase();
      const methodClass = methodUpper === 'GET' ? 'method-get' : 'method-post';
      endpointsHtml += `
        <div class="endpoint">
          <div class="endpoint-header">
            <span class="method ${methodClass}">${methodUpper}</span>
            <span class="route">${route}</span>
          </div>
          <p class="description">${details.summary || details.description || 'Returns structured JSON data.'}</p>
        </div>
      `;
    }
  }

  // Pure, dependency-free, completely custom minimalist HTML/CSS
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>API Reference - Prasanna</title>
      <link href="https://fonts.googleapis.com/css?family=Inter:400,600,700" rel="stylesheet">
      <style>
        * { box-sizing: border-box; }
        body { 
          margin: 0; padding: 0; 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #fafafa;
          color: #111;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 700px;
          margin: 60px auto;
          padding: 0 20px;
        }
        .header {
          margin-bottom: 40px;
        }
        .brand {
          font-size: 13px;
          font-weight: 700;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          display: block;
        }
        h1 { 
          margin: 0 0 12px 0; 
          font-size: 32px; 
          font-weight: 700;
          letter-spacing: -1px; 
        }
        .description-head { 
          color: #666; 
          font-size: 16px; 
          line-height: 1.5; 
          margin: 0;
        }
        .endpoint {
          background: #fff;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          padding: 20px 24px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          cursor: pointer;
        }
        .endpoint:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.06);
          border-color: #ddd;
        }
        .endpoint-header {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }
        .method {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          margin-right: 12px;
          letter-spacing: 0.5px;
        }
        .method-get { background: #e0f2fe; color: #0284c7; }
        .method-post { background: #dcfce7; color: #166534; }
        
        .route {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 14px;
          font-weight: 600;
          color: #111;
        }
        .description {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }
        /* Make endpoints clickable to test them instantly */
        a { text-decoration: none; color: inherit; display: block; }
        
        .cli-notice {
          margin-top: 16px;
          padding: 12px 16px;
          background: #f4f4f5;
          border: 1px solid #e4e4e7;
          border-radius: 6px;
          font-size: 14px;
          color: #3f3f46;
          display: inline-flex;
          align-items: center;
        }
        .cli-notice code {
          background: #111;
          color: #00f0ff;
          padding: 4px 8px;
          border-radius: 4px;
          margin-left: 8px;
          font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
          font-weight: 700;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <span class="brand">Prasanna</span>
          <h1>API Reference</h1>
          <p class="description-head">All data is served as clean JSON. No API keys required.</p>
          <div class="cli-notice">
            Prefer the terminal? Run <code>npx prasanna</code>
          </div>
        </div>
        <div class="endpoints">
          ${endpointsHtml}
        </div>
      </div>
      
      <script>
        // Make the endpoint cards clickable to instantly open them
        document.querySelectorAll('.endpoint').forEach(el => {
          el.addEventListener('click', () => {
            const route = el.querySelector('.route').textContent;
            window.open(route, '_blank');
          });
        });
      </script>
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
