import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Up to 30-hour battery life with quick charging.',
    price: 399.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    stock: 25,
  },
  {
    name: 'Apple MacBook Air M3 (15-inch)',
    description: 'Impossibly thin and fast with Apple M3 chip, 15.3-inch Liquid Retina display, 16GB unified memory, and 512GB SSD storage.',
    price: 1299.0,
    category: 'Computers',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    stock: 12,
  },
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet click precision mouse with 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, and ergonomic thumb rest.',
    price: 99.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    stock: 45,
  },
  {
    name: 'Keychron Q1 Pro Custom Mechanical Keyboard',
    description: '75% layout QMK/VIA wireless custom mechanical keyboard with CNC aluminum body and hot-swappable switches.',
    price: 199.0,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    stock: 18,
  },
  {
    name: 'Samsung 49-Inch Odyssey G9 Curved Gaming Monitor',
    description: 'Dual QHD 240Hz 1000R curved gaming monitor with Quantum Mini-LED technology and 1ms response time.',
    price: 1099.99,
    category: 'Displays',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    stock: 8,
  },
  {
    name: 'Apple Watch Ultra 2 GPS + Cellular',
    description: 'Rugged 49mm titanium case, precision dual-frequency GPS, up to 36 hours of battery life, and customizable Action button.',
    price: 799.0,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    stock: 20,
  },
  {
    name: 'Bose SoundLink Revolve+ II Bluetooth Speaker',
    description: 'Durable 360-degree portable Bluetooth speaker with deep, immersive sound, water/dust resistance, and built-in handle.',
    price: 249.0,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    stock: 30,
  },
  {
    name: 'Fujifilm X-T5 Mirrorless Digital Camera',
    description: '40.2MP non-stacked X-Trans 5 HR sensor, 5-axis in-body image stabilization, and dedicated retro dials.',
    price: 1699.95,
    category: 'Cameras',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    stock: 6,
  },
  {
    name: 'Anker 737 Power Bank (PowerCore 24K)',
    description: 'Ultra-powerful 140W fast portable charger with smart digital display and 24,000mAh capacity for laptops and phones.',
    price: 129.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&q=80',
    stock: 50,
  },
  {
    name: 'Kindle Paperwhite Signature Edition (32 GB)',
    description: '6.8-inch display, wireless charging, auto-adjusting front light, and weeks of battery life for immersive reading.',
    price: 189.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800&q=80',
    stock: 35,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old records...');
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('[Seeder] Creating admin and user accounts...');
    // Create Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create Normal User
    const normalUser = await User.create({
      name: 'Demo Customer',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
    });

    console.log('[Seeder] Seeding 10 sample products...');
    const createdProducts = await Product.insertMany(sampleProducts);

    console.log('\n===========================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY! ');
    console.log('===========================================');
    console.log(`- Admin Account:  ${adminUser.email} / admin123  (Role: admin)`);
    console.log(`- User Account:   ${normalUser.email} / user123   (Role: user)`);
    console.log(`- Products:       ${createdProducts.length} items added to catalog`);
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
