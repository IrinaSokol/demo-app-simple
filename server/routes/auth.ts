import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (email === 'admin@demo.com' && password === 'admin123') {
    res.json({ token: 'demo-token' });
    return;
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
