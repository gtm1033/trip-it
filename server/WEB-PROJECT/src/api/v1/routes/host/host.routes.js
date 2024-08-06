import {Router} from "express"

import { verifyJWT } from "../../../../middlewares/auth.middlware.js";
import { registerHost, getRegisterHost, loginHost, logoutHost, getCurrentHost, updateAccountDetails, updateAvatar, changePassword, deleteAccount, refreshAccessToken, messages } from "../../controllers/host/host.controller.js"
import { createMessage } from "../../controllers/host/messages.controller.js";
import { createListing, getCreateListing, getListingbypartId , allListings, getListings, getListingById, updateListing, updatePhotos, deleteListing } from "../../controllers/host/listings.controller.js";
import { createReservation, getCreateReservation } from "../../controllers/host/reservations.controller.js";
import { Host } from "../../models/host/host.model.js";
import { upload } from "../../../../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").get(getRegisterHost);
router.route("/register").post(upload.single("avatar"),registerHost);

//secured routes
router.route("/get-current-host").get(verifyJWT(Host), getCurrentHost);
router.route("/login").post(loginHost);
router.route("/logout").post(verifyJWT(Host), logoutHost);
router.route("/refresh-access-token").post(verifyJWT(Host),refreshAccessToken);
router.route("/update-host-details").patch(verifyJWT(Host), updateAccountDetails);
router.route("/update-avatar").patch(verifyJWT(Host), upload.single("avatar"), updateAvatar);
router.route("/change-password").patch(verifyJWT(Host), changePassword);
router.route("/delete-account").delete(verifyJWT(Host), deleteAccount);

//routes of messages for host
router.route("/messages/:hostId").get(messages);
router.route("/messages/:hostId").post(createMessage);

// routes of hosts listings

router.route("/listings").get(verifyJWT(Host),getCreateListing)
router.route("/listings").post(verifyJWT(Host), upload.fields([{name: "listingPhotoPaths", maxCount: 10}])  ,createListing)
router.route("/get-listings").get(verifyJWT(Host), getListings)
router.route("/listings/:listId").get(verifyJWT(Host), getListingById)
router.route("/listings/:listId/update-details").patch(verifyJWT(Host), updateListing)
router.route("/listings/:listId/update-photos").patch(verifyJWT(Host), upload.fields([{name: "listingPhotoPaths", maxCount: 10}]) ,updatePhotos)
router.route("/listings/:listId").delete(verifyJWT(Host), deleteListing)
router.route("/properties").get(allListings)
router.route("/properties/:listingId").get(getListingbypartId)
//routes of reservations for host's listings

// router.route("/listings/:listId/reservations").get(getCreateReservation)
// router.route("/listings/:listId/reservations").post(createReservation)

export default router;