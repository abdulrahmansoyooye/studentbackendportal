import IdCard from "../models/IdCard.js";
import User from "../models/User.js";

export const requestIdCard = async (req, res) => {
  try {
    const {  qrCodeImage } = req.body;
    const {id}  = req.params
    const user = await User.findById(id);
    if (!user) return res.status(404).json("User wasn't found");

    // Prevent duplicate pending/approved cards
    const existing = await IdCard.findOne({
      userId:id,
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      return res.status(400).json({
        message: "You already have a pending or approved ID card.",
      });
    }


    const newIdCard = await IdCard.create({
      userId:id,
      fullName: user.fullName,
      matricNumber: user.matricNumber,
      department: user.department,
      level: user.level,
      email: user.email,
      photo: user.photo,
      status: "pending",
    });

    res.status(201).json(newIdCard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getUserIdCard = async (req, res) => {
  const { id } = req.params;

  try {
    const found = await IdCard.findOne({ userId: id });

    if (!found) {
      return res.status(200).json({ status: "none" });
    }

    res.status(200).json(found);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const approveIdCard = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await IdCard.findOneAndUpdate(
      { userId: id },
      { status: "approved" },
      { new: true }
    );

    if (!updated) return res.status(404).json("Record not found");

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const revokeIdCard = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await IdCard.findOneAndUpdate(
      { userId: id },
      { status: "revoked" },
      { new: true }
    );

    if (!updated) return res.status(404).json("Record not found");

    res.status(200).json({
      message: "ID card revoked successfully",
      updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllIdCards = async (req, res) => {
  try {
    const { status } = req.query;

    const query = status ? { status } : {};

    const idCards = await IdCard.find(query).sort({ createdAt: -1 });

    res.status(200).json(idCards);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
