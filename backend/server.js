//es6 way of importing
import path from "path";
import { resolve } from "path";
import stripe from "stripe";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import express from "express";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import morgan from "morgan";
//import products from './data/products.js'
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryImageRoutes from "./routes/categoryImageRoutes.js";
import promotionImageRoutes from "./routes/promotionImageRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import smallBannerRoutes from "./routes/smallBannerRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import promotionRoutes from "./routes/promotionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import nStatic from "node-static";

// importing environmental variables
dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
const corsOptions = {
  origin: process.env.CLIENT_URL,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
//middleware is a function that has access to req res cycle
app.use((req, res, next) => {
  //to check which URL triggered this console.log(req.originalUrl)

  next();
});

app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf;
    },
  })
);

const staticDir = process.env.STATIC_DIR;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
const stripeInstance = stripe(stripeSecretKey, {
  apiVersion: "2022-08-01",
});

app.use(express.static(staticDir));

app.get("/", (req, res) => {
  // Your homepage logic
  res.send("Welcome to the homepage!");
});

app.use("/payment", paymentRoutes);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/uploadcategory", categoryImageRoutes);
app.use("/api/uploadpromotion", promotionImageRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/smallbanners", smallBannerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/promotions", promotionRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/banners", express.static(path.join(__dirname, "/banners")));

var fileServer = new nStatic.Server("./public");

// Define routes
app.get("/api/contactus", (req, res) => {
  // Handle GET request for /api/contactus
  res.send("Contact us page");
});

app.get("/api/delivery", (req, res) => {
  // Handle GET request for /api/delivery
  res.send("Delivery FAQ page");
});

app.get("/api/returns", (req, res) => {
  // Handle GET request for /api/returns
  res.send("Returns page");
});

app.get("/api/aboutus", (req, res) => {
  // Handle GET request for /api/aboutus
  res.send("About us page");
});

app.get("/api/privacy", (req, res) => {
  // Handle GET request for /api/privacy
  res.send("Privacy policy page");
});

app.get("/api/terms", (req, res) => {
  // Handle GET request for /api/terms
  res.send("Terms page");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(__dirname, "frontend", "build", "index.html")
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

//@errorMiddleware.js middleware to handle which is not a path if entered route is not a
//route in app then this will kick
app.use(notFound);

//error middleware @errorMiddleware.js
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

if (process.env.USE_SSL === "true") {
  // Setup for HTTPS server
  const privateKey = fs.readFileSync(
    "/etc/letsencrypt/live/bigbasketuae.com/privkey.pem",
    "utf8"
  );
  const certificate = fs.readFileSync(
    "/etc/letsencrypt/live/bigbasketuae.com/fullchain.pem",
    "utf8"
  );
  const ca = fs.readFileSync(
    "/etc/letsencrypt/live/bigbasketuae.com/chain.pem",
    "utf8"
  );

  const credentials = { key: privateKey, cert: certificate, ca: ca };
  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
} else {
  // Setup for HTTP server
  app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
  });
}
