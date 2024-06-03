import express from 'express';
import Item from '../models/Item.js';
import User from '../models/User.js';

const router = express.Router();

// Get menu for a user by email
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) throw Error('User not found');

    const items = await Item.find({ user: user._id }).populate('category');
    res.json({ businessName: user.businessName, items });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
