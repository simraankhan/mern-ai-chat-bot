import { Router } from "express";
import { newChat } from "../controller/chat.controller.js";
import { verifyToken } from "../utils/token-manager.js";
import { customValidator, newChatValidations } from "../utils/validator.js";

const chatRoutes = Router();

chatRoutes.post(
  "/new",
  verifyToken,
  customValidator(newChatValidations),
  newChat
);

export default chatRoutes;
