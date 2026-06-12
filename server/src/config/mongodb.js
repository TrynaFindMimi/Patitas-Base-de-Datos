import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectMongo = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('MongoDB conectado');
};

mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

export default connectMongo;