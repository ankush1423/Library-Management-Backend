import { app } from "./app.js";
import connectDB from "./database/db.js";

const port = process.env.PORT || 8080

const start = async() => {
     try
     {
        await connectDB(process.env.MONGODB_URI)
        console.log("Database Is Connected Successfully")
        app.listen(port,() => console.log("PORT LISTEN AT ",port))
     }
     catch(error)
     {
        console.log("Error on connectin to the Database : ",error)
     }
}

start()
