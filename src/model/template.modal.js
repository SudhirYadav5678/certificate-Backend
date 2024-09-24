import mongoose, { Schema } from 'mongoose'

const templateSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    urlOfTemplate: {
        type: String,
        required: true,
        trim: true
    },
    ownerOfTemplate: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true })

export const Template = mongoose.model("Template", templateSchema);