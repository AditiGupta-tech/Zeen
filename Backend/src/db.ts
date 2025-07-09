import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MongoDB connection string is missing in environment variables!');
  process.exit(1);
}

export const connectToDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      dbName: 'zeenDB', // Optional: name your DB explicitly (change if needed)
    });

    console.log(`✅ MongoDB connected successfully at ${new Date().toISOString()}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`❌ Failed to connect to MongoDB: ${err.message}`);
    } else {
      console.error('❌ Unknown error occurred during MongoDB connection.');
    }
    process.exit(1);
  }
};
