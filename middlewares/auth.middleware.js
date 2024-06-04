import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let { userId } = req.params;
    if (!userId) {
      userId = req.query.userId;
    }
    if (!userId) {
      userId = req.body.userId;
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "User not found");
    } else {
      req.user = user;
    }
    next();
  } catch (error) {
    res.status(error?.statusCode || 500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};
