// routes/smallBannerRoutes.js
import express from "express";
import {
  uploadSmallBanner,
  deleteSmallBanner, // Make sure this matches the actual export name
  getAllSmallBanners,
  getSmallBanner,
} from "../controllers/bannerController.js";

import { protect, admin, manager } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, admin, manager, uploadSmallBanner);
router.route("/all").get(getAllSmallBanners);

router
  .route("/:category")
  .get(getSmallBanner)
  .delete(protect, admin, manager, deleteSmallBanner);

export default router;
