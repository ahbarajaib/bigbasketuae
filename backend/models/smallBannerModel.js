import mongoose from "mongoose";

const smallBannerSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  imagePaths: {
    type: [String],
    default: [],
  },
});

const SmallBanner = mongoose.model("SmallBanner", smallBannerSchema); // Updated model name

export default SmallBanner;
