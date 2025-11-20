import express from "express";
import {
  requestIdCard,
  getUserIdCard,
  getAllIdCards,
  approveIdCard,
  revokeIdCard,
} from "../controllers/idCardController.js";

const router = express.Router();

// STUDENT
router.post("/request", requestIdCard);
router.get("/:id", getUserIdCard);

// ADMIN
router.get("/", getAllIdCards);
router.patch("/:id/approve", approveIdCard);
router.patch("/:id/revoke", revokeIdCard);

export default router;
