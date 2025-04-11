import { User } from "../models/userModel.js";
import { createAccount } from "./accountController.js";

export const createUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  
  try {
    // Input validation (recommended)
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = new User({ firstName, lastName, email });
    const savedUser = await user.save();
    const account = await createAccount(savedUser._id);
    
    // Update user with account reference
    savedUser.accountId = account._id;
    await savedUser.save();
    
    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
      accountId: account._id
    });
    
  } catch (error) {
    console.error(error);
    if (error.code === 11000) { // Handle duplicate email
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v'); // Exclude version key
    res.status(200).json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
                          .populate('accountId', 'balance'); // Include account info
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only provided fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    const updatedUser = await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Consider also deleting the associated account
    // await Account.deleteOne({ userId: user._id });
    
    res.status(200).json({ 
      message: "User deleted successfully",
      deletedUserId: user._id 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};