import { User } from "../api/v1/models/user.model.js";
import { Host } from "../api/v1/models/host/host.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Agent } from "../api/v1/models/agent.model.js";


export const verifyJWT = (Model) => asyncHandler( async(req , _ , next) => { 
  console.log("idhar aaya kya", Model);
  try {     
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")  
      if(!token){    
        throw new ApiError(401, "Unauthorized request")
      }
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      
      const model = await Model.findById(decodedToken?._id).select("-password -refreshToken");
      
      if(!model){
          throw new ApiError(401, "Invalid Access Token")
      }
      console.log('verifyJWT middleware invoked',Model);
      if(Model==User){
        req.user = model;
      }else if(Model==Host){
        req.hostData = model;
      }else if(Model==Agent){ 
        req.agent = model;
      }
      console.log("model",req.hostData);
      console.log("req",req.body);
      next();
  } 
  catch (error) {    
      throw new ApiError(401, error?.message || "Invalid access token")    
  }

})