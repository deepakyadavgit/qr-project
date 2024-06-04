import Category from "../models/Category.js";
import Image from "../models/Image.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import { ApiError, CatchError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const getEnabledItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.params.userId, enabled: true })
      .populate("category")
      .populate("pricing");
    return res.json(new ApiResponse(200, items, "Items fetched successfully"));
  } catch (err) {
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.params.userId })
      .populate("category")
      .populate("pricing");
    return res.json(new ApiResponse(200, items, "Items fetched successfully"));
  } catch (err) {
    res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};

export const createItem = async (req, res) => {
  try {
    const {
      category,
      name,
      description,
      type,
      keyIngredients,
      pricing,
      pricingType,
      quantity,
      price,
    } = req.body;

    console.log(req.body);

    if (!category || !name || !description || !type || !keyIngredients) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (pricingType === "single") {
      if (!price) {
        return res.status(400).json({ error: "Missing price field" });
      }
    } else {
      if (!pricing) {
        return res.status(400).json({ error: "Missing required fields" });
      }
    }

    const images = req.files;
    const imagesArray = [];
    if (images) {
      let maxImage = images;
      if (images.length > 3) {
        maxImage = images.splice(3);
      }
      // upload images on cloudinary
      for (const image of maxImage) {
        const imageLocalPath = image.path;
        if (imageLocalPath) {
          const image = await Image.create({
            img: {
              data: fs.readFileSync(
                path.join(__dirname + "/uploads/" + imageLocalPath)
              ),
              contentType: "image/png",
            },
          });
          imagesArray.push(image._id);
        }
      }
    }

    const userData = req.user;
    let categoryData = await Category.findOne({
      name: category,
      user: userData._id,
    });
    if (!categoryData) {
      throw new ApiError(404, "Category not found");
    }

    const newItem = new Item({
      user: userData._id,
      category: categoryData?._id,
      name,
      description,
      type,
      keyIngredients,
      price: pricingType === "single" ? price : null,
      quantity: pricingType === "single" ? (quantity ? quantity : null) : null,
      pricing: pricingType === "multiple" ? pricing : null,
      images: imagesArray,
    });
    await newItem.save();
    return res.json(new ApiResponse(200, newItem, "Item created successfully"));
  } catch (err) {
    console.log(err);
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};

export const updateItems = async (req, res) => {
  try {
    const { updatedItems } = req.body;

    updatedItems.map(async (item) => {
      await Item.findByIdAndUpdate(item._id, {
        enabled: item.enabled,
      });
    });
    const items = await Item.find({ user: req.params.userId })
      .populate("category")
      .populate("pricing");
    return res.json(new ApiResponse(200, items, "Items updated successfully"));
  } catch (err) {
    console.log(err);
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};

export const markItemsTodaysSpecial = async (req, res) => {
  try {
    const { updatedItems } = req.body;

    updatedItems.map(async (item) => {
      await Item.findByIdAndUpdate(item, {
        isSpecial: true,
      });
    });
    const items = await Item.find({ user: req.params.userId })
      .populate("category")
      .populate("pricing");
    return res.json(new ApiResponse(200, items, "Items updated successfully"));
  } catch (err) {
    console.log(err);
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};

export const menuPreview = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await User.findById(userId);
    const items = await Item.find({ user: userData._id, enabled: true })
      .populate("category")
      .populate("pricing");
    return res.json(
      new ApiResponse(
        200,
        {
          businessName: userData.businessName,
          items,
        },
        "Menu preview fetched successfully"
      )
    );
  } catch (err) {
    console.log(err);
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};

export const applyDiscount = async (req, res) => {
  try {
    const { discount, itemId } = req.body;
    const updatedItem = await Item.findByIdAndUpdate(itemId, {
      discount: discount,
    });
    return res.json(
      new ApiResponse(200, updatedItem, "Item discount applied successfully")
    );
  } catch (err) {
    console.log(err);
    return res
      .status(err?.statusCode || 500)
      .json({ error: err?.message || "Internal Server Error" });
  }
};
