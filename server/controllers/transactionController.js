import { Transaction } from "../models/transactionSchema.js";
import { Account } from "../models/accountSchema.js";

// Helper function for creating transactions
const createTransaction = async (fromAccountId, toAccountId, amount) => {
  const transaction = new Transaction({
    type: "transfer",
    accountId: fromAccountId,
    toAccountId,
    amount,
  });
  await transaction.save();
  return transaction;
};

export const depositCash = async (req, res) => {
  try {
    const { userId, accountId, amount } = req.body;
    
    const account = await Account.findOneAndUpdate(
      { _id: accountId, userId: userId },
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

    res.json({ message: "Cash deposited successfully", account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const withdrawMoney = async (req, res) => {
  try {
    const { userId, accountId, amount } = req.body;
    const account = await Account.findOne({ _id: accountId, userId: userId });
    
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.balance + account.credit < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const newBalance = account.balance - amount;
    const updatedAccount = await Account.findOneAndUpdate(
      { _id: accountId, userId: userId },
      { balance: newBalance },
      { new: true }
    );

    const transaction = new Transaction({
      type: "withdrawal",
      amount,
      accountId,
    });
    await transaction.save();

    res.json({
      message: "Cash withdrawn successfully",
      account: updatedAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateCredit = async (req, res) => {
  try {
    const { userId, accountId, amount } = req.body;
    const account = await Account.findOneAndUpdate(
      { _id: accountId, userId: userId },
      { $inc: { credit: amount } },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json({ message: "Credit updated successfully", account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const transferMoney = async (req, res) => {
  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    const fromAccount = await Account.findById(fromAccountId);
    const toAccount = await Account.findById(toAccountId);

    if (!fromAccount) {
      return res.status(404).json({ message: 'From account not found' });
    }

    if (!toAccount) {
      return res.status(404).json({ message: 'To account not found' });
    }

    const totalBalance = fromAccount.balance + fromAccount.credit;
    if (totalBalance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const updatedFromAccount = await Account.findOneAndUpdate(
      { _id: fromAccountId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { new: true }
    );
    
    if (!updatedFromAccount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    await Account.findByIdAndUpdate(
      toAccountId,
      { $inc: { balance: amount } },
      { new: true }
    );

    const transaction = await createTransaction(fromAccountId, toAccountId, amount);
    
    // Update transactions arrays
    fromAccount.transactions.push(transaction._id);
    toAccount.transactions.push(transaction._id);
    await Promise.all([fromAccount.save(), toAccount.save()]);

    res.json({
      message: 'Transfer completed successfully',
      transactionId: transaction._id,
      amount: amount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getUsersTransactions = async (req, res) => {
  try {
    const userId = req.params.id;
    const transactions = await Transaction.find({ accountId: userId })
      .populate('accountId', 'balance')
      .populate('toAccountId', 'balance');
    
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};