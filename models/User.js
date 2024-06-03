import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessName: { type: String, required: true },
  ownerFirstName: { type: String },
  ownerLastName: { type: String },
  googleLink: { type: String },
  qrCode: { type: String, required: true },  // New field for QR code
});

export default mongoose.model('User', UserSchema);
