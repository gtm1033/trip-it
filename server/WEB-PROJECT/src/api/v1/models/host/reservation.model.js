import mongoose,{Schema} from "mongoose";


const reservationSchema = new Schema({

    listId: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkIn: {
        type: Date,
        required: true 
    },
    checkOut: {
        type: Date,
        required: true 
    }
},{timestamps: true})

reservationSchema.pre('validate', function (next) {
    if (this.checkIn >= this.checkOut) {
        this.invalidate('checkOut', 'check out time must be greater than check in time');
    }
    next();
});


export const Reservation = mongoose.model("Reservation", reservationSchema)