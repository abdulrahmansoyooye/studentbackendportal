import mongoose from "mongoose";
const idCardSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      reuired: true,
    },

    fullName: {
      type: String,
      reuired: true,
    },
    matricNimber: {
      type: String,
      reuired: true,
    },
    department: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },

    qrcode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const IdCard = mongoose.model("IdCard", idCardSchema);
export default IdCard;
