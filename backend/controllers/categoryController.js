import Category from "../models/categoryModel.js";
//express-async-handler for handling exceptions
import asyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import fs from "fs";

//Fetch all Categories

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

//Fetch single category
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

const createCategory = asyncHandler(async (req, res) => {
  const category = new Category({
    title: "Sample category ",
    name: "sample-categories",
    image: "/images/categoryImages/image.jpg",
    isEnabled: "true",
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

const updateCategory = asyncHandler(async (req, res) => {
  const { title, name, image, isEnabled } = req.body;
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = name || category.name;
    category.title = title || category.title;
    category.image = image || category.image;
    category.isEnabled =
      isEnabled !== undefined ? isEnabled : category.isEnabled;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.deleteOne();
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
