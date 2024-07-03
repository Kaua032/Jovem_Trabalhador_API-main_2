import { Router } from "express";
import {
  CreateStudentController,
  DeleteStudentController,
  ExportStudentsController,
  GenerateListOfStudentsController,
  GetAllStudentsController,
  GetStudentsBySearchController,
  UpdateStudentController,
} from "../controllers/student.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const studentRouter = Router();

studentRouter.post("/register", authMiddleware, CreateStudentController);
studentRouter.post("/export", authMiddleware, ExportStudentsController);
studentRouter.post("/all", GetAllStudentsController);
studentRouter.post(
  "/generate",
  authMiddleware,
  GenerateListOfStudentsController
);
studentRouter.post("/search", GetStudentsBySearchController);
studentRouter.put("/update", authMiddleware, UpdateStudentController);
studentRouter.delete("/delete/:id", authMiddleware, DeleteStudentController);

export default studentRouter;
