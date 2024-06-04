import express from "express";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = express.Router();

// Get all feedbacks for a user
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const feedbacks = await Feedback.find({ email: user.email }).sort({
      date: -1,
    });
    return res.json(
      new ApiResponse(200, feedbacks, "Feedbacks fetched successfully")
    );
  } catch (err) {
    res.status(err?.statusCode || 500).json({
      error: err?.message || "Something went wrong",
      success: false,
    });
  }
});

// Create a new feedback
router.post("/", async (req, res) => {
  const { email, feedback } = req.body;
  try {
    const newFeedback = new Feedback({ email, message: feedback });
    await newFeedback.save();
    return res.json(
      new ApiResponse(200, newFeedback, "Feedback created successfully")
    );
  } catch (err) {
    res.status(err?.statusCode || 500).json({
      error: err?.message || "Something went wrong",
      success: false,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    return res.json(new ApiResponse(200, feedback, "Feedback deleted successfully"));
  } catch (err) {
    res.status(err?.statusCode || 500).json({
      error: err?.message || "Something went wrong",
      success: false,
    });
  }
});

export default router;
