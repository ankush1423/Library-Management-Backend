import jwt from 'jsonwebtoken'
import { ApiError, asyncHandler} from '../utils/index.js'
import {User} from '../models/index.js'

export const verifyJWT = asyncHandler(async(req , res , next) => {
    try
    {
       const token = req.cookies?.accessToken ||  req.header("Authorization")?.replace("Bearer ","")

       if(!token)
       {
          throw new ApiError("Error while getting the Access Token")
       }

       const decode =  jwt.decode(accessToken,process.env.ACCESS_TOKEN_SECRET)

       if(!decode)
       {
          throw new ApiError("Error while decoding the token")
       }

       const user = await User.findById(decode._id).select("-password -refreshToken")
       
       if(!user)
       {
          throw new ApiError("Invalid Access Token")
       }

       req.user = user
       next()
    }
    catch(error)
    {
       console.log("Error while verifying the access Token : ",error)
    }
})