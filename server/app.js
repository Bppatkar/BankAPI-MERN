import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./db/database.js";
dotenv.config();

const app = express();
connectDB();

//middleware
app.use(express.json()); // to parse json data

// Routes
app.use("/api/users", userRoutes);

//Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost/${PORT}`);
});
