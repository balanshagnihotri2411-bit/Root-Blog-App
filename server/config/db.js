import mongoose from 'mongoose';
import dns from 'dns';

// Force Node's DNS resolver to use custom DNS servers to prevent querySrv ECONNREFUSED on Windows
dns.setServers(['1.1.1.1', '8.8.8.8']);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

