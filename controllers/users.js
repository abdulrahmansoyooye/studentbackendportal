import mongoose from "mongoose";
import IdCard from "../models/IdCard.js";
import User from "../models/User.js";

/* ==========================
   GET SINGLE USER
========================== */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-password -gender");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("getUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ==========================
   GET USERS WITHOUT ID CARDS
========================== */
export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const search = req.query.search || "";

    const query = search
      ? { fullName: { $regex: search, $options: "i" } }
      : {};

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -gender")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      data: users,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/* ==========================
   UPDATE USER
========================== */
export const EditUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // ✅ Allow only safe fields
    const allowedUpdates = [
      "fullName",
      "matricNumber",
      "department",
      "faculty",
      "email",
      "level",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,           // ✅ return updated doc
      runValidators: true, // ✅ schema validation
      select: "-password -gender",
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("EditUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
