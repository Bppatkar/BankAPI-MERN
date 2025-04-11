import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully!!");
  } catch (error) {
    console.error("Failed to connect MongoDB", error);
    process.exit(1);
  }
};
