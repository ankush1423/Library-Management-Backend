import { User } from "../models/index.js";
import { asyncHandler , ApiError , ApiResponse , uploadOnCloudinary} from "../utils/index.js";
import jwt from 'jsonwebtoken'

const generateAccessAndRefresh = async function(userId){
     try
     {   
        const user = await User.findById(userId)
         if(!user)
         {
            throw new ApiError(400,"error while gitting the user")
         }
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken , refreshToken}
     }
     catch(error)
     {
        console.log(error)
     }
}

export const userRegister = asyncHandler(async(req , res) => {

    const {
       userName,
       email,
       password,
       address,
       phoneNumber
    } = req.body

    if(!userName || !email || !password || !address || !phoneNumber)
    {
       throw new ApiError("all feilds are mandatry")
    }

    const user = await User.create({
        userName,
        email,
        password,
        address,
        phoneNumber
    })

    const registerUser = await User.find({userName : userName}).select("-password -refreshToken")
    
    if(!registerUser)
    {
        throw new ApiError("Error while creating a user")
    }
    
    return res.status(200).json(
         new ApiResponse(
            registerUser,
            "user registerd successFully"
         )
    )
    
})

export const userLogin = asyncHandler(async(req,res) => {
     const {email , password} = req.body

     if(!email || !password)
     {
        throw new ApiError("all feilds are mandatry")
     }

     const user = await User.find({email : email}).select("-password -refreshToken")

     if(!user)
     {
        throw new ApiError("user not found with this email")
     }

     const isPasswordCorrect  = await user.comparePassword(password)

     if(!isPasswordCorrect)
     {
        throw new ApiError("please provide a valid password...")
     }
     
     const {accessToken , refreshToken} = generateAccessAndRefresh(user._id)
     
     const loginuser = await User.findById(user._id).select("-password -refreshtoken")

     const options = {
        httpOnly : true,
        secure : true
    }
    
    return res
           .status(200)
           .cookie('accessToken',accessToken,options)
           .cookie('refreshToken',refreshToken,options)
           .json(
              new ApiResponse(
                 loginuser,
                 "user login successfully"
              )
           )
})

export const logoutUser = asyncHandler(async(req , res) => {
     await User.findByIdAndUpdate(
         req?.user._id,
         {
            $unset : {
                refreshToken : 1
            }
         },
         {
            new : true
         }
     )

     const options = {
         httpOnly : true,
         secure : true
     }
     return res
            .status(200)
            .clearCookie('accessToken',options)
            .clearCookie('refreshToken',options)
            .json(
                new ApiResponse(
                    {},
                    "User logout successfully"
                )
            )
})

export const refreshAccessToken = asyncHandler(async(req,res) => {

     const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

     if(!incomingRefreshToken)
     {
        throw new ApiError("Error while getting the refresh Token")
     }

     try 
     {  
        const decodedToken = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id)
        
        if(!user)
        {
            throw new ApiError("invalid refresh token")
        }

        if(incomingRefreshToken !== user?.refreshToken)
        {
            throw new ApiError("Invalid Refresh Token")
        }

        const {accessToken , refreshToken} = await generateAccessAndRefresh(user?._id)   
        const options = {
           httpOnly : true,
           secure : true
        }
   
        return res
               .status(200)
               .cookie('accessToken',accessToken,options)
               .cookie('refreshToken',refreshToken,options)
               .json(
                   new ApiResponse(
                    {},
                    "access token refresh successFully"
                   )
               )
     } 
     catch (error) 
     {
        console.log("error while verify the refresh Token")
     }
})

export const changeCurrentPassword = asyncHandler(async(req,res) => {
     const {oldPassword , newPassword} = req.body
     if(!oldPassword || !newPassword)
     {
         throw new ApiError("please provide the both feilds")
     }

     const user = await User.findById(req?.user._id)
     if(!user)
     {
        throw new ApiError("error while getting the user")
     }

     const isPasswordCorrect = await user.comparePassword(oldPassword)

     if(!isPaaswordCorrect)
     {
        throw new ApiError("please provide the valid password")
     }

     user.password = newPassword
     await user.save({validateBeforeSave : false})

     return  res 
             .status(200)
             .json(
                new ApiResponse(
                    {},
                    "password changed SuccessFully"
                )
             )
})

export const getCurentUser = asyncHandler(async(req,res) => {
    return res
           .status(200)
           .json(
              new ApiResponse(
                 req?.user,
                 "user find successfully"
              )
           )
})

export const updateAccountDetails = asyncHandler(async(req , res) => {
    const {
        userName,
        email,
        address,
        phoneNumber
    } = req.body

    if(
        [userName,email,address,phoneNumber].some(feild => feild?.trim() === undefiend)
    ){
        throw new ApiError("please enter the feild")
    }

    const updatedUser = await User.findByIdAndUpdate(
         req?.user._id,
         {
            $set : {
                userName,
                email,
                address,
                phoneNumber
            }
         },
         {
            new : true
         }
    ).select("-password -refreshToken -borrowedBooks -role")

    if(!updatedUser)
    {
        throw ApiError("Error while updating the user")
    }

    return res
           .status(200)
           .json(
              new ApiResponse(
                  updatedUser,
                  "user updated Successfully"
              )
           )
})

export const updateProfilePicture = asyncHandler(async(req , res) => {
     const profilePath = req?.file.path
     if(!profilePath)
     {
        throw new ApiError("Error while getting the path")
     }

     const profileRefrence = await uploadOnCloudinary(profilePath)
     if(!profileRefrence)
     {
        throw new ApiError("Error while upload on the coludnary")
     }

     const updatedUser = await User.findByIdAndUpdate(
         req?.user_id,
         {
            $set : {
                profilePicture : profileRefrence?.url || ''
            }
         },
         {
            new : true
         }
     ).select("-password -refreshToken -borrowedBooks -role")

     if(!updatedUser)
     {
        throw new ApiError("Error while updating the user")
     }

     return res
            .status(200)
            .json(
                new ApiResponse(
                    updatedUser,
                    "user profile updated SuccessFully"
                )
            )
})