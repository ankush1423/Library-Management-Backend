import express from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {checkRole} from '../middlewares/checkRole.middleware.js'

import {
     createBook,
     getAllBooks,
     getBook,
     updateBookDetails,
     deleteBook
   }  from '../controllers/book.controller.js'

const router = express.Router()

router.use(verifyJWT)

router.route("/create-book").post(checkRole,upload.single('coverImage'),createBook)

router.route("/:bookId").get(getBook).post(updateBookDetails).delete(deleteBook)

router.route("/").get(getAllBooks)

export default router