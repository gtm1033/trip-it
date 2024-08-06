import { ApiError } from "../../../../utils/ApiError.js";
import { ApiResponse } from "../../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../../utils/asyncHandler.js";
import { Reservation } from "../../models/host/reservation.model.js";
import { User } from "../../models/user.model.js";
import { Listing } from "../../models/host/listing.model.js";

const getCreateReservation = asyncHandler( async(req, res) => {
    return res.status(200).json(
        new ApiResponse(200, "Create your reservation form here")
    )
})

const createReservation = asyncHandler( async(req, res) => {
    const {listId} = req.params;
    const userId = req.user._id;
    const {checkIn, checkOut} = req.body;
    console.log("userId:", userId);
    const user = await User.findById(userId);

    if(!user || !listId){
        throw new ApiError(401, "Unauthorized request")
    }
    const list = await Listing.findById(listId);
    if(!list){
        throw new ApiError(404, "Listing not found")
    }
    if(!(checkIn||checkOut)){
        throw new ApiError(401, "Please provide a check in and check out time")
    }
    if(checkIn >= checkOut){
        throw new ApiError(400, "Check out time must be greater than check in time")
    }

    // write a condition to check if the check in and check out time is available using mongoose queries 

    const reservation = await Reservation.find({
        listId,
        $or: [
            {checkIn: {$gte: checkIn, $lte: checkOut}},
            {checkOut: {$gte: checkIn, $lte: checkOut}},
            {checkIn: {$lte: checkIn}, checkOut: {$gte: checkOut}}
        ]
    })
    console.log("Reservation:", reservation);
    if(reservation.length>0){
        throw new ApiError(400, "The listing is already reserved for the selected time")
    }
    try{
        const reservation = await Reservation.create({
            listId,
            userId,
            checkIn,
            checkOut
        })
        return res.status(200).json(
            new ApiResponse(200, reservation, "Reservation made succesfully")
        )
    }catch(error){
        console.log("Error:",error);
        throw new ApiError(400, error.message || "Something went wrong while creating a reservation")
    }

})

const getReservations = asyncHandler( async(req, res) => {
    const {listId} = req.params;
    const reservations = await Reservation.find({listId})
    return res.status(200).json(
        new ApiResponse(200, reservations, "Reservations fetched successfully")
    )
})

const deleteReservation = asyncHandler( async(req, res) => {
    const{id} = req.params
    if(!id){
        throw new ApiError(400, "Please provide a valid reservation id")
    }
    try{
        await Reservation.findByIdAndDelete(id)
        res.status(200).json(
            new ApiResponse(200, "Reservation cancelled successfully")
        )
    }catch(error){
        console.log("Error: ",error);
        throw new ApiError(400, "Something went wrong while cancelling the reservation")
    }
})
export {
    getCreateReservation,
    createReservation,
    getReservations,
    deleteReservation
}