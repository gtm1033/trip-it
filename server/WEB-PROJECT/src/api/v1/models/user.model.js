import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        phoneNumber: {
            type: String,
            required: true
        },
        phoneVerified: {
            type: Boolean,
            default: false,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        },
        wishList: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Listing' }],
            ref: "Listing"
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            firstname: this.firstname,
            lastname: this.lastname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.pre('deleteOne', async function(next) {
    try{
        const Reservation = mongoose.model('Reservation');
        console.log("pre remove Reservation for user:", Reservation,  this.getQuery()['_id']);
        await Reservation.deleteMany({ userId: this.getQuery()['_id'] });
        next();    

    }catch(error){
        console.log("Error:", error);
    }
});

export const User = mongoose.model("User",userSchema)