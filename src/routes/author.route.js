import express from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {checkRole} from '../middlewares/checkRole.middleware.js'

import {
    createAuthor,
    getAllAuthor,
    getAuthor,
    updateAuthor,
    deleteAuthor
     } from '../controllers/author.controller.js'

const router = express.Router()

router.use(verifyJWT)

router.route("/create-author").post(checkRole,createAuthor)

router.route("/:authorId").get(getAuthor).post(updateAuthor).delete(deleteAuthor)

router.route("/").get(getAllAuthor)

export default router;