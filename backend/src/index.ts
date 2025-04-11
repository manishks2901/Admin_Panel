import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from "dotenv"
import { protectRoute } from "./middleware/auth.middleware"
import authRouter from "./routes/auth.routes"


dotenv.config()
const app = express()
const PORT = process.env.PORT;


app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRouter)





app.listen(PORT,() => {
    console.log("Server is listen on port :-" + PORT)
})

