import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import parkingRoutes from "./routes/parkingRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ API routes
app.use("/api/spots", parkingRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "🚗 Parking API running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
