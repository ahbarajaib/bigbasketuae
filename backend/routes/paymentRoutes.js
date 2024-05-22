import express from "express";

import {
  getPaymentStatus,
  makePayment,
  webhook,
} from "../controllers/paymentController.js";

const router = express.Router();
router.route("/create-checkout-session").post(makePayment);

router.route("/webhook").post(webhook);
router.route("/status").get(getPaymentStatus);

export default router;
