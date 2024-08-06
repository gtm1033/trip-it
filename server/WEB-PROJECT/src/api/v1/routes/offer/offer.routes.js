import { Router } from "express";
import { createOffer, updateOffer, getExpiredOffers, getPendingOffers, getRejectedOffers} from "../../controllers/offer.controller.js";
import { verifyJWT } from "../../../../middlewares/auth.middlware.js";
import { Offer } from "../../models/offer.model.js";
import { Agent } from "../../models/agent.model.js";

const router = Router()

router.route("/create-offer").post(verifyJWT(Agent), createOffer)
router.route("/update-offer/:id").patch(verifyJWT(Agent), updateOffer)
router.route("/expired-offers").get(verifyJWT(Agent), getExpiredOffers)
router.route("/pending-offers").get(verifyJWT(Agent), getPendingOffers)
router.route("/rejected-offers").get(verifyJWT(Agent), getRejectedOffers)


export default router