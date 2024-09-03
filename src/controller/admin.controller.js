import { Admin } from "../model/admin.model.js";
import { deleteCloudinary, uploadOnCloudinary } from "../utiles/cloudinary.js"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const admin = await Admin.findById(userId)
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken
        await admin.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        return new Error("Something went wrong while generating referesh and access token")
    }
}

const registerAdmin = async function (req, res) {
    const { adminname, email, institute, password } = req.body

    if (
        [adminname, email, institute, password].some((field) => field?.trim() === "")
    ) {
        return res.status(409).json({
            success: false,
            message: "All fields are required"
        })
    }

    const existedUser = await Admin.findOne({
        $or: [{ institute }, { email }]
    })

    if (existedUser) {
        return res.status(409).json({
            success: false,
            message: "institute with email or institute already exists"
        })
    }

    const logoLocalPath = req.files?.logo?.[0]?.path;
    //console.log("avatarLocalPath", avatarLocalPath);

    const logo = await uploadOnCloudinary(logoLocalPath);
    //console.log(avatar);


    const user = await Admin.create({
        adminname, email, institute, password, logo: logo?.url
    })

    const createdUser = await Admin.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the institute"
        })
    }

    return res.status(201).json(
        {
            success: true,
            message: "institute registered Successfully"
        }
    )

}


export { registerAdmin }