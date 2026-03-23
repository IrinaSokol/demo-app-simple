import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDataStore } from './data/seed.js';
import authRouter from './routes/auth.js';
import { createProjectsRouter } from './routes/projects.js';
import { createAssetsRouter } from './routes/assets.js';
import { createAdminRouter } from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const store = createDataStore();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/projects', createProjectsRouter(store));
app.use('/api/assets', createAssetsRouter(store));
app.use('/api/admin', createAdminRouter(store));

const distPath = path.join(__dirname, '..', 'dist');
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  if (isProd) {
    console.log('Serving static app from', distPath);
  }
});
