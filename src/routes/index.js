import { Router } from "express";
import userRouter from "./user.router.js";
import studentRouter from "./student.router.js";
import collegeRouter from "./college.router.js";
import courseRouter from "./course.router.js";
import partyRouter from "./party.router.js";

const router = Router();

router.use("/user", userRouter);
router.use("/student", studentRouter);
router.use("/college", collegeRouter);
router.use("/course", courseRouter);
router.use("/party", partyRouter);

export default router;
