import { Router } from "express";
import { listGroups, joinGroup, createGroup, createInvite } from "../controllers/groups.controller.js";

const router = Router();

router.get("/", listGroups);
router.post("/", createGroup);
router.post("/join", joinGroup);
router.post("/:groupId/invites", createInvite);

export default router;
