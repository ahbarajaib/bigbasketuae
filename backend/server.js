import path from "path";
import stripe from "stripe";
import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import express from "express";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import morgan from "morgan";
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

// Importing environmental variables
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

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

const staticDir = process.env.STATIC_DIR;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeInstance = stripe(stripeSecretKey, { apiVersion: "2022-08-01" });

app.use(express.static(staticDir));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Request URL: ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
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

// Additional routes
app.get("/api/contactus", (req, res) => res.send("Contact us page"));
app.get("/api/delivery", (req, res) => res.send("Delivery FAQ page"));
app.get("/api/returns", (req, res) => res.send("Returns page"));
app.get("/api/aboutus", (req, res) => res.send("About us page"));
app.get("/api/privacy", (req, res) => res.send("Privacy policy page"));
app.get("/api/terms", (req, res) => res.send("Terms page"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.USE_SSL === "true") {
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
  app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
  });
}
