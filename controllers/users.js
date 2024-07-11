import IdCard from "../models/IdCard.js";
import User from "../models/User.js";
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password -gender");

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -gender");
    // const idCards = await IdCard.find({});
    // const idcardUserIds = idCards.map((card) => card.userId);
    // const allusers = users.filter((user) => idcardUserIds.includes(user._id));
    // console.log(allusers);

    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const EditUser = async (req, res) => {
  const { fullName, matricNumber, department, faculty, email, level } =
    req.body;
  try {
    const { id } = req.params;
    const users = await User.findByIdAndUpdate(id, {
      fullName,
      matricNumber,
      department,
      faculty,
      email,
      level,
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
