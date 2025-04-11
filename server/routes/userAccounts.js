import express from "express";
const router = express.Router();

import { createAccount, getAccount } from "../controllers/accountController.js";


router.post("/", createAccount);  
router.get("/:id", getAccount);  

export default router;