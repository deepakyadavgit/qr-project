import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all categories for a user
router.get("/", authMiddleware, getCategories);

// Add a new category
router.post("/", authMiddleware, createCategory);

// Update a category
router.put("/:id", authMiddleware, updateCategory);

// Delete a category
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
