import mongoose from "mongoose";
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";

mongoose
  .connect(
    "mongodb+srv://admin123:admin123@bigbasketcluster.0jwd0t4.mongodb.net/bigbasket?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
async function updateProductCategories() {
  const products = await Product.find(); // Fetch all products

  for (let product of products) {
    if (typeof product.category === "undefined" || product.category === null) {
      console.log(
        `Skipping product ${product.name} as it has no defined category.`
      );
      continue; // Skip this iteration and proceed with the next product
    }

    const category = await Category.findOne({ name: product.category });

    if (category) {
      product.category = category._id;
      await product.save();
      console.log(
        `Updated product ${product.name} with category ObjectId ${category._id} corresponding to ${category.name}`
      );
    } else {
      console.log(
        `Category not found for product ${product.name} with category name '${product.category}'`
      );
    }
  }

  console.log("Finished updating products.");
}

updateProductCategories().then(() => mongoose.disconnect());
