
import { ApiError } from "../../../../utils/ApiError.js";
import { asyncHandler } from "../../../../utils/asyncHandler.js";
import { Message } from "../../models/host/message.model.js";
import { ApiResponse } from "../../../../utils/ApiResponse.js";

const createMessage = asyncHandler( async(req, res) => {

    const {content} = req.body
    const {hostId} = req.params

    if(!(content || hostId)){
        throw new ApiError(400, "All the fields are required");
    }
    try{
        const msg = await Message.create({
            hostId,
            content,
        })

        return res.status(200).json(
            new ApiResponse(200, msg ,"message created succesfully")
        )
    }catch(error){
        console.log("Error: ",error);
        throw new ApiError(400, "Something went wrong while creating message")
    }
})

export {createMessage}