import express from "express";
const router = express.Router();

import { createAccount, getAccount, getAccountBalance } from "../controllers/accountController.js";


router.post("/", createAccount);  
router.get("/:id", getAccount);  
router.get("/balance/:id", getAccountBalance);

export default router;