import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  getuserIdCard,
  getAllIdCards,
  EditIdCard,
} from "../controllers/IdCard.js";
const router = express.Router();
// READ
router.get("/:id", verifyToken, getuserIdCard);
router.get("/:id/Edit", verifyToken, EditIdCard);
router.get("/", verifyToken, getAllIdCards);

export default router;
