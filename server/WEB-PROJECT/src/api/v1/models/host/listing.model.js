import mongoose, {Schema} from "mongoose";

const ListingSchema = new Schema({
        hostId: {
            type: Schema.Types.ObjectId,
            ref: "Host",
            required: true
        },
        category: {
            type: String,
            enum: ["Beachfront", "Iconic cities", "Mountain", "Rural", "Ski", "Urban", "Village", "Waterfront",
                    "countrySide", "Desert", "Forest", "Island", "Jungle", "Lake", "River", "Seaside", "Valley",
                    "Windmills", "Other"],
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        streetAddress: {
            type: String,
            required: true,
        },
        aptSuite: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        guestCount: {
            type: Number,
            required: true,
        },
        bedroomCount: {
            type: Number,
            required: true,
        },
        bedCount: {
            type: Number,
            required: true,
        },
        bathroomCount: {
            type: Number,
            required: true,
        },
        facilities: {
            type: Array,
            default:[]
        },
        listingPhotoPaths: [{ type: String }], // Store photo URLs
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        highlight: {
            type: String,
            required: true
        },
        highlightDesc: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true}
);

ListingSchema.pre('findOneAndDelete', async function(next) {
    try{
        const Reservation = mongoose.model('Reservation');
        console.log("pre remove Reservation for listing:", Reservation,  this.getQuery()['_id']);
        await Reservation.deleteMany({ listId: this.getQuery()['_id'] });
        next();    

    }catch(error){
        console.log("Error:", error);
    }
});

export const Listing = mongoose.model('Listing', ListingSchema);
