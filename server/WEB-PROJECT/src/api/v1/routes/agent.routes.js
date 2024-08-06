import { Router } from "express";
import { loginAgent,logoutAgent,registerAgent,refreshAccessToken, changeCurrentPassword, getCurrentAgent, updateAgentDetails, updateAgentAvatar, deleteAgent } from "../controllers/agent.controller.js";
import { upload } from "../../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../../middlewares/auth.middlware.js";
import { Agent } from "../models/agent.model.js";
const router = Router()

router.route("/register").post(
    upload.single("avatar"), registerAgent);

router.route("/login").post(upload.none(), loginAgent);


//secured routes
router.route("/logout").post(verifyJWT(Agent), logoutAgent);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(upload.none(), verifyJWT(Agent), changeCurrentPassword);
router.route("/current-agent").post(verifyJWT(Agent) , getCurrentAgent);
router.route("/update-agent").post(verifyJWT(Agent), upload.none(), updateAgentDetails);
router.route("/update-avatar").post(verifyJWT(Agent),upload.single("avatar"),updateAgentAvatar,);
router.route("/delete-agent").delete(verifyJWT(Agent), deleteAgent);



export default router