import express from 'express';
import Item from '../models/Item.js';

const router = express.Router();

// Get all items for a user
router.get('/:userId', async (req, res) => {
  try {
    const items = await Item.find({ user: req.params.userId }).populate('category');
    res.json(items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new item
router.post('/', async (req, res) => {
  const { user, category, name, description, type, keyIngredients, pricing, images } = req.body;
  try {
    const newItem = new Item({ user, category, name, description, type, keyIngredients, pricing, images });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
