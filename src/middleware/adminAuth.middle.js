import jwt from "jsonwebtoken"
import { Admin } from '../model/admin.model.js'

export const adminVerifyJWT = async function (req, res, next) {
    try {
        const adminToken = req.cookies?.accessTokenAdmin || req.header("Authorization")?.replace("Bearer ", "")

        //console.log("adminToken", adminToken);
        if (!adminToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request in admin"
            })
        }

        const decodedToken = jwt.verify(adminToken, process.env.ACCESS_TOKEN_SECRET)

        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid Admin Access Token"
            })
        }

        req.admin = admin;
        next()
    } catch (error) {
        console.log("auth error", error);
        return res.status(401).json({
            success: false,
            message: "Invalid Admin  Access Token"
        })
    }
}