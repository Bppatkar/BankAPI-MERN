import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import userAccounts from "./routes/userAccounts.js";
import transactions from "./routes/transactions.js";
import errorHandler from "./middleware/errorHandler.js";
import { connectDB } from "./db/database.js";


dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.get("/api", (req, res) => res.send("server is running"));
app.use("/api/users", userRoutes);
app.use("/api/accounts", userAccounts);
app.use("/api/transactions", transactions);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
