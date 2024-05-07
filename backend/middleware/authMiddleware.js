import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //we take the token except the bearer in the start
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //fetching the user
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token fail");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

const manager = (req, res, next) => {
  if (req.user && req.user.isManager) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a manager");
  }
};

const courier = (req, res, next) => {
  if (req.user && req.user.isCourier) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as a courier");
  }
};

export { protect, admin, manager, courier };
