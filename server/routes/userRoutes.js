import express from "express";
const router = express.Router();
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

//Create new user and get all users
router.route("/").post(createUser).get(getAllUsers);

// get single user
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
