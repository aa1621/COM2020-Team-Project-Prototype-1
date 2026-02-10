import { Router } from "express";
import { listGroups, joinGroup, createGroup } from "../controllers/groups.controller.js";

const router = Router();

router.get("/", listGroups);
router.post("/", createGroup);
router.post("/join", joinGroup);

export default router;
