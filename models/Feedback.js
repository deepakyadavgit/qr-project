import mongoose from "mongoose";

const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    message: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feedback", FeedbackSchema);
