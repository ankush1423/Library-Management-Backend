import express from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {checkRole} from '../middlewares/checkRole.middleware.js'

import {
   createBorrowwer,
   getBorrower,
   addBookToBorrower
   } from '../controllers/borrower.controller.js'

const router = express.Router()

router.use(verifyJWT)
router.use(checkRole)

router.route("/create-borrower").post(createBorrowwer)

router.route("/:borrowerId").get(getBorrower)

router.route("/add-book").post(addBookToBorrower)


export default router