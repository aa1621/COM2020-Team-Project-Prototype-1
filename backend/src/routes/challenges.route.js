import { Router } from 'express'
import {
    listChallenges,
    getChallenge,
    listChallengeSubmissions,
    listUserSubmissions,
} from '../controllers/challenges.controller.js';

const router = Router();

router.get("/challenges", listChallenges);
router.get("/challenges/:challengeId", getChallenge);
router.get("/challenges/:challengeId/submissions", listChallengeSubmissions);
router.get("/users/:userId/submissions", listUserSubmissions);

export default router;