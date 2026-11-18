import Product from '../models/Product.js';

// @desc    Get all products with search, category filtering & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 8;
    const skip = (page - 1) * limit;

    const query = {};

    // Keyword search (searches name and description)
    if (req.query.search && req.query.search.trim()) {
      query.$or = [
        { name: { $regex: req.query.search.trim(), $options: 'i' } },
        { description: { $regex: req.query.search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category.trim() && req.query.category !== 'All') {
      query.category = req.query.category.trim();
    }

    // Total matched documents count
    const total = await Product.countDocuments(query);

    // Fetch paginated products
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of unique product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({
      success: true,
      categories: ['All', ...categories],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, imageUrl, stock } = req.body;

    if (!name || !description || price === undefined || !category || !imageUrl || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, imageUrl, stock',
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      imageUrl,
      stock: Number(stock),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const { name, description, price, category, imageUrl, stock } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.category = category ?? product.category;
    product.imageUrl = imageUrl ?? product.imageUrl;
    product.stock = stock !== undefined ? Number(stock) : product.stock;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
