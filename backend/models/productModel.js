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
    subtitle: {
      type: String,
      required: false,
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
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
    },

    description: {
      type: String,
      required: true,
    },
    countryOfOrigin: {
      type: String,
      required: false,
    },
    isOrganic: {
      type: Boolean,
      required: false,
      default: false,
    },
    isBulk: {
      type: Boolean,
      required: false,
      default: false,
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
        //i want id as well
        _id: {
          type: mongoose.Schema.Types.ObjectId,
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
        variantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product.prices",
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
