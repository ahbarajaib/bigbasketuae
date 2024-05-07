import express from "express";

const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPlaced,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} from "../controllers/orderController.js";
import {
  protect,
  admin,
  courier,
  adminOrManagerOrCourier,
} from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, adminOrManagerOrCourier, getOrders);

router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/orderplaced").put(protect, updateOrderToPlaced);

router.route("/:id/payment").put(protect, updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(protect, adminOrManagerOrCourier, updateOrderToDelivered);

// Route to update order to paid when payment is successful

export default router;
