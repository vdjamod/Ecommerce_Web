import { Product } from '../models/Product.js';
import { body, validationResult } from 'express-validator';

// Get all products with server-side sorting, search, filtering, and pagination
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sortBy = 'price',
      sortOrder = 'desc'
    } = req.query;

    // Check for special header to change sorting (as per exam requirement)
    const specialSort = req.headers['x-sort-ascending'] === 'true';
    const finalSortOrder = specialSort ? 'asc' : sortOrder;

    // Build query
    const query = {};
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    if (sortBy === 'price') {
      sortObj.price = finalSortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'updatedAt') {
      sortObj.updatedAt = finalSortOrder === 'asc' ? 1 : -1;
    } else {
      sortObj.price = -1; // Default: highest price first
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      sort: {
        sortBy,
        sortOrder: finalSortOrder
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sku, name, price, category, description, image, stock } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this SKU already exists' });
    }

    const product = await Product.create({
      sku,
      name,
      price: parseFloat(price),
      category,
      description: description || '',
      image: image || '',
      stock: parseInt(stock) || 0
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, category, description, image, stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price: parseFloat(price),
        category,
        description,
        image,
        stock: parseInt(stock),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

