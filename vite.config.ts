import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import dotenv from 'dotenv';
dotenv.config();

// Custom Vite plugin to handle API routes directly in development
function apiRoutesPlugin(): Plugin {
  return {
    name: 'adgenius-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Parse JSON body if present
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            res.setHeader('Content-Type', 'application/json');

            if (req.url === '/api/generate-ad' && req.method === 'POST') {
              const data = body ? JSON.parse(body) : {};
              const { generateAdContent } = await server.ssrLoadModule('/src/server/geminiService.ts');
              const result = await generateAdContent(data);
              res.statusCode = 200;
              res.end(JSON.stringify(result));
              return;
            }

            if (req.url === '/api/refine-copy' && req.method === 'POST') {
              const data = body ? JSON.parse(body) : {};
              const { refineAdCopy } = await server.ssrLoadModule('/src/server/geminiService.ts');
              const refined = await refineAdCopy(data.originalText || '', data.instruction || 'more_persuasive');
              res.statusCode = 200;
              res.end(JSON.stringify({ result: refined }));
              return;
            }

            if (req.url === '/api/health') {
              res.statusCode = 200;
              res.end(JSON.stringify({ status: 'ok', brand: 'AdGenius AI' }));
              return;
            }

            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (error: any) {
            console.error('API middleware error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message || 'Internal server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
