import express from "express";
const router = express.Router();

import { createAccount, getAccount } from "../controllers/accountController.js";

router.route("/").post(createAccount);
router.get("/:id").get(getAccount);

module.export = router;
