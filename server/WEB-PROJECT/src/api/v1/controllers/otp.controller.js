import Api from 'twilio/lib/rest/Api.js';
import { ApiError } from '../../../utils/ApiError.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import {Otp} from '../models/otp.model.js';
import {User} from '../models/user.model.js';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const sendOTP = asyncHandler(async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60000); // Expires in 2 minutes

    console.log("inside the log blog: ",expiresAt);

    if(!phoneNumber){
        throw new ApiError(400, "phone number is required")
    }
    console.log(phoneNumber, otp);
    try {
        // Send OTP using Twilio
        await client.messages.create({
            body: `Your verification code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        // Save OTP to database
        await Otp.findOneAndUpdate(
            { phoneNumber },
            { otp, expiresAt },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.status(200).send("OTP sent successfully");
    } catch (error) {
        res.status(500).send({ message: 'Error sending verification code', error: error.message });
    }
});



const verifyOTP = asyncHandler(async (req, res) => {
    const { phoneNumber, otp } = req.body;
    console.log("verify: ",phoneNumber,otp);
    try {
        const otpRecord = await Otp.findOne({ phoneNumber, otp });

        if (!otpRecord || otpRecord.expiresAt < new Date()) {
            return res.status(400).send('Invalid or expired OTP');
        }

        // Mark the OTP as verified
        otpRecord.isVerified = true;
        await otpRecord.save();

        // Update the user record to reflect phone number verification
        const user = await User.findOneAndUpdate(
            { phoneNumber },
            { phoneVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).send('Cannot find a user from the given phone number');
        }

        res.status(200).send('Phone number verified');
    } catch (error) {
        res.status(500).send('Error verifying code');
    }
});

export{
        sendOTP,
        verifyOTP
    }