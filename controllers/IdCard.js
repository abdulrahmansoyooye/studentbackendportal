import IdCard from "../models/IdCard.js";
import User from "../models/User.js";

export const createIdCard = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    const newIdCard = new IdCard({
      userId,
      fullName: user.fullName,
      matricNimber: user.matricNumber,
      department: user.department,
    });
    await newIdCard.save();
    res.status(201).json(newIdCard);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
export const getuserIdCard = async (req, res) => {
  const { id } = req.params;
  try {
    const foundIdCard = await IdCard.findOne({ userId: id });

    if (!foundIdCard) return res.status(202).json("Your Id Card is Pending");
    res.status(200).json(foundIdCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getAllIdCards = async (req, res) => {
  try {
    const IdCards = await IdCard.find({});

    res.status(200).json(IdCards.reverse());
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const EditIdCard = async (req, res) => {
  const { fullName, matricNumber, department } = req.body;
  try {
    const { id } = req.params;
    const users = await IdCard.findOneAndUpdate(
      { userId: id },
      {
        userId: id,
        fullName,
        matricNumber,
        department,
      }
    );

    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
