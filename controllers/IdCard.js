import IdCard from "../models/IdCard.js";
import User from "../models/User.js";
import QRCode from "qrcode";

export const requestIdCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { qrCodeImage } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = await IdCard.findOne({
      userId: id,
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      return res.status(409).json({
        message: "You already have a pending or approved ID card",
      });
    }

    const qrcode = await QRCode.toDataURL(qrCodeImage);

    const card = await IdCard.create({
      userId: id,
      fullName: user.fullName,
      matricNumber: user.matricNumber,
      department: user.department,
      level: user.level,
      email: user.email,
      photo: user.photo,
      qrcode,
    });

    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ message: "ID request failed" });
  }
};
export const approveIdCard = async (req, res) => {
  try {
    const card = await IdCard.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!card) return res.status(404).json({ message: "Not found" });

    res.status(200).json(card);
  } catch {
    res.status(500).json({ message: "Approval failed" });
  }
};

export const revokeIdCard = async (req, res) => {
  try {
    const card = await IdCard.findByIdAndUpdate(
      req.params.id,
      { status: "revoked" },
      { new: true }
    );

    if (!card) return res.status(404).json({ message: "Not found" });

    res.status(200).json(card);
  } catch {
    res.status(500).json({ message: "Revocation failed" });
  }
};
