import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import QRCode from 'qrcode';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password, businessName } = req.body;
  try {
    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique URL for the QR code
    const uniqueUrl = `${process.env.APP_URL}/menu/${email}`;

    // Generate the QR code
    const qrCode = await QRCode.toDataURL(uniqueUrl);

    // Create the new user with the QR code
    const newUser = new User({ email, password: hashedPassword, businessName, qrCode });
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      throw Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match');
      throw Error('Invalid credentials');
    }

    res.json({ user: { _id: user._id, email: user.email, businessName: user.businessName } });
  } catch (err) {
    console.log('Error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Get user data by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw Error('User not found');
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
