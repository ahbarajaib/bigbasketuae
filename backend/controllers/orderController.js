import Order from "../models/orderModel.js";
import nodemailer from "nodemailer";
import config from "../config/config.js";

//express-async-handler is a simple middleware for handling exceptions
//inside of async express routes an passing them to your express error handlers
import asyncHandler from "express-async-handler";

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    discountAmount,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      discountAmount,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Send the response after calling confirmOrderEmail
    res.status(201).json(createdOrder);
  }
});

const confirmOrderEmail = async (email, order) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      secure: true,
      port: 465,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    const url = process.env.CLIENT_URL;
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "Order Confirmed - bigbasketuae.com",
      html: `<p>Hello Sir/Madam,</p>
      <p>Order successfully placed Order :<a href="${url}/orders/${order._id}">${order._id}</a></p>
      <p>Your order will be delivered soon.</p>
     <p> Thank you</p>`,
    };

    transporter.sendMail(mailOptions);
  } catch (e) {
    console.log("Failed to send email:");
  }
};

const confirmOrderEmail2 = async (email, order) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      secure: true,
      port: 465,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
    const url = process.env.CLIENT_URL;
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "New order placed - bigbasketuae.com",
      html: `<p>Hello Sir/Madam,</p>
      <p>A new order has been placed::<a href="${url}/orders/${order._id}">${order._id}</a></p>
      <p>Confirmation email has been sent to the customer.</p>
     <p> Thank you</p>`,
    };

    transporter.sendMail(mailOptions);
  } catch (e) {
    console.log("Failed to send email:");
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email phoneNumber")
    .exec();
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = new Date(req.body.created * 1000);
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.created, // This is a UNIX timestamp
      email_address: req.body.receipt_email,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderToPlaced = asyncHandler(async (req, res) => {});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPlaced,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
