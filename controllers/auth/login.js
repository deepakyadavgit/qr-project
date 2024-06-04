import User from "../../models/User.js";
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Category from "../../models/Category.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      throw new ApiError(401, "Password does not match");
    }

    return res.json(new ApiResponse(200, {
      user: user._id,
      email: user.email,
      businessName: user.businessName,
    }, "User logged in successfully"));
  } catch (err) {
    console.log("Error:", err);
    res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};
