import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // jo tumne diya
import authRoutes from "./routes/auth.js";
import spotRoutes from "./routes/spots.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // JSON body parsing
app.use("/api/auth", authRoutes);
app.use("/api/spots", spotRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
