import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  getuserIdCard,
  getAllIdCards,
  EditIdCard,
  deleteuserId,
} from "../controllers/IdCard.js";
const router = express.Router();
// READ
router.get("/:id", getuserIdCard);
router.get("/:id/edit", verifyToken, EditIdCard);
router.get("/", getAllIdCards);
// Delete
router.delete("/delete/:id", deleteuserId);

export default router;
