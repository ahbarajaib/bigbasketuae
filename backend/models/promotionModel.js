import mongoose from "mongoose";

const promotionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "sample-promotion",
    },
    title: {
      type: String,
      required: true,
      default: "Sample title",
    },
    image: {
      type: String,
      required: true,
      default: "/image/offer.jpg",
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;
