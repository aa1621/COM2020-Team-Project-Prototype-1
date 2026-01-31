import { Router } from 'express'
import {
    getModerationQueue,
    decideSubmission,
} from "../controllers/moderation.controller.js";

const router = Router();

router.get('/moderation/queue', getModerationQueue);
router.post('/moderation/submissions/:submissionId/decision', decideSubmission);

export default router;