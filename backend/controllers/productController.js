import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
//express-async-handler is a simple middleware for handling exceptions
//inside of async express routes an passing them to your express error handlers
import asyncHandler from "express-async-handler";

//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 25; // Ensure this is a number
  const page = Number(req.query.pageNumber) || 1;

  // Assuming the keyword search is for products, not categories
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  let categoryFilter = {};
  if (req.query.category) {
    const category = await Category.findOne({ name: req.query.category });
    if (category) {
      categoryFilter = { category: category._id };
    } else {
      return res.status(404).json({ message: "Category not found" });
    }
  }

  const count = await Product.countDocuments({ ...keyword, ...categoryFilter });
  const products = await Product.find({ ...keyword, ...categoryFilter })
    .populate("category", "name title") // This populates the category field with the title from the Category model
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc Fetch single product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    //this goes to the errorMiddleware
    res.status(404); //we can also disregard this so by default error 500 will show
    throw new Error("Product not found");
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
    countInStock,
    frequentlyBought,
  } = req.body;

  const product = await Product.findById(req.params.id);

  // Check if the category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    res.status(400);
    throw new Error("Category not found");
  }

  if (product) {
    product.name = name;
    product.prices = prices;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category; // Ensure this is an ObjectId referencing a Category
    product.countInStock = countInStock;
    product.frequentlyBought = frequentlyBought;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductByCategory,
};
