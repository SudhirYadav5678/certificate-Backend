import dotenv from 'dotenv'
import express, { json } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRouter from './router/userRouter.js'
import adminRouter from './router/adminRouter.js'
import certificateRouter from './router/certificateRouter.js'
import templateRouter from "./router/templateRouter.js"
dotenv.config({
    path: './.env'
})

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.static("public"))
app.use(json())
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

//router
app.use("/api/v1/user", userRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/certificate", certificateRouter)
app.use("/api/v1/template", templateRouter)
export { app }