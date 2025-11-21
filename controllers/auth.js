import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
