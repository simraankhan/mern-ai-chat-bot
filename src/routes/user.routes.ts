import { Router } from "express";
import {
  getAllUsers,
  userLogin,
  userSignUp,
  verifyUser,
} from "../controller/user.controller.js";
import {
  customValidator,
  loginValidations,
  signUpValidations,
} from "../utils/validator.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/sign-up", customValidator(signUpValidations), userSignUp);
userRoutes.post("/log-in", customValidator(loginValidations), userLogin);
userRoutes.get("/verify-token", verifyToken, verifyUser);

export default userRoutes;
