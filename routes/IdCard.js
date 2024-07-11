import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  getuserIdCard,
  getAllIdCards,
  EditIdCard,
} from "../controllers/IdCard.js";
const router = express.Router();
// READ
router.get("/:id", getuserIdCard);
router.get("/:id/edit", verifyToken, EditIdCard);
router.get("/", getAllIdCards);

export default router;
