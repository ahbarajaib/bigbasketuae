// controllers/bannerController.js
import Banner from "../models/bannerModel.js";
import SmallBanner from "../models/smallBannerModel.js"; // Updated import

import asyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.body.category || "uncategorized";
    const uploadPath = path.join("banners/", category);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const smallStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const category = req.body.category || "uncategorized";
    const uploadPath = path.join("banners", "small", category); // Adjust this line

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|avif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

const smallUpload = multer({
  // Added smallUpload multer configuration
  storage: smallStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

// Upload Banner function
const uploadBanner = asyncHandler(async (req, res) => {
  // Check if the user is an admin
  if (req.user && req.user.isAdmin) {
    // Multer middleware for handling file upload
    upload(req, res, async (err) => {
      if (err) {
        console.error(err);
        res.status(400).json({ message: "Error uploading file" });
        return;
      }

      const imagePath = req.file.path.replace(/\\/g, "/");
      const category = req.body.category;

      try {
        let banner = await Banner.findOne({ category });

        if (banner) {
          // If the banner exists, check if the image path is already in the array
          if (!banner.imagePaths.includes(imagePath)) {
            // Only push the image path if it's not already in the array
            banner.imagePaths.push(imagePath);
            await banner.save();
          }
        } else {
          // If the banner doesn't exist, create a new one
          banner = await Banner.create({ category, imagePaths: [imagePath] });
        }

        // Respond with JSON containing the image path
        res.json(imagePath);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    });
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
});

// Get Banner function
const getBanner = asyncHandler(async (req, res) => {
  const category = req.params.category;

  try {
    const banner = await Banner.findOne({ category });

    if (banner) {
      res.json({ imagePaths: banner.imagePaths });
    } else {
      res.status(404).json({ message: "Banner not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Delete banner by category
// @route   DELETE /api/banners/:category
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { imagePath } = req.query;

  try {
    // Find the banner document based on the category
    const banner = await Banner.findOne({ category });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Remove the specified imagePath from the imagePaths array
    banner.imagePaths = banner.imagePaths.filter((path) => path !== imagePath);

    // Save the changes
    await banner.save();

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Upload Small Banner function
const uploadSmallBanner = asyncHandler(async (req, res) => {
  // Check if the user is an admin
  if (req.user && req.user.isAdmin) {
    // Multer middleware for handling file upload
    smallUpload(req, res, async (err) => {
      if (err) {
        console.error(err);
        res.status(400).json({ message: "Error uploading file" });
        return;
      }

      const imagePath = req.file.path.replace(/\\/g, "/");
      const category = req.body.category;

      const pathSegments = imagePath.split("/");
      const finalImagePath = `${category}/${
        pathSegments[pathSegments.length - 1]
      }`;

      try {
        let smallBanner = await SmallBanner.findOne({ category });

        if (smallBanner) {
          // If the small banner exists, check if the image path is already in the array
          if (!smallBanner.imagePaths.includes(finalImagePath)) {
            // Only push the image path if it's not already in the array
            smallBanner.imagePaths.push(finalImagePath);
            await smallBanner.save();
          }
        } else {
          // If the small banner doesn't exist, create a new one
          smallBanner = await SmallBanner.create({
            category,
            imagePaths: [finalImagePath],
          });
        }

        // Respond with JSON containing the image path

        res.json(finalImagePath);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
    });
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
});

// @desc    View small banner by category
// @route   GET /api/small-banners/:category
// @access  Public
const getSmallBanner = asyncHandler(async (req, res) => {
  const category = req.params.category;

  try {
    const smallBanner = await SmallBanner.findOne({ category });

    if (smallBanner) {
      res.json({ imagePaths: smallBanner.imagePaths });
    } else {
      res.status(404).json({ message: "Small Banner not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Delete small banner by category
// @route   DELETE /api/small-banners/:category
// @access  Private/Admin
const deleteSmallBanner = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { imagePath } = req.query;

  try {
    // Find the small banner document based on the category
    const smallBanner = await SmallBanner.findOne({ category });

    if (!smallBanner) {
      return res.status(404).json({ message: "Small Banner not found" });
    }

    // Remove the specified imagePath from the imagePaths array
    smallBanner.imagePaths = smallBanner.imagePaths.filter(
      (path) => path !== imagePath
    );

    // Save the changes
    await smallBanner.save();

    res.json({ message: "Small Banner Image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export {
  uploadSmallBanner,
  deleteSmallBanner,
  getSmallBanner,
  uploadBanner,
  getBanner,
  deleteBanner,
};
