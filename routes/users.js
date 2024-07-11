import express from "express";
import { getUser, getAllUsers, EditUser } from "../controllers/users.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.post("/edit/:id", verifyToken, EditUser);
router.get("/", getAllUsers);
export default router;
