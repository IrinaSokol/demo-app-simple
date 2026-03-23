import type { RequestHandler } from 'express';

const DEMO_TOKEN = 'demo-token';

export const requireBearerToken: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${DEMO_TOKEN}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
};
