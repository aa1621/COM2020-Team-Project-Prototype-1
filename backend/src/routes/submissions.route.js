import { Router } from 'express';
import { createSubmission } from '../controllers/submissions.controller.js';

const router = Router();

router.post("/challenges/:challengeId/submissions", createSubmission);

export default router;