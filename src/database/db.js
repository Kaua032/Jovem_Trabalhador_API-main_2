import mongoose from "mongoose";

const connectDataBase = async () => {
  console.log("Wait connecting to the database");

  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Atlas Connected"))
    .catch((error) => console.log(error));
};

export default connectDataBase;
