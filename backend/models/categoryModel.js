import mongoose from "mongoose";
const categorySchema = mongoose.Schema(
  {
    name: {
      // Unique identifier, e.g., 'spices-and-condiments'
      type: String,
      required: true,
      unique: true,
    },
    title: {
      // Human-readable name, e.g., 'Spices & Condiments'
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isEnabled: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
