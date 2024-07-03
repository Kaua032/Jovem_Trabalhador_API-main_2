import { Router } from "express";
import {
  CreateUserController,
  findUserByIdController,
} from "../controllers/user.controller.js";
import { loginController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", CreateUserController);
userRouter.post("/login", loginController);
userRouter.get("/findById", authMiddleware, findUserByIdController);

export default userRouter;
