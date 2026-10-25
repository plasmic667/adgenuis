import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateAdContent, refineAdCopy } from './src/server/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints
app.post('/api/generate-ad', async (req, res) => {
  try {
    const result = await generateAdContent(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

app.post('/api/refine-copy', async (req, res) => {
  try {
    const { originalText, instruction } = req.body;
    const result = await refineAdCopy(originalText, instruction);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Refinement failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'AdGenius AI' });
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`AdGenius AI server listening on port ${port}`);
});
