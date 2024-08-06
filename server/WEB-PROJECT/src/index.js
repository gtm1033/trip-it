// require('dotenv').config({path: './env'})
console.log(": ",process.env.TWILIO_ACCOUNT_SID)
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from './app.js'

dotenv.config({
    path: './env'
})




connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () =>{
        console.log(` Server is running at PORT : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO DB connection failed in index.js !!!",err);
})
