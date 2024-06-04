import mongoose from "mongoose";

const { Schema } = mongoose;

const PricingSchema = new Schema({
  servingName: { type: String },
  servingQuantity: { type: String },
  amount: { type: Number, required: true },
});

const ItemSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["Pure Veg", "Non Veg"], required: true },
    keyIngredients: { type: String },
    price:{type: Number},
    quantity:{type: String},
    pricing: { type: [PricingSchema] },
    images: { type: [{ type: Schema.Types.ObjectId, ref: "Image" }], max: 3 },
    enabled: { type: Boolean, default: true },
    discount: { type: Number, default: 0 },
    isSpecial: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Item", ItemSchema);
export const Pricing = mongoose.model("Pricing", PricingSchema);