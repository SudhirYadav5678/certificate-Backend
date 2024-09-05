import { Admin } from "../model/admin.model.js";
import { deleteCloudinary, uploadOnCloudinary } from "../utiles/cloudinary.js"

const generateAccessAndRefereshTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId)
        const accessTokenAdmin = admin.generateAccessToken()
        const refreshTokenAdmin = admin.generateRefreshToken()

        admin.refreshToken = refreshTokenAdmin
        await admin.save({ validateBeforeSave: false })

        return { accessTokenAdmin, refreshTokenAdmin }


    } catch (error) {
        return new Error("Something went wrong while generating referesh and access token")
    }
}

const registerAdmin = async function (req, res) {
    const user = req.user._id;
    //console.log(user);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "user not foud Login With user Id first"
        })
    }

    const { adminname, email, institute, password } = req.body
    //console.log(adminname, email, institute, password);

    if (
        [adminname, email, institute, password].some((field) => field?.trim() === "")
    ) {
        return res.status(409).json({
            success: false,
            message: "All fields are required"
        })
    }

    const existedAdmin = await Admin.findOne({
        $or: [{ institute }, { email }]
    })

    if (existedAdmin) {
        return res.status(409).json({
            success: false,
            message: "institute with email or institute already exists"
        })
    }

    const logoLocalPath = req.files?.logo?.[0]?.path;
    console.log("avatarLocalPath", avatarLocalPath);

    const logo = await uploadOnCloudinary(logoLocalPath);
    //console.log(avatar);


    const admin = await Admin.create({
        adminname, email, institute, password, logo: logo?.url, user
    })

    const createdAdmin = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    )

    if (!createdAdmin) {
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

const loginAdmin = async function (req, res) {
    const { email, institute, password } = req.body
    //console.log(email);

    if (!institute && !email) {
        return res.status(400).json({
            success: false,
            message: "username or email is required"
        })
    }

    const admin = await Admin.findOne({
        $or: [{ institute }, { email }]
    })

    if (!admin) {
        return res.status(400).json({
            success: false,
            message: "Admin does not exist"
        })
    }

    const isPasswordValid = await admin.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid user credentials"
        })
    }

    const { accessTokenAdmin, refreshTokenAdmin } = await generateAccessAndRefereshTokens(admin._id)

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessTokenAdmin", accessTokenAdmin, options)
        .cookie("refreshTokenAdmin", refreshTokenAdmin, options)
        .json({
            success: true,
            message: "Admin login successfully",
            user: loggedInAdmin, accessTokenAdmin, refreshTokenAdmin
        })
}

const logoutAdmin = async function (req, res) {
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "Admin logout successful"
        })

}

const updateAdmin = async function (req, res) {
    const { adminname, email, institute, password } = await req.body;
    //console.log(adminname, email, institute, password);

    const admin = await Admin.findById(req.admin?._id)
    if (!admin) {
        return res.status(409).json({
            success: false,
            message: "Unauthorized access"
        })
    }

    if (adminname) { user.adminname = adminname }
    if (email) { user.email = email }
    if (institute) { user.institute = institute }
    if (password) { user.password = password }


    await admin.updateOne({
        adminname: user.adminname,
        email: user.email,
        institute: user.institute,
        password: user.password,
    })

    return res.status(200)
        .json({
            success: true,
            message: "Update successfully",
            admin: admin
        })
}

const updateLogo = async function (req, res) {
    const admin = await Admin.findById(req.user?._id,);
    if (!admin) {
        return res.status(409).json({
            success: false,
            message: "Unauthorized access"
        })
    }
    const logoUrl = admin.avatar;
    //console.log("avatarUrl", avatarUrl);

    const logoLocalPath = req.files?.logo?.[0]?.path;
    if (!logoLocalPath) {
        return res.status(400).json({
            success: false,
            message: "Avatar file is missing"
        })
    }

    //delete old image
    const removeLogo = await deleteCloudinary(logoUrl);
    //console.log("removeAvatar", removeAvatar);

    //uploade
    const logo = await uploadOnCloudinary(logoLocalPath);

    if (!logo.url) {
        return res.status(400).json({
            success: false,
            message: "Error while uploading on avatar"
        })
    }

    await admin.updateOne({
        $set: {
            logo: logo.url
        }
    }).select("-password")

    return res
        .status(200)
        .json(
            {
                success: true,
                message: "Logo image updated successfully"
            }
        )
}

const deleteAdmin = async function (req, res) {
    const admin = await Admin.findById(req.admin._id)
    //console.log(user);
    if (!admin) {
        console.log("user do not found");
    }

    const deleteAdmin = await user.deleteOne({ admin: admin._id })
    console.log(deleteAdmin);

    return res.status(200).cookie("token", "").json({
        success: true,
        message: "User deleted"
    })
}
export { registerAdmin, loginAdmin, logoutAdmin, updateAdmin, updateLogo, deleteAdmin }