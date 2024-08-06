import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcrypt";

const agentSchema = new Schema({
    agentName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim:  true,
        // index: true,
    },
    lastName: {
        type: String,
        required: true,
        trim:  true,
        // index: true,
    },
    avatar: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    leads: {
        type: String,
    },
    loginTime: {
        type: String,
    },
    awayTime: {
        type: String
    },
    logoutTime: {
        type: String
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
}

)

agentSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    // console.log("hashed password",this.password);
    next()
})

agentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password )
}

agentSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            agentName: this.agentName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

agentSchema.methods.generateRefreshToken = function() {
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


export const Agent = mongoose.model("Agent", agentSchema)