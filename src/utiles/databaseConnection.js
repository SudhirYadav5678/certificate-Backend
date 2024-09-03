import mongoose from "mongoose";

export const database = async function () {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database conneted");

    } catch (error) {
        console.log("Error in database connection", error);
        process.exit(1);
    }
}