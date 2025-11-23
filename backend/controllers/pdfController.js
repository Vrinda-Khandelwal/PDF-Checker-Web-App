import { extractTextFromPDF } from "../utils/pdfExtractor.js";
import { runChecks } from "../utils/checks.js";

export async function analyzePDF(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    const pdfBuffer = req.file.buffer;

    // Extract text
    const text = await extractTextFromPDF(pdfBuffer);

    // Run checks
    const results = runChecks(text);

    res.json({
      success: true,
      textPreview: text.slice(0, 500), // send only preview
      results
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}
