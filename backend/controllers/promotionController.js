import Promotion from "../models/promotionModel.js";
import asyncHandler from "express-async-handler";

const getPromotions = asyncHandler(async (req, res) => {
  const promotions = await Promotion.find({});
  res.json(promotions);
});

const getPromotionById = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);
  if (promotion) {
    res.json(promotion);
  } else {
    res.status(404);
    throw new Error("Promotion not found");
  }
});

const createPromotion = asyncHandler(async (req, res) => {
  const { name, title, isActive } = req.body;
  const activePromotionsCount = await Promotion.countDocuments({
    isActive: true,
  });
  if (isActive && activePromotionsCount >= 4) {
    res.status(400).json({
      message: "No more than 4 promotions can be active at the same time.",
    });
    return;
  }

  const promotion = new Promotion({
    name,
    title,
    isActive,
  });
  const createdPromotion = await promotion.save();
  res.status(201).json(createdPromotion);
});

const updatePromotion = asyncHandler(async (req, res) => {
  const { name, title, image, isActive } = req.body;
  const promotion = await Promotion.findById(req.params.id);

  if (!promotion) {
    res.status(404);
    throw new Error("Promotion not found");
  }

  // Check if the isActive status is being changed to true and it's not already true
  if (isActive === true && promotion.isActive === false) {
    const activePromotionsCount = await Promotion.countDocuments({
      isActive: true,
    });
    // If attempting to activate this promotion would exceed the limit
    if (activePromotionsCount >= 4) {
      res.status(400).json({
        message: "No more than 4 promotions can be active at the same time.",
      });
      return;
    }
  }

  // Update fields
  promotion.name = name || promotion.name;
  promotion.title = title || promotion.title;
  promotion.image = image || promotion.image;

  // This safely sets isActive only if it's provided in the request
  if (isActive !== undefined) {
    promotion.isActive = isActive;
  }

  const updatedPromotion = await promotion.save();
  res.json(updatedPromotion);
});

const deletePromotion = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);
  if (promotion) {
    await promotion.deleteOne();
    res.json(promotion);
  } else {
    res.status(404);
    throw new Error("Promotion not found");
  }
});

const togglePromotionActive = asyncHandler(async (req, res) => {
  const promotion = await Promotion.findById(req.params.id);
  if (!promotion) {
    res.status(404).send({ message: "Promotion not found" });
    return;
  }
  const activePromotionsCount = await Promotion.countDocuments({
    _id: { $ne: promotion._id },
    isActive: true,
  });
  if (!promotion.isActive && activePromotionsCount >= 4) {
    res.status(400).json({
      message: "No more than 4 promotions can be active at the same time",
    });
    return;
  }
  promotion.isActive = !promotion.isActive;
  await promotion.save();

  res.json({
    message: `Promotion '${promotion.name}' is now ${
      promotion.isActive ? "active" : "inactive"
    }.`,
  });
});

export {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionActive,
};
