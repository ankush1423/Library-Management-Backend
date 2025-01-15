import express from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

import {
         userRegister,
         userLogin,
         logoutUser,
         refreshAccessToken,
         changeCurrentPassword,
         getCurentUser,
         updateAccountDetails,
         updateProfilePicture
     } from '../controllers/user.controller.js'

const router = express.Router()

router.route("/register").post(userRegister)

router.route("/login").post(userLogin)

router.route("/logout-user").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(verifyJWT,refreshAccessToken)

router.route("/").get(verifyJWT,getCurentUser)

router.route("/update-account-detail").post(verifyJWT,updateAccountDetails)

router.route("/update-profile-picture").post(verifyJWT,upload.single("profilePicture"),updateProfilePicture)

router.route("/change-current-password").post(verifyJWT,changeCurrentPassword)

export default router