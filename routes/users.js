import express from "express";
import User from "../models/User.js";
import { register } from "../controllers/auth/register.js";
import { login } from "../controllers/auth/login.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login a user
router.post("/login", login);

// Get user data by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    return res.json(new ApiResponse(200, user, "User fetched successfully"));
  } catch (err) {
    res.status(err?.statusCode || 500).json({
      error: err?.message || "Something went wrong",
      success: false,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    const { businessName, ownerLastName, ownerFirstName, googleLink } =
      req.body;
    if (businessName) {
      user.businessName = businessName;
    }
    if (ownerLastName) {
      user.ownerLastName = ownerLastName;
    }
    if (ownerFirstName) {
      user.ownerFirstName = ownerFirstName;
    }
    if (googleLink) {
      user.googleLink = googleLink;
    }
    await user.save();
    return res.json(new ApiResponse(200, user, "User updated successfully"));
  } catch (err) {
    res.status(err?.statusCode || 500).json({
      error: err?.message || "Something went wrong",
      success: false,
    });
  }
});

export default router;
