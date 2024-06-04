import Category from "../models/Category.js";
import { CatchError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(new ApiResponse(200, categories, "Categories fetched"));
  } catch (err) {
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name, user: req.user._id });
    await newCategory.save();
    res.json(new ApiResponse(200, newCategory, "Category created"));
  } catch (err) {
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw Error("Category not found");
    console.log(req.user);
    console.log(category.user);
    if (!category.user.equals(req.user._id))
      throw Error("You are not allowed to update this category");
    category.name = name;
    await category.save();
    res.json(new ApiResponse(200, category, "Category updated"));
  } catch (err) {
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json(new ApiResponse(200, {}, "Category deleted"));
  } catch (err) {
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};
