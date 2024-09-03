import mongoose, { Schema } from 'mongoose'

const resultSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    fatherName: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }

}, { timestamps: true })


export const Result = mongoose.model("Result", resultSchema);