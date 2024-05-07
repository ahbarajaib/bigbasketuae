import express from "express";
import {
  uploadBanner,
  getBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import { protect, admin, manager } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, admin, uploadBanner)
  .post(protect, manager, uploadBanner);
router.route("/:category").get(getBanner).delete(protect, admin, deleteBanner);

export default router;
