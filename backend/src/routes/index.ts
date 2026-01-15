import { Router } from 'express';
import weatherRoutes from './weather';

const router = Router();

router.use('/weather', weatherRoutes);

router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

export default router;
