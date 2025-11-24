import express from "express";
import { approveIdCard, getAllIdCards, getUserIdCard, requestIdCard, revokeIdCard } from "../controllers/IdCard.js";


const router = express.Router();

// STUDENT
router.post("/request/:id", requestIdCard);
router.get("/:id", getUserIdCard);

// ADMIN
router.get("/", getAllIdCards);
router.patch("/:id/approve", approveIdCard);
router.patch("/:id/revoke", revokeIdCard);

export default router;
