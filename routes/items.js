import express from "express";
import {
  applyDiscount,
  createItem,
  getAllItems,
  getEnabledItems,
  markItemsTodaysSpecial,
  menuPreview,
  updateItems,
} from "../controllers/itemcontroller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all items for a user
router.get("/:userId", authMiddleware, getEnabledItems);

// Get all items for a user
router.get("/all/:userId", authMiddleware, getAllItems);

// Create a new item
router.post("/", upload.array("images"), authMiddleware, createItem);

// Update list of items
router.put("/:userId", authMiddleware, updateItems);

// Mark items as today's special
router.put("/todaysSpecial/:userId", authMiddleware, markItemsTodaysSpecial);

// Get menu preview
router.get("/menuPreview/:userId", authMiddleware, menuPreview);

// Apply discount to an item
router.put("/applyDiscount/:userId", authMiddleware, applyDiscount);

export default router;
