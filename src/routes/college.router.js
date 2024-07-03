import { Router } from "express";
import {
  CreateCollegeController,
  FindCollegeController,
  GetAllCollegesController,
  UpdateCollegeController,
} from "../controllers/college.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const collegeRouter = Router();

collegeRouter.post("/register", authMiddleware, CreateCollegeController);
collegeRouter.get("/all", GetAllCollegesController);
collegeRouter.put("/update/:id", authMiddleware, UpdateCollegeController);
collegeRouter.post("/find", authMiddleware, FindCollegeController);

export default collegeRouter;
