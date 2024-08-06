import { ApiError } from '../../../utils/ApiError.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { User } from "../models/user.model.js"
import { mailVerify } from '../models/mail.model.js';
import jwt from 'jsonwebtoken';
import nodeMailer from "nodemailer"
import Api from 'twilio/lib/rest/Api.js';


const sendMail = asyncHandler( async(req, res) => {
    const { email } = req.body;
    console.log("email: ",email);
    if(!email){
        throw new ApiError(401, "Email is required")
    }

    const user = await User.findOne({email});
    console.log("user: ",user?.email);
    if(!user){
        throw new ApiError(401, "User with the given email not found");
    }

    const mailTokenVerification = jwt.sign(
        {
            email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    console.log("mailVerification: ",mailTokenVerification);

    const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    });

    const url = `http://localhost:8000/api/v1/users/verify-email/${mailTokenVerification}`;
    transporter.sendMail({
        to: email,
        subject: 'Verify your email',
        html: `Click <a href="${url}">here</a> to verify your email.`,
    });

    res.status(200).send("Verification link has been sent to your email")

})

const verifyMail = asyncHandler( async(req, res) => {
    const {token} = req.params;
    console.log("verify karne aaye",token);
    if(!token){
        throw new ApiError(401, "Token invalid or not found");
    }
    try{
        const decodedToken = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET);
        console.log("try block: ",decodedToken);
        if(!decodedToken){
            throw new ApiError(401, "Token invalid or expired");
        }
        const email = decodedToken.email;
        const user = await User.findOneAndUpdate(
            { email },
            { emailVerified: true },
            { new: true }
        );
        
        if(!user){
            throw new ApiError(401, "User with the given email not found.")
        }
        res.status(200).send(`<html>
                            <head>
                            <title>Email Verification</title>
                            </head>
                            <body>
                            <h1>Email verified successfully</h1>
                            <h2>Welcome, ${user.firstName}! let's begin our journey together</h2>
                            </body>
                        </html>`);
    }catch(error){
        console.error("Error in verifying email:", error.message);
        res.status(400).send('Something went wrong while verifing email');
    }
})

export {
    sendMail,
    verifyMail
}