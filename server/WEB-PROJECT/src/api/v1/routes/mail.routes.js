import { Router } from "express";
import { verifyMail, sendMail } from "../controllers/mail.controller.js";

const router = Router();

router.route("/send-email").post(sendMail);
router.route("/verify-email/:token").get(verifyMail);

export default router;