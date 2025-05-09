import { User } from "../models/user.schema.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";

export const registerUser = async (req, res) => {
  
    console.log("req.body", req.body);
  try {
    const { username, email, password, phoneNumber } = req.body;

    if (
      [username, password, email, phoneNumber].some((field) => {
        return field.trim() == "";
      })
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
      return res.json(new ApiError(400, "User already exists"));
    }

    const user = new User({
      username,
      email,
      password,
      phoneNumber,
    });

    const savedUser = await user.save();

    res.status(200).json(
      new ApiResponse(
        {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          phoneNumber: savedUser.phoneNumber,
        },
        200,
        "User registered successfully"
      )
    );
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json(new ApiError(500, "Error while registering"));
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (
      [username, password].some((field) => {
        return field.trim() == "";
      })
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
      return res.status(400).json(new ApiError(400, "User not found"));
    }

    const hashedPassword = await user.isPasswordCorrect(password);

    if (!hashedPassword) {
      return res.status(400).json(new ApiError(400, "Password is incorrect"));
    }

    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const loggedinUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(new ApiResponse(loggedinUser, 200, "user loggedin successfully"));

  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Error while logging in"));
  }
};
