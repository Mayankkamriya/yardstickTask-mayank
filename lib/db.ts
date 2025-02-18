import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

interface Cached {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const cached: Cached = { conn: null, promise: null };

const connectDB = async (): Promise<Mongoose> => {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable in .env.local");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {}).then((mongoose) => {
      console.log("MongoDB connected successfully!");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  // console.log('connected')
  return cached.conn;
};

export default connectDB;  // Default export
