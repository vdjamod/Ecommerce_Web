import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';

// PostgreSQL connection via Prisma
export const prisma = new PrismaClient();

// MongoDB connection
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  await mongoose.connection.close();
});

