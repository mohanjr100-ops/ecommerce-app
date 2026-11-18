import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get dashboard metrics (total orders, revenue, product count, recent orders)
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Calculate total revenue across all orders
    const revenueAgg = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
        },
      },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Breakdown orders by status
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Fetch 5 most recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalProducts,
        totalUsers,
        statusCounts,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};
