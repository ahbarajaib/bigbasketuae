import mongoose from "mongoose";

const promotionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Sample Promotion",
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
  },
  {
    timestamps: true,
  }
);

const Promotion = mongoose.model("Promotion", promotionSchema);

export default Promotion;
