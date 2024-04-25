import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Promotion from "../models/promotionModel.js";
import asyncHandler from "express-async-handler";

//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 1000; // Ensure this is a number
  const page = Number(req.query.pageNumber) || 1;
  const { keyword = "", category, promotion } = req.query;
  let queryFilters = {};
  if (keyword) {
    queryFilters.name = { $regex: keyword, $options: "i" };
  }

  let categoryFilter = {};
  if (category) {
    const categoryDoc = await Category.findOne({ name: category });
    if (categoryDoc) {
      queryFilters.category = categoryDoc._id;
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  }
  if (promotion) {
    const promotionDoc = await Promotion.findOne({ name: promotion });
    if (promotionDoc) {
      queryFilters.promotion = promotionDoc._id;
    } else {
      return res.status(404).json({ message: "Promotion not found" });
    }
  }

  const count = await Product.countDocuments(queryFilters);
  const products = await Product.find(queryFilters)
    .populate("category", "name title")
    .populate("promotion", "name title")
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch single product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
  try {
    console.log(`Fetching product with ID ${req.params.id}`);
    const product = await Product.findById(req.params.id)
      .populate("category", "title name")
      .populate("promotion", "title name")
      .populate({
        path: "frequentlyBought.productId",
        select: "_id name prices image countInStock category",
        // populate: {
        //   path: "category",
        //   select: "name title",
        // },
      });

    if (product) {
      // Enhance frequentlyBought by attaching the matched variant details
      const frequentlyBoughtWithVariants = product.frequentlyBought.map(
        (fbItem) => {
          const variant =
            fbItem.productId &&
            fbItem.productId.prices.find(
              (variant) =>
                variant._id.toString() === fbItem.variantId.toString()
            );
          return {
            ...fbItem._doc, // include all existing fields
            productId: fbItem.productId,
            variant: variant || null, // attach the found variant or null if not found
          };
        }
      );

      // Create a new response object with the full product data and enhanced frequentlyBought
      const fullProductDetails = {
        ...product._doc,
        frequentlyBought: frequentlyBoughtWithVariants,
      };

      res.json(fullProductDetails);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@desc Fetch product by category
//@route GET /api/products/category
//@access Public
const getProductByCategory = asyncHandler(async (req, res) => {
  try {
    // URL decode category parameter
    const category = decodeURIComponent(req.params.category);
    let products;
    if (category.toLowerCase() === "all") {
      products = await Product.find({});
    } else {
      products = await Product.find({ category });
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Backend controller to fetch products by promotion
const getProductByPromotion = asyncHandler(async (req, res) => {
  const promotionName = decodeURIComponent(req.params.promotion);
  try {
    // Find the promotion document first to get its ObjectId
    const promotion = await Promotion.findOne({ name: promotionName });
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    // Use the ObjectId of the promotion to find products
    const products = await Product.find({ promotion: promotion._id }).populate(
      "promotion"
    );
    if (products.length) {
      res.json(products);
    } else {
      res.status(404).json({ message: "No products found for this promotion" });
    }
  } catch (error) {
    console.error("Server Error: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: "product removed" });
  } else {
    //this goes to the errorMiddleware
    res.status(404); //we can also disregard this so by default error 500 will show
    throw new Error("Product not found");
  }
});

//@desc Create a product
//@route POST /api/products/
//@access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const category = await Category.findOne();
  if (!category) {
    res.status(400);
    throw new Error("No categories found");
  }
  const product = new Product({
    name: "Sample name",
    prices: [
      { qty: 1, units: "gm", price: 1, discountedPrice: 0, discount: 0 },
    ], // Only one price variant

    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Shahi Kohinoor",
    category: category._id,
    countInStock: 0,
    description: "Sample description",
    subitle: req.body.subtitle || undefined, // Set only if provided, otherwise undefined
    countryOfOrigin: req.body.countryOfOrigin || undefined, // Set only if provided, otherwise undefined
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    prices,
    description,
    image,
    brand,
    category,
    promotion,
    countInStock,
    frequentlyBought,
    subtitle,
    countryOfOrigin,
    // Added promotions to the destructured fields
  } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check if the category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    res.status(400);
    throw new Error("Category not found");
  }

  if (promotion) {
    const promotionExists = await Promotion.findById(promotion);
    if (!promotionExists) {
      res.status(400).throw(new Error("Promotion not found"));
    }
    product.promotion = promotion;
  } else {
    product.promotion = null; // Explicitly setting `promotion` to `null` if none provided
  }

  product.name = name;
  product.prices = prices;
  product.description = description;
  product.image = image;
  product.brand = brand;
  product.category = category; // Ensure this is an ObjectId referencing a Category
  product.promotion = promotion; // Ensure this is an ObjectId referencing a Promotion
  product.countInStock = countInStock;
  product.frequentlyBought = frequentlyBought.map((fb) => ({
    productId: fb.productId,
    variantId: fb.variantId,
  }));
  product.subtitle = subtitle;
  product.countryOfOrigin = countryOfOrigin;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductByCategory,
  getProductByPromotion,
};
