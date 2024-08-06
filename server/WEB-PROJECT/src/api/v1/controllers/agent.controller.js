import  {asyncHandler}  from "../../../utils/asyncHandler.js";
import {ApiError} from "../../../utils/ApiError.js"
import { Agent } from "../models/agent.model.js";
// import { upload } from "../../../middlewares/multer.middleware.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshTokens = async(agentId) => {
    try {
        const agent = await Agent.findById(agentId)
        const accessToken = agent.generateAccessToken()
        const refreshToken = agent.generateRefreshToken()

        agent.refreshToken = refreshToken
        await agent.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Some error occured while generatuing access and refresh token")
    }
}

const registerAgent = asyncHandler( async (req, res) => {

    const {firstName,lastName, email,phoneNumber, agentName, password } = req.body
    // console.log("eamil: ", email);
    // console.log("req.files: ",req.files, "\n avatarlocalfilepath", req.files.avatar[0]?.path);

    if (
        [firstName,lastName, email,phoneNumber, agentName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedAgent = await Agent.findOne({
        $or: [{ agentName }, {email}]
    })

    if (existedAgent) {
        throw new ApiError(409, "Agent with this email or agentName aleady exists")
    }

    let avatarLocalPath;
    if(req.file && req.file.path){
        avatarLocalPath = req.file.path;
    }
    
    const agent = await Agent.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        agentName: agentName.toLowerCase(),
        password,
        avatar: avatarLocalPath
    })

    const createdAgent = await Agent.findById(agent._id).select(
        "-password"
    )

    if(!createdAgent) {
        throw new ApiError(500, "Something went wrong while registering Agent")
    }

    return res.status(201).json(
        new ApiResponse(200, createdAgent, "Agent Registered successfully")
    )

})

const loginAgent = asyncHandler(async (req, res) => {
    //take data from body
    //agentname or email
    //check if agent exists in db
    //check if password/credentials are correct
    //generate access & refresh token
    // send cookie
    //send login successfully 

    const {email, agentName, password} = req.body
    console.log("im here",email, agentName, password);
    if (!(agentName || email)) {
        throw new ApiError(400, "agentName or email is required")
    }

    const agent = await Agent.findOne({
        $or: [{agentName}, {email}]
    })
    if (!agent) {
        throw new ApiError(404, "Agent does not exist")
    }

    const isPasswordValid = await agent.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(agent._id)

    const loggedInAgent = await Agent.findById(agent._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                agent: loggedInAgent, accessToken, refreshToken
            },
            "Agent loggedIn succesfully"
        )
    )

})

const logoutAgent = asyncHandler(async (req, res) =>{
    console.log("req.agent",req.agent);
    try{
        await Agent.findByIdAndUpdate(
            req.agent._id,
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
        .json(new ApiResponse(200, {}, "Agent loggedOut"))
    } catch (error) {
        throw new ApiError(500, error.message ||  "Some error occured while logging out")
    }
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const agent = await Agent.findById(decodedToken._id)
    
        if (!agent) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== agent?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(agent._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newrefreshToken},
                "Access token refershed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body
    // console.log("old pass",oldPassword,"req body", req.body);
    
    const agent = await Agent.findById(req.agent?._id)
    console.log("agent",agent);
    
    const isPasswordCorrect = await agent.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect old password")
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Confirm password did not match to New password")
    }

    agent.password = newPassword
    await agent.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentAgent = asyncHandler( async(req, res) => {
    // const currentAgent = await Agent.findById(req.agent)
    return res
    .status(200)
    .json(new ApiResponse(200, req.agent, "Current Agent fetched successfully"))
})

const updateAgentDetails = asyncHandler(async(req, res) => {
    const {firstName, lastName, email, phoneNumber} = req.body

    if (!firstName && !lastName && !email && !phoneNumber){
        throw new ApiError(400, "Atleast one field is required")
    }

    const agent = await Agent.findByIdAndUpdate(
        req.agent?._id,
        {
            $set: {
                firstName,
                lastName,
                email,
                phoneNumber
            }
        },
        {new: true}
    
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, agent, "Agent details updated successfully"))
})

const updateAgentAvatar = asyncHandler( async(req, res) => {
    const avatarLocalPath = req.file.path
    // console.log("avatar local path", avatarLocalPath, "req file", req.file?.path);
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const agent = await Agent.findByIdAndUpdate(
        req.agent?._id,
        {
            $set:{
                avatar: avatarLocalPath
            }
        },
        {new: true}
    ).select("-password")

    return res.status(200)
    .json(
        new ApiResponse(200, agent, "Agent avatar updated")
    )
})

const deleteAgent = asyncHandler(async (req, res) => {
    await Agent.findByIdAndDelete(req.agent._id);
    console.log("agent Id",req.agent._id);
    
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Agent deleted successfully"));
});

export {
    registerAgent,
    loginAgent,
    logoutAgent,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentAgent,
    updateAgentDetails,
    updateAgentAvatar,
    deleteAgent
};