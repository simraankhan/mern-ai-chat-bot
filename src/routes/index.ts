import { Router } from "express";
import userRoutes from "./user.routes.js";
import chatRoutes from "./chat.routes.js";

const appRouter = Router();

appRouter.use("/user", userRoutes);
// Protected api
appRouter.use("/chat", chatRoutes);

export default appRouter;
