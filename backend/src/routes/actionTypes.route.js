import express from 'express';
import { getActionTypes } from '../controllers/actionTypes.controller.js';

const router = express.Router();

router.get("/", getActionTypes);

export default router;