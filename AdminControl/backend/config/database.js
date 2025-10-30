const mongoose = require('mongoose');

const connectDB = async (retryCount = 0) => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000; // 5 seconds
  
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds to select a server
    socketTimeoutMS: 45000, // 45 seconds for socket operations
    connectTimeoutMS: 30000, // 30 seconds to establish initial connection
    maxPoolSize: 10,
    minPoolSize: 2,
    retryWrites: true,
    retryReads: true,
  };

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    return conn;
  } catch (error) {
    console.error(`Database connection error (attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1))); // Exponential backoff
      return connectDB(retryCount + 1);
    } else {
      console.error('Max retries reached. Could not connect to MongoDB.');
      // In production, you might want to exit, but with a delay to allow logging
      setTimeout(() => process.exit(1), 1000);
      throw error;
    }
  }
};

module.exports = connectDB;
