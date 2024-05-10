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
  const products = await Product.find();

  const promises = products.map(async (product) => {
    product.prices = product.prices.map((price) => {
      if (!price._id) {
        price._id = new mongoose.Types.ObjectId();
      }
      return price;
    });

    const start = Date.now();
    await product.save(); // wait for the save operation to complete
    const end = Date.now();

    console.log(`Saved product ${product._id} in ${end - start} ms`);

    return product;
  });

  await Promise.all(promises); // wait for all promises to resolve
  console.log("Prices Updated");
};

updatePrices().then(() => mongoose.disconnect());
