import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import pool from "./db/pool.js";
import initializeDatabase from "./db/migrate.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("✓ Database connected");

    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
