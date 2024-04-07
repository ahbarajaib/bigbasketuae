import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    user: {
      // Relationship between user and product model to show which admin added the product
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    promotions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Promotion",
      },
    ],
    description: {
      type: String,
      required: true,
    },
    prices: [
      {
        qty: {
          type: Number,
          required: true,
        },
        noOfProducts: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        discountedPrice: {
          type: Number,
        },
        discount: {
          type: Number,
        },
        units: {
          type: String,
          required: true,
        },
      },
    ],
    noOfProducts: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    frequentlyBought: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        variant: {
          qty: Number,
          units: String,
          // Add other variant properties as needed
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
