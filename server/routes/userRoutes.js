import express from "express";
const router = express.Router();
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";


//Create new user
router.route("/").post(createUser);

// get all users
router.route("/").get(getAllUsers);

// get single user
router.route("/:id").get(getUser);
router.route("/:id").put(updateUser);

// deleted user
router.route("/:id").delete(deleteUser);

export default router;
