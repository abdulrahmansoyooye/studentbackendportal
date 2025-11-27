import mongoose from "mongoose";

const idCardSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true, // one ID card per user
    },

    fullName: { type: String, required: true },
    matricNumber: { type: String, required: true }, // FIXED typo
    department: { type: String, required: true },
    level: { type: String, required: true },
    email: { type: String, required: true },
    photo: { type: String, required: true },

    // NEW FIELD
    status: {
      type: String,
      enum: ["pending", "approved", "revoked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const IdCard = mongoose.model("IdCard", idCardSchema);
export default IdCard;
