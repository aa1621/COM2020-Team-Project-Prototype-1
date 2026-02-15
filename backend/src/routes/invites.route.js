import { Router } from "express";
import { listInvites, respondToInvite } from "../controllers/invites.controller.js";

const router = Router();

router.get("/", listInvites);
router.post("/:inviteId/respond", respondToInvite);

export default router;