// middleware/createTransaction.js
import { Transaction } from "../models/transactionSchema.js";

export const createTransaction = async (fromAccountId, toAccountId, amount) => {
  const transactionData = {
    type: "transfer",
    accountId: fromAccountId,
    toAccountId: toAccountId,
    amount: amount,
  };
  const transaction = new Transaction(transactionData);
  await transaction.save();
  return transaction;
};
