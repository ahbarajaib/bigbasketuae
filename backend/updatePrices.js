import mongoose from "mongoose";
import Product from "./models/productModel.js";
import connectDB from "./config/db.js";

connectDB();
const updatePrices = async () => {
  const products = await Product.find();

  products.forEach(async (product) => {
    product.prices = product.prices.map((price) => {
      if (!price._id) {
        price._id = new mongoose.Types.ObjectId();
      }
      return price;
    });

    await product.save();
  });
};

updatePrices();
