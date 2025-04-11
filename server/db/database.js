import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const connect = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      "Database connected successfully!!",
      connect.connection.host,
      connect.connection.name
    );
  } catch (error) {
    console.error("Failed to connect MongoDB", error);
    process.exit(1);
  }
};
