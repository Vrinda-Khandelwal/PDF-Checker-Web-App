import express from "express";
import cors from "cors";
import pdfRoutes from "./routes/pdfRoutes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",   // your Vite dev URL
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Main route
app.use("/api/pdf", pdfRoutes);

app.get("/", (req, res) => {
  res.send("PDF Checker Backend Running");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
