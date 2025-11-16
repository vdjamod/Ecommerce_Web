import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Product } from '../models/Product.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.user.deleteMany({});

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: adminPasswordHash,
        role: 'admin'
      }
    });
    console.log('Created admin user:', admin.email);

    // Create customer user
    const customerPasswordHash = await bcrypt.hash('customer123', 10);
    const customer = await prisma.user.create({
      data: {
        name: 'Test Customer',
        email: 'customer@example.com',
        passwordHash: customerPasswordHash,
        role: 'customer'
      }
    });
    console.log('Created customer user:', customer.email);

    // Create sample products
    const products = [
      {
        sku: 'LAP001',
        name: 'Laptop Pro 15',
        price: 1299.99,
        category: 'Electronics',
        description: 'High-performance laptop with latest processor',
        image: 'https://via.placeholder.com/300',
        stock: 50
      },
      {
        sku: 'PHN001',
        name: 'Smartphone X',
        price: 899.99,
        category: 'Electronics',
        description: 'Latest smartphone with advanced features',
        image: 'https://via.placeholder.com/300',
        stock: 100
      },
      {
        sku: 'TSH001',
        name: 'Cotton T-Shirt',
        price: 29.99,
        category: 'Clothing',
        description: 'Comfortable cotton t-shirt',
        image: 'https://via.placeholder.com/300',
        stock: 200
      },
      {
        sku: 'SHO001',
        name: 'Running Shoes',
        price: 79.99,
        category: 'Footwear',
        description: 'Comfortable running shoes',
        image: 'https://via.placeholder.com/300',
        stock: 75
      },
      {
        sku: 'BAG001',
        name: 'Leather Backpack',
        price: 149.99,
        category: 'Accessories',
        description: 'Durable leather backpack',
        image: 'https://via.placeholder.com/300',
        stock: 30
      },
      {
        sku: 'WAT001',
        name: 'Smart Watch',
        price: 249.99,
        category: 'Electronics',
        description: 'Feature-rich smartwatch',
        image: 'https://via.placeholder.com/300',
        stock: 60
      },
      {
        sku: 'JEA001',
        name: 'Denim Jeans',
        price: 59.99,
        category: 'Clothing',
        description: 'Classic fit denim jeans',
        image: 'https://via.placeholder.com/300',
        stock: 150
      },
      {
        sku: 'CAM001',
        name: 'Digital Camera',
        price: 599.99,
        category: 'Electronics',
        description: 'Professional digital camera',
        image: 'https://via.placeholder.com/300',
        stock: 25
      }
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    // Create sample orders
    const order1 = await prisma.order.create({
      data: {
        userId: customer.id,
        total: '179.98'
      }
    });

    await prisma.orderItem.createMany({
      data: [
        {
          orderId: order1.id,
          productId: createdProducts[2]._id.toString(), // T-Shirt
          quantity: 2,
          priceAtPurchase: '29.99'
        },
        {
          orderId: order1.id,
          productId: createdProducts[3]._id.toString(), // Running Shoes
          quantity: 1,
          priceAtPurchase: '79.99'
        }
      ]
    });

    const order2 = await prisma.order.create({
      data: {
        userId: customer.id,
        total: '1299.99'
      }
    });

    await prisma.orderItem.create({
      data: {
        orderId: order2.id,
        productId: createdProducts[0]._id.toString(), // Laptop
        quantity: 1,
        priceAtPurchase: '1299.99'
      }
    });

    console.log('Created sample orders');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nCustomer credentials:');
    console.log('Email: customer@example.com');
    console.log('Password: customer123');

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await mongoose.connection.close();
  }
}

seed();

