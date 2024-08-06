import { Router } from "express";
import { upload } from "../../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../../middlewares/auth.middlware.js";
import { registerUserForm,
         loginUser, 
         logoutUser, 
         registerUser, 
         refreshAccessToken, 
         changeCurrentPassword, 
         getCurrentUser, 
         updateAccountDetails, 
         updateUserAvatar, 
         deleteUser,
         getTripList,
         getPropertiesByCategories,
         createWishList,
         getWishlists,
         deleteWishList
        } from "../controllers/user.controller.js";
import { User } from "../models/user.model.js";
import { createReservation, getCreateReservation, deleteReservation } from "../controllers/host/reservations.controller.js";

// console.log("verifyJWT:", verifyJWT);
// console.log("User:", User);

const router = Router();

router.route("/register").get(registerUserForm);
router.route("/register").post(upload.single("avatar"),registerUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT(User), logoutUser)
router.route("/refresh-token").post(verifyJWT(User),refreshAccessToken)
router.route("/change-password").patch(verifyJWT(User), changeCurrentPassword)
router.route("/current-user").get(verifyJWT(User), getCurrentUser)
router.route("/update-user/:id").patch(verifyJWT(User), updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT(User), upload.single("avatar"), updateUserAvatar)
router.route("/delete-user/:userId").delete(verifyJWT(User),deleteUser)

// reservations of listings

router.route("/listings/:listId/reservations").get(verifyJWT(User),getCreateReservation)
router.route("/listings/:listId/reservations").post(verifyJWT(User),createReservation)
router.route("/reservations").get(verifyJWT(User),getTripList)
router.route("/listings/:listId/wishlist").post(verifyJWT(User),createWishList)
router.route("/wishlists").get(verifyJWT(User),getWishlists)
router.route("/properties/category/:category").get(verifyJWT(User),getPropertiesByCategories)
router.route("/listings/:listId/wishlist").delete(verifyJWT(User),deleteWishList)
router.route("/reservations/:id").delete(verifyJWT(User),deleteReservation)




export default router;