import express, { Request, Response } from "express";
import { getAdminStats } from "../services/adminService.js";

const router = express.Router();

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    console.error("Error getting admin stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
