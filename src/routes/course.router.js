import { Router } from "express";
import {
  CreateCourseController,
  FindCourseController,
  GetAllCoursesController,
  UpdateCourseController,
} from "../controllers/course.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const courseRouter = Router();

courseRouter.post("/register", authMiddleware, CreateCourseController);
courseRouter.get("/all", GetAllCoursesController);
courseRouter.put("/update/:id", authMiddleware, UpdateCourseController)
courseRouter.post("/find", authMiddleware, FindCourseController)

export default courseRouter;
