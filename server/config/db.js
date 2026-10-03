const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codetrack';
  
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if local MongoDB service is offline
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.log('ℹ️ Local MongoDB service is offline.');
    console.log('⚡ CodeTrack is running with local JSON/Memory store so all features work seamlessly out of the box!');
    console.log('👉 To connect to MongoDB Atlas or local MongoDB, start mongod or update MONGO_URI in server/.env');
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
