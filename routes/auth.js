import express from "express";
import { LOGIN } from "../controllers/auth.js";

const router = express.Router();
router.post("/login", LOGIN);

export default router;
