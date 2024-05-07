import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductByCategory,
  getProductByPromotion,
} from "../controllers/productController.js";

import {
  protect,
  admin,
  manager,
  adminOrManager,
} from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, adminOrManager, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, adminOrManager, updateProduct);

router.route("/category/:category").get(getProductByCategory);
router.route("/promotion/:promotion").get(getProductByPromotion);

export default router;
