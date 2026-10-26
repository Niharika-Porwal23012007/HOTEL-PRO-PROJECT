import { Router } from 'express';
import { AIController } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', AIController.chat);
router.post('/search', AIController.search);
router.get('/hotels/:id/review-summary', AIController.getReviewSummary);

export default router;
