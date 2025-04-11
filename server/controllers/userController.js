import { User } from "../models/userModel.js";
import { createAccount } from "./accountController.js";

export const createUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const user = new User({
      firstName,
      lastName,
      email,
    });

    const savedUser = await user.save();
    // creating account for the new user
    const account = await createAccount(savedUser.id);
    // setting account property of the user to the new account
    savedUser.accountId = account;
    await savedUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).res.send({ message: "Server Error" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).res.send({ message: "Server Error" });
  }
};
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.param.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).res.send({ message: "Server Error" });
  }
};
export const updateUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    let user = await User.findById(req.param.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).res.send({ message: "Server Error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.param.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).res.send({ message: "Server Error" });
  }
};
