import express from "express";
import { getUser, getAllUsers,EditUser } from "../controllers/users.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/Edit", verifyToken, EditUser);
router.get("/", verifyToken, getAllUsers);
export default router;
