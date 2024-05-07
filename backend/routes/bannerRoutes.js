import express from "express";
import {
  uploadBanner,
  getBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import {
  protect,
  admin,
  adminOrManager,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, adminOrManager, uploadBanner);
router.route("/:category").get(getBanner).delete(protect, admin, deleteBanner);

export default router;
