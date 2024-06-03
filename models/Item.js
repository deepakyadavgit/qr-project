import mongoose from 'mongoose';

const { Schema } = mongoose;

const PricingSchema = new Schema({
  servingName: { type: String },
  servingQuantity: { type: String },
  amount: { type: Number, required: true },
});

const ItemSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['Pure Veg', 'Non Veg'], required: true },
  keyIngredients: { type: String },
  pricing: { type: [PricingSchema], required: true },
  images: { type: [String], max: 3 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Item', ItemSchema);
