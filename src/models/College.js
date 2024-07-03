import mongoose from "mongoose";

const CollegeSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  uf: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
});

const College = mongoose.model("College", CollegeSchema);

export default College;
