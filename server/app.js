import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import userAccounts from "./routes/userAccounts.js";
import transactions from "./routes/transactions.js";
import errorHandler from "./middleware/errorHandler.js";
import { connectDB } from "./db/database.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log("file exist here....", __dirname);

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(express.json());

// Static files
const distPath = path.join(__dirname, "../client/dist");
console.log("Serving static files from:", distPath);
app.use(express.static(distPath));

// Routes
app.get("/api", (req, res) => res.send("server is running"));
app.use("/api/users", userRoutes);
app.use("/api/accounts", userAccounts);
app.use("/api/transactions", transactions);

// Error handling middleware
app.use(errorHandler);

// ⚠️ Important: Handle all other routes with index.html (for React Router)
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
