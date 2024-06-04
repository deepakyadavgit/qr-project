import express from "express";
import Item from "../models/Item.js";
import User from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const router = express.Router();

// Get menu for a user by email
router.get("/:email", async (req, res) => {
  try {
    const userEmail = req.query.email || req.params.email;
    const userDetails = await User.findOne({
      email: userEmail,
    }).select("businessName _id email");

    if (!userDetails) {
      throw new ApiError(404, "User not found");
    }

    const items = await Item.find({ user: userDetails._id, enabled: true })
      .populate("category")
      .populate("pricing");

    return res.json(
      new ApiResponse(
        200,
        {
          businessName: userDetails.businessName,
          items,
        },
        "Menu preview fetched successfully"
      )
    );
  } catch (err) {
    res.status(err?.statusCode || 500).json({
      error: err?.message || "Something went wrong",
      success: false,
    });
  }
});

export default router;
