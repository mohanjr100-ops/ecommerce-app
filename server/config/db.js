import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // 5 second connection timeout
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n[MongoDB Connection Error]: ${error.message}`);
    console.error(`[Notice]: Could not connect to MongoDB at "${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce'}".`);
    console.error(`          1. If you have MongoDB installed, make sure the service is started.`);
    console.error(`          2. Alternatively, put your free MongoDB Atlas cloud URI in server/.env\n`);
    process.exit(1);
  }
};

export default connectDB;
