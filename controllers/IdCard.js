import mongoose from "mongoose";
import IdCard from "../models/IdCard.js";
import User from "../models/User.js";
import QRCode from "qrcode";

export const requestIdCard = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existing = await IdCard.findOne({
      userId: id,
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      return res.status(409).json({
        message: "You already have a pending or approved ID card",
      });
    }

    /**
     * ✅ STEP 1: Build QR payload
     * Minimal, structured, verifiable
     */
    const qrPayload = {
      userId: user._id,
      fullName: user.fullName,
      matricNumber: user.matricNumber,
      department: user.department,
      level: user.level,
      issuedAt: new Date().toISOString(),
    };

    /**
     * ✅ STEP 2: Convert payload → QR image
     */
    const qrCodeImage = await QRCode.toDataURL(
      JSON.stringify(qrPayload),
      {
        errorCorrectionLevel: "H",
        type: "image/png",
        margin: 2,
        width: 300,
      }
    );

    /**
     * ✅ STEP 3: Save card
     */
    const card = await IdCard.create({
      userId: user._id,
      fullName: user.fullName,
      matricNumber: user.matricNumber,
      department: user.department,
      level: user.level,
      email: user.email,
      photo: user.photo,
      qrcode: qrCodeImage,
      status: "pending",
    });

    res.status(201).json(card);
  } catch (err) {
    console.error(err);
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
