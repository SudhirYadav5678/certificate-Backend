import { User } from "../model/user.model.js"
import { deleteCloudinary, uploadOnCloudinary } from "../utiles/cloudinary.js"


const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        return new Error("Something went wrong while generating referesh and access token")
    }
}

const registerUser = async function (req, res) {
    const { fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        return res.status(409).json({
            success: false,
            message: "All fields are required"
        })
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        return res.status(409).json({
            success: false,
            message: "User with email or username already exists"
        })
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    //console.log("avatarLocalPath", avatarLocalPath);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    //console.log(avatar);


    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while registering the user"
        })
    }

    return res.status(201).json(
        {
            success: true,
            message: "User registered Successfully"
        }
    )

}

const loginUser = async function (req, res) {
    const { email, username, password } = req.body
    //console.log(email);

    if (!username && !email) {
        return res.status(400).json({
            success: false,
            message: "username or email is required"
        })
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        })
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid user credentials"
        })
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "User login successfully",
            user: loggedInUser, accessToken, refreshToken
        })
}

const logoutUser = async function (req, res) {
    await User.findByIdAndUpdate(
        req.user._id,
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
            message: "User logout successful"
        })

}

const updateUser = async function (req, res) {
    const { fullName, email, username, password } = await req.body;
    //console.log(fullName, email, username, password);

    const user = await User.findById(req.user?._id)
    if (!user) {
        return res.status(409).json({
            success: false,
            message: "Unauthorized access"
        })
    }

    if (fullName) { user.fullName = fullName }
    if (email) { user.email = email }
    if (username) { user.username = username }
    if (password) { user.password = password }


    await user.updateOne({
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        password: user.password,
    })

    return res.status(200)
        .json({
            success: true,
            message: "Update successfully",
            user: user
        })
}

const updateAvatar = async function (req, res) {
    const user = await User.findById(req.user?._id,);
    if (!user) {
        return res.status(409).json({
            success: false,
            message: "Unauthorized access"
        })
    }
    const avatarUrl = user.avatar;
    //console.log("avatarUrl", avatarUrl);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        return res.status(400).json({
            success: false,
            message: "Avatar file is missing"
        })
    }

    //delete old image
    const removeAvatar = await deleteCloudinary(avatarUrl);
    //console.log("removeAvatar", removeAvatar);

    //uploade
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        return res.status(400).json({
            success: false,
            message: "Error while uploading on avatar"
        })
    }

    await User.updateOne({
        $set: {
            avatar: avatar.url
        }
    }).select("-password")

    return res
        .status(200)
        .json(
            {
                success: true,
                message: "Avatar image updated successfully"
            }
        )
}

const deleteUser = async function (req, res) {
    const user = await User.findById(req.user._id)
    //console.log(user);
    if (!user) {
        console.log("user do not found");
    }

    const deleteUser = await user.deleteOne({ user: user._id })
    console.log(deleteUser);

    return res.status(200).cookie("token", "").json({
        success: true,
        message: "User deleted"
    })
}
export {
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    updateAvatar,
    deleteUser
}