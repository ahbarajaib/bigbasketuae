import express from "express";
const router = express.Router();
import { protect, admin, manager } from "../middleware/authMiddleware.js";
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
  .post(protect, admin, togglePromotionActive)
  .post(protect, manager, togglePromotionActive);

router
  .route("/:id")
  .get(getPromotionById)
  .put(protect, admin, updatePromotion)
  .put(protect, manager, updatePromotion)
  .delete(protect, admin, deletePromotion);

export default router;
