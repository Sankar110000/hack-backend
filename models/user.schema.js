import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    location: {
      latitiue: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    alertHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disaster",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      {
        _id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname,
      },
      process.env.ACCESSTOKEN_SECERET,
      {
        expiresIn: process.env.ACCESSTOKEN_EXPIRY,
      }
    );
  };
  
  userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESHTOKEN_SECERET,
      {
        expiresIn: process.env.REFRESHTOKEN_EXPIRY,
      }
    );
  };

export const User = mongoose.model("User", userSchema);




