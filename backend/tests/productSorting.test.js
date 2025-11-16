// Jest globals are available without import in Node.js environment
import { Product } from '../models/Product.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

describe('Product Sorting Tests', () => {
  beforeAll(async () => {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_test');
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Create test products
    await Product.insertMany([
      {
        sku: 'SKU001',
        name: 'Product A',
        price: 100,
        category: 'Electronics',
        stock: 10
      },
      {
        sku: 'SKU002',
        name: 'Product B',
        price: 200,
        category: 'Electronics',
        stock: 5
      },
      {
        sku: 'SKU003',
        name: 'Product C',
        price: 50,
        category: 'Clothing',
        stock: 20
      },
      {
        sku: 'SKU004',
        name: 'Product D',
        price: 300,
        category: 'Electronics',
        stock: 8
      }
    ]);
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  test('should return products sorted by price in descending order by default', async () => {
    const products = await Product.find({})
      .sort({ price: -1 })
      .lean();

    expect(products).toHaveLength(4);
    expect(products[0].price).toBe(300);
    expect(products[1].price).toBe(200);
    expect(products[2].price).toBe(100);
    expect(products[3].price).toBe(50);
  });

  test('should return products sorted by price in ascending order when requested', async () => {
    const products = await Product.find({})
      .sort({ price: 1 })
      .lean();

    expect(products).toHaveLength(4);
    expect(products[0].price).toBe(50);
    expect(products[1].price).toBe(100);
    expect(products[2].price).toBe(200);
    expect(products[3].price).toBe(300);
  });

  test('should handle sorting with category filter', async () => {
    const products = await Product.find({ category: 'Electronics' })
      .sort({ price: -1 })
      .lean();

    expect(products).toHaveLength(3);
    expect(products[0].price).toBe(300);
    expect(products[1].price).toBe(200);
    expect(products[2].price).toBe(100);
  });

  test('should handle sorting with search filter', async () => {
    const products = await Product.find({
      name: { $regex: 'Product', $options: 'i' }
    })
      .sort({ price: -1 })
      .lean();

    expect(products).toHaveLength(4);
    expect(products[0].price).toBe(300);
  });
});

