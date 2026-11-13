
import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing in environment variables');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = true;

    console.log(
      `[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`
    );

  } catch (error) {
    isConnected = false;
    console.error('[MongoDB Connection Error]:', error.message);
    throw error;
  }
};

export default connectDB;
