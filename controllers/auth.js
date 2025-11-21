import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {  mockUsers} from "../data/mockdata.js";
import User from "../models/User.js";

export const LOGIN = async (req, res) => {
  try {
    const { matricNumber, password } = req.body;

    // 1. Find user in mock file
    const student = await User.findOne({ matricNumber });

    if (!student) {
      return res.status(404).json({ message: "Matric number not recognized" });
    }

    // 2. Verify shared password
    const validPassword = await bcrypt.compare(password, student.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    // 3. Issue JWT token
    const token = jwt.sign(
      { matricNumber: student.matricNumber },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        fullName: student.fullName,
        matricNumber: student.matricNumber,
        department: student.department,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
