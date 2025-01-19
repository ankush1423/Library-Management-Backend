import {User} from '../models/index.js'
import {asyncHandler , ApiError , ApiResponse} from '../utils/index.js'

export const checkRole = asyncHandler(async(req,res,next) => {
     try
     {
        const user = await User.findById(req?.user._id)
        if(user?.role === 'librarian')
        {
            return next()
        }
        else
        {
            throw new ApiError('only Librarian can create a author')
        }
     }
     catch(error)
     {
        console.log("Error while checking the role of user : ",error)
     }
})