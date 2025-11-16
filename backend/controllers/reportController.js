import { prisma } from '../config/database.js';
import { Product } from '../models/Product.js';

// SQL Aggregation: Daily Revenue
export const getDailyRevenue = async (req, res) => {
  try {
    const dailyRevenue = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total)::numeric as revenue
      FROM orders
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    res.json({ dailyRevenue });
  } catch (error) {
    console.error('Daily revenue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// SQL Aggregation: Top Customers
export const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(o.id) as order_count,
        SUM(o.total)::numeric as total_spent
      FROM users u
      INNER JOIN orders o ON u.id = o.user_id
      GROUP BY u.id, u.name, u.email
      ORDER BY total_spent DESC
      LIMIT 10
    `;

    res.json({ topCustomers });
  } catch (error) {
    console.error('Top customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// MongoDB Aggregation: Category-wise Sales
export const getCategoryWiseSales = async (req, res) => {
  try {
    // Get all order items with product IDs
    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: true
      }
    });

    // Aggregate by category
    const categorySales = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' }
        }
      },
      {
        $project: {
          category: '$_id',
          totalProducts: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          totalStock: 1,
          maxPrice: 1,
          minPrice: 1,
          _id: 0
        }
      },
      {
        $sort: { totalProducts: -1 }
      }
    ]);

    // Calculate sales per category from order items
    const productIds = orderItems.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const categoryRevenue = {};
    orderItems.forEach(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      if (product) {
        const category = product.category;
        if (!categoryRevenue[category]) {
          categoryRevenue[category] = {
            category,
            totalRevenue: 0,
            totalQuantity: 0,
            orderCount: 0
          };
        }
        categoryRevenue[category].totalRevenue +=
          parseFloat(item.priceAtPurchase) * item.quantity;
        categoryRevenue[category].totalQuantity += item.quantity;
        categoryRevenue[category].orderCount += 1;
      }
    });

    const categorySalesData = Object.values(categoryRevenue).map(cat => ({
      ...cat,
      totalRevenue: parseFloat(cat.totalRevenue.toFixed(2))
    }));

    res.json({
      categoryStats: categorySales,
      categorySales: categorySalesData
    });
  } catch (error) {
    console.error('Category sales error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all reports
export const getAllReports = async (req, res) => {
  try {
    // Get daily revenue using Prisma query
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      select: {
        total: true,
        createdAt: true
      }
    });

    // Group by date
    const dailyRevenueMap = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailyRevenueMap[date]) {
        dailyRevenueMap[date] = { date, order_count: 0, revenue: 0 };
      }
      dailyRevenueMap[date].order_count += 1;
      dailyRevenueMap[date].revenue += parseFloat(order.total);
    });

    const dailyRevenue = Object.values(dailyRevenueMap)
      .map(day => ({
        ...day,
        revenue: day.revenue.toString()
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Get top customers
    const allOrders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const customerMap = {};
    allOrders.forEach(order => {
      const userId = order.userId;
      if (!customerMap[userId]) {
        customerMap[userId] = {
          id: order.user.id,
          name: order.user.name,
          email: order.user.email,
          order_count: 0,
          total_spent: 0
        };
      }
      customerMap[userId].order_count += 1;
      customerMap[userId].total_spent += parseFloat(order.total);
    });

    const topCustomers = Object.values(customerMap)
      .sort((a, b) => b.total_spent - a.total_spent)
      .slice(0, 10)
      .map(customer => ({
        id: String(customer.id),
        name: customer.name,
        email: customer.email,
        order_count: Number(customer.order_count),
        total_spent: customer.total_spent.toString()
      }));

    // Get category stats from MongoDB
    const categoryDataRaw = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalStock: { $sum: '$stock' }
        }
      },
      {
        $project: {
          category: '$_id',
          totalProducts: 1,
          averagePrice: { $round: ['$averagePrice', 2] },
          totalStock: 1,
          _id: 0
        }
      },
      {
        $sort: { totalProducts: -1 }
      }
    ]);

    // Convert to ensure all numbers are regular JavaScript numbers
    const categoryData = categoryDataRaw.map(cat => ({
      category: cat.category,
      totalProducts: Number(cat.totalProducts),
      averagePrice: Number(cat.averagePrice || 0),
      totalStock: Number(cat.totalStock)
    }));

    // Calculate category sales from order items
    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: true
      }
    });

    const productIds = orderItems.map(item => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const categorySalesMap = {};
    orderItems.forEach(item => {
      const product = products.find(p => p._id.toString() === item.productId);
      if (product) {
        const category = product.category;
        if (!categorySalesMap[category]) {
          categorySalesMap[category] = {
            category,
            totalRevenue: 0,
            totalQuantity: 0,
            orderCount: 0
          };
        }
        categorySalesMap[category].totalRevenue +=
          parseFloat(item.priceAtPurchase) * item.quantity;
        categorySalesMap[category].totalQuantity += item.quantity;
        categorySalesMap[category].orderCount += 1;
      }
    });

    const categorySales = Object.values(categorySalesMap).map(cat => ({
      ...cat,
      totalRevenue: parseFloat(cat.totalRevenue.toFixed(2))
    }));

    // Helper function to convert BigInt to string
    const convertBigInt = (obj) => {
      if (obj === null || obj === undefined) return obj;
      if (typeof obj === 'bigint') return obj.toString();
      if (Array.isArray(obj)) return obj.map(convertBigInt);
      if (typeof obj === 'object') {
        const converted = {};
        for (const [key, value] of Object.entries(obj)) {
          converted[key] = convertBigInt(value);
        }
        return converted;
      }
      return obj;
    };

    const response = {
      dailyRevenue: convertBigInt(dailyRevenue),
      topCustomers: convertBigInt(topCustomers),
      categoryStats: convertBigInt(categoryData),
      categorySales: convertBigInt(categorySales),
      totalOrders: Number(allOrders.length),
      totalRevenue: allOrders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)
    };

    res.json(response);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

