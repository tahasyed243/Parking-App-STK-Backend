import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import spotRoutes from "./routes/spots.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'https://parking-app-stk-frontend.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/spots", spotRoutes);

const PORT = process.env.PORT || 5000;
// YEH LINE CHANGE KAREIN:
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));