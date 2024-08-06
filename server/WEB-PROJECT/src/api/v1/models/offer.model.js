import mongoose, { Schema } from "mongoose";

const offerSchema = new Schema({
    agentId: {
        type: Schema.Types.ObjectId, // one who gives offer
        ref: "Agent",
        required: true
    },
    hostId: {
        type: Schema.Types.ObjectId, // one who recieves offer
        ref: "Customer",
        unique: true,
        required: true
    },
    propertyURL: {
        type: String,
        unique: true,
        required: true
    },
    offerStatus: {
        type: String,
        default: "pending",
        // required: true
    },
    statusReason: {
        type: String,
        required: true
    },
    callBackTime: {
        type: Date,
        required: true
    },
    membershipPlan: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    planDetail: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isExpired: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })


export const Offer = mongoose.model("Offer", offerSchema)