import express from 'express'
import {upload} from '../middlewares/multer.middleware.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'
import {checkRole} from '../middlewares/checkRole.middleware.js'

import {

   } from '../controllers/transaction.controller.js'

const router = express.Router()

router.use(verifyJWT)
router.use(checkRole)


export default router;