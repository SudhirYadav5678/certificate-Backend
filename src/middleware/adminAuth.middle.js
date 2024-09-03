import jwt from "jsonwebtoken"
import { Admin } from '../model/admin.model.js'

export const adminverifyJWT = async function (req, res, next) {
    try {
        const adminToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // console.log(token);
        if (!adminToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request"
            })
        }

        const decodedToken = jwt.verify(adminToken, process.env.ACCESS_TOKEN_SECRET)

        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid Access Token"
            })
        }

        req.admin = admin;
        next()
    } catch (error) {
        console.log("auth error", error);
        return res.status(401).json({
            success: false,
            message: "Invalid Access Token"
        })
    }
}