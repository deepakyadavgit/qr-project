import express from 'express';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Get all feedbacks for a user
router.get('/:userId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create a new feedback
router.post('/', async (req, res) => {
  const { user, message } = req.body;
  try {
    const newFeedback = new Feedback({ user, message });
    await newFeedback.save();
    res.json(newFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
