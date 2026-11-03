import mongoose from "mongoose";

declare global {
  var mongooseConnection: Promise<typeof mongoose> | undefined;
}

export function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");
  global.mongooseConnection ??= mongoose.connect(uri);
  return global.mongooseConnection;
}
