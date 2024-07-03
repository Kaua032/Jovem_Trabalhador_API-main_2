import "dotenv/config";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "jsonwebtoken";

export const CreateUserController = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.send("Preencha todos os campos");
    }
    const ifUserExists = await User.findOne({ email: email });

    if (ifUserExists) {
      return res.status(409).send({ message: "Email já cadastrado" });
    }

    const user = new User({
      name: name.toLowerCase(),
      email: email.toLowerCase(),
      password,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
      expiresIn: 86400,
    });

    res.send({ token });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export const findUserByIdController = async (req, res) => {
  const userId = req.userId;

  try {
    const userFindid = await User.findById(userId);

    const user = {
      name: userFindid.name,
      email: userFindid.email,
    };

    return res.status(200).send({ user });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
