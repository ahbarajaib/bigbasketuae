// models/bannerModel.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  imagePaths: {
    type: [String],
    default: [],
  },
});

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
