import Product from '../models/productModel.js'

//express-async-handler is a simple middleware for handling exceptions
//inside of async express routes an passing them to your express error handlers
import asyncHandler from 'express-async-handler'

//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

//@desc Fetch single product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    //this goes to the errorMiddleware
    res.status(404) //we can also disregard this so by default error 500 will show
    throw new Error('Product not found')
  }
})

//@desc Fetch product by category
//@route GET /api/products/category
//@access Public
const getProductByCategory = asyncHandler(async (req, res) => {
  try {
    // URL decode category parameter
    const category = decodeURIComponent(req.params.category)
    const products = await Product.find({ category })
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server Error' })
  }
})

//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.deleteOne()
    res.json({ message: 'product removed' })
  } else {
    //this goes to the errorMiddleware
    res.status(404) //we can also disregard this so by default error 500 will show
    throw new Error('Product not found')
  }
})

//@desc Create a product
//@route POST /api/products/
//@access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    prices: [{ qty: 1, units:'gm', price: 1 },{ qty: 1, units:'gm', price: 1 },{ qty: 1,units:'gm', price: 1 },{ qty: 1, units:'gm', price: 1 }],
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Shahi Kohinoor',
    category: 'Sample category',
    countInStock: 0,
    description: 'Sample description',
  })
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

//@desc Update a product
//@route POUT /api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, prices, description, image, brand, category, countInStock } =
    req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = name
    product.prices = prices
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getProductByCategory,
}
