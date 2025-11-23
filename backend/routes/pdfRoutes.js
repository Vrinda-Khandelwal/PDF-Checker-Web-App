import express from "express";
import upload from "../middleware/upload.js";
import { analyzePDF } from "../controllers/pdfController.js";

const router = express.Router();

// POST /api/pdf/analyze
router.post("/analyze", upload.single("pdf"), analyzePDF);

export default router;
