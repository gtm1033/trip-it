import mongoose, {Schema} from "mongoose";

const mailVerifySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    email: {
        type: String,
        required: true,
    },
    verificationLink: {
        type: String,
        required: true,
    },
    expiresIn: {
        type: Date,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    }
})

export const mailVerify = mongoose.model('mailVerify', mailVerifySchema);