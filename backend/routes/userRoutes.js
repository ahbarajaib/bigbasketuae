import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { protect, admin, manager } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(registerUser)
  .get(protect, admin, getUsers)
  .get(protect, manager, getUsers);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .all(protect, updateUserProfile);

//  router.route('/forgot-password').post(forgotPassword)
router.post("/forgot-password", forgotPassword);
// router.route('/reset-password').post(resetPassword)
router.post("/reset-password", resetPassword);

router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
