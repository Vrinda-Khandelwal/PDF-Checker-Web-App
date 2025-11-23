export async function extractTextFromPDF(buffer) {
  try {
    const pdf = (await import("pdf-parse")).default; // <-- FIX
    const data = await pdf(buffer);
    return data.text;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to extract PDF text");
  }
}
