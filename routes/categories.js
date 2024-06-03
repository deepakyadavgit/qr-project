import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

// Get all categories for a user
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id });
    res.json(categories);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = new Category({ name, userId: req.user.id });
    await newCategory.save();
    res.json(newCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw Error('Category not found');

    category.name = name;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
