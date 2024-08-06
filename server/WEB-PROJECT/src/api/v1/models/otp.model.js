import mongoose, {Schema} from "mongoose";

const OtpSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
})

export const Otp = mongoose.model('Otp', OtpSchema);

