import express from "express";
const router = express.Router();
import {
  protect,
  admin,
  manager,
  adminOrManager,
} from "../middleware/authMiddleware.js";
import {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionActive,
} from "../controllers/promotionController.js";

router.route("/").get(getPromotions).post(protect, admin, createPromotion);

router
  .route("/toggle-active/:id")
  .post(protect, adminOrManager, togglePromotionActive);

router
  .route("/:id")
  .get(getPromotionById)
  .put(protect, admin, updatePromotion)
  .put(protect, adminOrManager, updatePromotion)

  .delete(protect, admin, deletePromotion);

export default router;
