import { Router } from 'express';
import type { DataStore } from '../data/seed.js';
import { randomDelayMs } from '../lib/delay.js';
import { requireBearerToken } from '../lib/authMiddleware.js';

export function createAssetsRouter(store: DataStore) {
  const router = Router();

  router.get('/', requireBearerToken, async (_req, res) => {
    await randomDelayMs(300, 800);
    res.json(store.getAssets());
  });

  return router;
}
