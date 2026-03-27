import { Router } from 'express';
import type { AssetRow, DataStore } from '../data/seed.js';
import { ASSET_STATUSES, ASSET_TYPES } from '../data/seed.js';
import { randomDelayMs } from '../lib/delay.js';
import { requireBearerToken } from '../lib/authMiddleware.js';

export function createAssetsRouter(store: DataStore) {
  const router = Router();

  router.get('/', requireBearerToken, async (_req, res) => {
    await randomDelayMs(300, 800);
    res.json(store.getAssets());
  });

  router.post('/', requireBearerToken, (req, res) => {
    const { name, type, status } = req.body as {
      name?: unknown;
      type?: unknown;
      status?: unknown;
    };

    if (typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Name is required.' });
      return;
    }
    if (typeof type !== 'string' || !ASSET_TYPES.includes(type as AssetRow['type'])) {
      res.status(400).json({ error: 'Type is required.' });
      return;
    }
    if (
      typeof status !== 'string' ||
      !ASSET_STATUSES.includes(status as AssetRow['status'])
    ) {
      res.status(400).json({ error: 'Status is required.' });
      return;
    }

    const created = store.addAsset({
      name,
      type: type as AssetRow['type'],
      status: status as AssetRow['status'],
    });
    res.status(201).json(created);
  });

  return router;
}
