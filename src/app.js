import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRoutes from './routes/user.route.js'
import authorRoutes from './routes/author.route.js'
import bookRoutes from './routes/book.route.js'
import borrowerRoutes from './routes/borrower.route.js'
import transactionRoutes from './routes/borrower.route.js'

app.use('/api/v1/users',userRoutes)
app.use('/api/v1/author',authorRoutes)
app.use('/api/v1/books',bookRoutes)
app.use('/api/v1/borroers',borrowerRoutes)
app.use('/api/v1/transactions',transactionRoutes)


export {app}