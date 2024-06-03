import mongoose from 'mongoose';

const { Schema } = mongoose;

const FeedbackSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  message: { type: String, required: true },
});

export default mongoose.model('Feedback', FeedbackSchema);
