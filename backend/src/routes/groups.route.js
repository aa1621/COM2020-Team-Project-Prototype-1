import Router from "express";
import { listGroups, joinGroup } from "../controllers/groups.controller.js";

const router = Router();

router.get("/", listGroups);
router.post("/join", joinGroup);

export default router;
