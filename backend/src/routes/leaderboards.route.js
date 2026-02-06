import Router from "express";
import { listUserLeaderboards } from "../controllers/leaderboards.controller.js";

const router = Router();

router.get("/users", listUserLeaderboards);

export default router;
