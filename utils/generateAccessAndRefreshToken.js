import { User } from "../models/user.schema.js";
import ApiError from "./ApiError.js";

export async function generateAccessAndRefreshToken(userId){
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateAccessToken();
        const updatedUser = await User.findByIdAndUpdate(userId, {refreshToken}, {new: true});
        console.log(updatedUser);
        return {accessToken, refreshToken};
    } catch (error) {
        console.error("Error generating access and refresh token:", error);
        throw new ApiError(500, "Internal server error");
    }
} 