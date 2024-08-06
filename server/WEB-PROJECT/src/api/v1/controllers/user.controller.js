import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiError } from "../../../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../../../utils/cloudinary.js"
import { ApiResponse } from "../../../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Listing } from "../models/host/listing.model.js";
import { Reservation } from "../models/host/reservation.model.js";
import jwt from "jsonwebtoken";
import { sendOTP, verifyOTP } from "./otp.controller.js";
import { Host } from "../models/host/host.model.js";

const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went worng while generating refresh and access tokens");
    }
}

const registerUserForm = asyncHandler( async(req, res, next) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Show user form here."
        )
    )
})

const registerUser = asyncHandler( async (req, res, next) => {
    const {email,phoneNumber,firstName,lastName,password} = req.body
        // console.log("file: ",req.file.path);

    if([email,password,phoneNumber,firstName,lastName].some((field) => field?.trim() === ""))
    {
        throw new ApiError(400, "All fields are required")
    }
    const existedUser = await User.findOne({email})
    
    if(existedUser){
        throw new ApiError(409, "User(Email) already exists")
    }
    console.log("file: ",req.file, req.file?.path);
    const avatarLocalPath = req.file?.path;
    
    const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        avatar: avatarLocalPath || "",
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user.")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {

    const{email,password} = req.body

    if(!email || !password){
        throw new ApiError(400, "All fields are required.");
    }

    const user = await User.findOne({email});

    if(!user){
        throw new ApiError(404, "user doesn't exist.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        )
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out")) 
    } catch (error) {
        throw new ApiError(401, "Json web token expired/ unauthorized")
    }
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify( incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken ){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const{ newAccessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
        console.log("new access token: ", newAccessToken);
    
        return res
        .status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {newAccessToken, newRefreshToken},
                "Access token refreshed successfully"
            )
        )
    } catch (error) {
        throw new ApiError(401, "Unauthorized request");
    }

})

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {currentPassword, newPassword} = req.body 
    try {
        const user = await User.findById(req.user?._id)
        const isPasswordCorrect = user.isPasswordCorrect(currentPassword);
    
        if(!isPasswordCorrect){
            throw new ApiError(400, "Invalid current password")
        }
        user.password = newPassword
        await user.save({validateBeforeSave: false})
    
        return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully")) 
    } catch (error) {
        throw new ApiError(401, "Unauthorized request")
    }
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully."))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const {firstName, lastName, email} = req.body

    console.log(req.user._id);
    try {
        if(!firstName || !lastName || !email){
            throw new ApiError(400, "All fields are required")
        }
    
        const user = await User.findByIdAndUpdate(
            id,
            {
                $set: {
                    firstName,
                    lastName,
                    email
                },
            },{
                new: true
            },
        ).select("-password")
    
        if(!user){
            throw new ApiError(400, "User not found.")
        }
    
        return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated"))
    } catch (error) {
        console.log("error: ",error.message);
        throw new ApiError(401, "Unauthorized request: ",error.message);
    }
    
})

const updateUserAvatar = asyncHandler(async(req, res) => {
    try {
        console.log(req.file);
        const avatarLocalPath = req.file?.path

        if(!avatarLocalPath){
            throw new ApiError(400, "Avatar file is missing");
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath);
    
        if(!avatar.url){
            throw new ApiError(400, "Error while uploading on cloudinary")
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    avatar: avatar.url
                }
            },
            {new: true}
        ).select("-password")
    
        return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Image updated successfully.")
        ) 
    } catch (error) {
        throw new ApiError(401, "Unauthorized request")
    }
})

const deleteUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    console.log(userId)
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "User deleted successfully")
    );
});

// trips routes: 

const getTripList = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const reservationsWithListings = await Reservation.aggregate([
            { 
                $match: { 
                    userId: new mongoose.Types.ObjectId(userId)              // Match reservations for the user
                } 
            }, 
            {
                $lookup: {
                    from: 'listings', // Name of the listings collection
                    localField: 'listId', // Field in reservations
                    foreignField: '_id', // Field in listings
                    as: 'listing' // Output array field
                }
            },
            { 
                $unwind: '$listing'           // Flatten the array
            }, 
            {
                $project: {
                    _id: 1,
                    listId: 1,
                    checkIn: 1,
                    checkOut: 1, // Include other reservation fields if needed
                    listing: {
                        type: 1,
                        city: 1,
                        country: 1, // Include other listing fields if needed
                    }
                }
            }
            ]);
        return res.status(200).json(
            new ApiResponse(200, reservationsWithListings, "Trip list fetched successfully")
        );
    } catch (error) {
        throw new ApiError(401,error.message ||  "Unauthorized request")
    }
    
});

const createWishList = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { listId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        if (!user.wishList.includes(listId)) {
            user.wishList.push(listId);
            await user.save();
        }else{
            throw new ApiError(400, "Listing is already added in wish list")
        }
        return res.status(200).json(
            new ApiResponse(200, user.wishList, "Wish list updated successfully")
        );
    } catch (error) {
        throw new ApiError(401,error.message ||  "Unauthorized request")
    }
});

const getWishlists = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const wishList = await Listing.find({ _id: { $in: user.wishList } });
        return res.status(200).json(
            new ApiResponse(200, wishList, "Wish list fetched successfully")
        );
    } catch (error) {
        throw new ApiError(401,error.message ||  "Unauthorized request")
    }
});

const getPropertiesByCategories = asyncHandler(async (req, res) => {
    const { category } = req.params;
    console.log("category: ",category);
    
    try {
        const listings = await Listing.find({ category });
        console.log("listings: ", listings);
        if(!listings){
            throw new ApiError(404, "No listings found for this category");
        }
        return res.status(200).json(
            new ApiResponse(200, listings, "Listings fetched successfully")
        );
    } catch (error) {
        throw new ApiError(401,error.message ||  "Unauthorized request")
    }
});

const deleteWishList = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { listId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        user.wishList = user.wishList.filter((id) => id.toString() !== listId);
        await user.save();
        return res.status(200).json(
            new ApiResponse(200, user.wishList, "Wish list updated successfully")
        );
    } catch (error) {
        throw new ApiError(401,error.message ||  "Unauthorized request")
    }
});


export { 
         registerUserForm,
         registerUser, 
         loginUser, 
         logoutUser, 
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
        }


