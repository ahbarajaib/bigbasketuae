import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
// Initialize dotenv

dotenv.config();
//take process.env.STRIPE_PRIVATE_KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Process Payment
const makePayment = async (req, res) => {
  const { orderId, orderData } = req.body;

  try {
    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: "Order Total",
            },
            unit_amount: Math.round(orderData.totalPrice * 100), // Convert total price to smallest currency unit
          },
          quantity: 1, // Only one line item for the total order amount
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        orderId: orderId,
      },
    });

    console.log("Stripe session URL:", session.url);
    res.json({ url: session.url });
  } catch (e) {
    console.error("Stripe session creation failed:", e.message);
    res.status(500).json({ error: e.message });
  }
};

const webhook = async (req, res) => {
  const payload = req.body;
  console.log(" payload", payload);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Error verifying webhook signature:", err.message);
    return res.sendStatus(400);
  }
  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Retrieve orderId from the metadata
    const orderId = session.metadata.orderId;

    console.log("orderId", orderId);
  }
  res.sendStatus(200);
};

const getPaymentStatus = async (req, res) => {
  const { session_id } = req.query;
  console.log(session_id);
  try {
    const payment = await stripe.checkout.sessions.retrieve(session_id);
    res.json(payment);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export { makePayment, webhook, getPaymentStatus };
