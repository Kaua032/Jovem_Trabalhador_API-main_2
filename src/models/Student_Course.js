import mongoose from "mongoose";

const Student_CourseSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  courseId: { type: String, required: true },
});

const Student_Course = mongoose.model("Student_Course", Student_CourseSchema);

export default Student_Course;
