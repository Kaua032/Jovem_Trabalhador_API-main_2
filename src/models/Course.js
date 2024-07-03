import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    }
})

const Course = mongoose.model("Course", CourseSchema);

export default Course;