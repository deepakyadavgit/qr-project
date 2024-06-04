import bcrypt from "bcrypt";
import QRCode from "qrcode";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Category from "../../models/Category.js";
import User from "../../models/User.js";
import { ApiError } from "../../utils/ApiError.js";

export const register = async (req, res) => {
  const { email, password, businessName } = req.body;
  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique URL for the QR code
    const uniqueUrl = `${process.env.APP_URL}/${email}`;

    // Generate the QR code
    const qrCode = await QRCode.toDataURL(uniqueUrl);

    const existingUser = await User.findOne({ email }); 
    if(existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const newUser = await User.create({
      email,
      password: hashedPassword,
      businessName,
      qrCode,
    });

    await Category.create({
      user: newUser._id,
      name: "Uncategorized",
    });

    return res.json(new ApiResponse(200, newUser, "User registered successfully"));
  
  } catch (err) {
    console.log("Error:", err.message);
    res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};
