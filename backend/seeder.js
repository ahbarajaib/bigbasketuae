import mongoose from "mongoose";
import Product from "./models/productModel.js";

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

const updatePrices = async () => {
  let totalPricesWithoutId = 0; // Initialize counter for prices without ID

  const products = await Product.find();

  const promises = products.map(async (product) => {
    let pricesWithoutId = 0; // Counter for prices without ID in each product

    product.prices = product.prices.map((price) => {
      if (!price._id) {
        price._id = new mongoose.Types.ObjectId();
        pricesWithoutId++; // Increment counter if ID is missing
      }
      return price;
    });

    totalPricesWithoutId += pricesWithoutId; // Accumulate the count of prices without ID

    const start = Date.now();
    await product.save(); // Wait for the save operation to complete
    const end = Date.now();

    console.log(
      `Saved product ${product._id} in ${
        end - start
      } ms with ${pricesWithoutId} prices without ID`
    );

    return product;
  });

  await Promise.all(promises); // Wait for all promises to resolve

  console.log(
    `Total prices updated across all products: ${totalPricesWithoutId}`
  );
  console.log("Prices Updated");
};

updatePrices().then(() => mongoose.disconnect());
