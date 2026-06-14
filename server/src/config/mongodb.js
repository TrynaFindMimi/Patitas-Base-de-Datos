import mongoose from 'mongoose';

const connectMongo = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patitas_catalog';
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  });
  console.log('MongoDB conectado');
};

mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

export default connectMongo;