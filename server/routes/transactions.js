import express from "express";
const router = express.Router();

import {
  depositCash,
  withdrawMoney,
  updateCredit,
  transferMoney,
  getUsersTransactions,
} from "../controllers/transactionController.js";

router.route("/deposit").post(depositCash);
router.route("/withdraw").post(withdrawMoney);
router.route("/credit").put(updateCredit);
router.route("/transfer").post(transferMoney);
router.route("/usersData/:id").get(getUsersTransactions);


export default router;