import { text } from "express";
import mongoose, {Schema} from "mongoose";


const messageSchema = new Schema({
    hostId: {
        type: Schema.Types.ObjectId,
        ref: "Host",
        required: true
    },
    content: {
        type: String,
        required: true
    }},
    {timestamps: true}
)

export const Message = mongoose.model("Message",messageSchema)
