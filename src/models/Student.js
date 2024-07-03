import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  responsible_name: {
    type: String,
    require: true,
  },
  born_date: {
    type: Date,
    require: true,
  },
  registration: {
    type: Date,
  },
  id_college: {
    type: Object,
  },
  id_party: {
    type: Object,
  },
  id_courses: {
    type: Array,
  },
});

const Student = mongoose.model("Student", StudentSchema);

export default Student;
