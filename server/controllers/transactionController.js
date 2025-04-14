import { Transaction } from "../models/transactionSchema.js";
import { Account } from "../models/accountSchema.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

export const depositCash = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const account = await Account.findByIdAndUpdate(
      accountId,
      { $inc: { balance: amount } },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const transaction = new Transaction({
      type: "deposit",
      amount,
      accountId,
    });
    await transaction.save();

    res.json({ 
      message: "Cash deposited successfully",
      balance: account.balance,
      transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const withdrawMoney = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const totalBalance = account.balance + account.credit;
    if (totalBalance < amount) {
      return res.status(400).json({ 
        message: "Insufficient funds",
        available: totalBalance
      });
    }

    // First use balance, then credit
    let newBalance = account.balance;
    let newCredit = account.credit;
    
    if (account.balance >= amount) {
      newBalance -= amount;
    } else {
      const remaining = amount - account.balance;
      newBalance = 0;
      newCredit -= remaining;
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { balance: newBalance, credit: newCredit },
      { new: true }
    );

    const transaction = new Transaction({
      type: "withdraw",
      amount,
      accountId,
    });
    await transaction.save();

    res.json({
      message: "Withdrawal successful",
      balance: updatedAccount.balance,
      credit: updatedAccount.credit,
      transaction
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const transferMoney = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    if (fromAccountId === toAccountId) {
      return res.status(400).json({ message: "Cannot transfer to same account" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const fromAccount = await Account.findById(fromAccountId).session(session);
      const toAccount = await Account.findById(toAccountId).session(session);

      if (!fromAccount || !toAccount) {
        throw new Error("One or both accounts not found");
      }

      const totalBalance = fromAccount.balance + fromAccount.credit;
      if (totalBalance < amount) {
        throw new Error("Insufficient funds");
      }

      // First use balance, then credit
      let newFromBalance = fromAccount.balance;
      let newFromCredit = fromAccount.credit;
      
      if (fromAccount.balance >= amount) {
        newFromBalance -= amount;
      } else {
        const remaining = amount - fromAccount.balance;
        newFromBalance = 0;
        newFromCredit -= remaining;
      }

      // Update accounts
      await Account.findByIdAndUpdate(
        fromAccountId,
        { balance: newFromBalance, credit: newFromCredit },
        { session, new: true }
      );

      await Account.findByIdAndUpdate(
        toAccountId,
        { $inc: { balance: amount } },
        { session, new: true }
      );

      // Create transaction
      const transaction = new Transaction({
        type: "transfer",
        amount,
        accountId: fromAccountId,
        toAccountId,
      });
      await transaction.save({ session });

      // Update transactions arrays
      fromAccount.transactions.push(transaction._id);
      toAccount.transactions.push(transaction._id);
      await Promise.all([
        fromAccount.save({ session }),
        toAccount.save({ session })
      ]);

      await session.commitTransaction();
      
      res.json({
        message: "Transfer completed successfully",
        transaction,
        newBalance: newFromBalance,
        newCredit: newFromCredit
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: error.message || "Transfer failed",
      error: error.message 
    });
  }
};

// Add this to your transactionController.js
export const getUsersTransactions = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find the user to get their accountId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all transactions for this account
    const transactions = await Transaction.find({
      $or: [
        { accountId: user.accountId },
        { toAccountId: user.accountId }
      ]
    })
    .populate('accountId', 'accountNumber')
    .populate('toAccountId', 'accountNumber')
    .sort({ timestamp: -1 });

    res.json({
      message: "Transactions retrieved successfully",
      transactions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Error fetching transactions",
      error: error.message 
    });
  }
};

export const updateCredit = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    
    if (amount < 0) {
      return res.status(400).json({ message: "Credit amount cannot be negative" });
    }

    const account = await Account.findByIdAndUpdate(
      accountId,
      { credit: amount },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({
      message: "Credit updated successfully",
      credit: account.credit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("accountId", "accountNumber")
      .populate("toAccountId", "accountNumber")
      .sort({ timestamp: -1 });

    res.json({
      message: "All transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};
