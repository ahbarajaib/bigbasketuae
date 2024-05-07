import express from "express";
const router = express.Router();
import { protect, admin, manager } from "../middleware/authMiddleware.js";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

router
  .route("/")
  .get(getCategories)
  .post(protect, admin, manager, createCategory);
router
  .route("/:id")
  .get(getCategoryById)
  .delete(protect, admin, deleteCategory)
  .put(protect, admin, manager, updateCategory);

export default router;
