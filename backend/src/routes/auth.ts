import express from "express";
import {
  register,
  login,
  refreshToken,
  getAllUsers,
  deleteUser,
} from "../modules/auth/auth.controller";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/users", getAllUsers);
router.delete("/users/:email", deleteUser);

export default router;
