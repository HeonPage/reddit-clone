import express from "express"
import morgan from "morgan"
import { AppDataSource } from "./data-source"
import authRoutes from './routes/auth'
import subRoutes from './routes/subs'
import postsRoutes from './routes/posts'
import votesRoutes from './routes/votes'
import usersRoutes from './routes/users'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"

const app = express()
const origin = "http://localhost:3000"

app.use(cors({
    origin,
    credentials: true
}))
app.use(express.json())
app.use(morgan("dev"))
app.use(cookieParser())
dotenv.config()

app.get("/", (_, res) => res.send("running"))
app.use("/api/auth", authRoutes)
app.use("/api/subs", subRoutes)
app.use("/api/posts", postsRoutes)
app.use("/api/votes", votesRoutes)
app.use("/api/users", usersRoutes)
app.use(express.static("public"))
let port = 4000
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`)

    // DB Connection
    AppDataSource.initialize().then(async () => {
        console.log("Database Initialized!")
    }).catch(error => console.log(error))

})