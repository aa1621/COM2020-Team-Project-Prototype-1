import Router from 'express';
import {createActionLog, listActionLogs} from '../controllers/actionLogs.controller.js';

const router = Router();

router.post("/", createActionLog);
router.get("/", listActionLogs);

export default router;
