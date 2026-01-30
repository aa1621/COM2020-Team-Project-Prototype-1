import Router from 'express';
import {createActionLog} from '../controllers/actionLogs.controller.js';

const router = Router();

router.post("/", createActionLog);

export default router;