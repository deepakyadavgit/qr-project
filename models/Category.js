import mongoose from 'mongoose';

const { Schema } = mongoose;

const CategorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
});

export default mongoose.model('Category', CategorySchema);
