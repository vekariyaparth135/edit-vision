import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/edit_vision';
    const conn = await mongoose.connect(mongoUri);
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
  }
};

export default connectDB;
