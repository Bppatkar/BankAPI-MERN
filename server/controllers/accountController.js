import { Account } from "../models/accountSchema.js";

export const createAccount = async (userId) => {
  try {
    const account = new Account({
      userId: userId,
      balance: 0,
      credit: 0,
    });
    await account.save();
    return account;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" }); // Fixed response
    }
    res.status(200).json(account);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};


export const getAccountBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.json({ balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
