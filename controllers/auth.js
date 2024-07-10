import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AllUsersData } from "../data/index.js";

export const register = async (req, res) => {
  const verifyStudent = (fullName) => {
    return AllUsersData.some((user) => user.fullName === fullName);
  };
  try {
    const {
      fullName,
      matricNumber,
      department,
      faculty,
      email,
      password,
      gender,
      level,
      photo,
    } = req.body;

    if (!verifyStudent(fullName)) {
      return res.status(404).json({ message: "This user is not a student" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      matricNumber,
      department,
      faculty,
      email,
      password: passwordHash,
      gender,
      level,
      photo,
    });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN

export const LOGIN = async (req, res) => {
  try {
    const { matricNumber, password } = req.body;
    const user = await User.findOne({ matricNumber: matricNumber });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const id = user._id;

      res.status(200).json({ token, userId: id });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
