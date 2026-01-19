import express, { Request, Response } from "express";
import {
  getAttendance,
  getStudentAttendanceHistory,
  saveAttendance,
} from "../services/attendanceService.js";

const router = express.Router();

// GET /api/attendance?date=YYYY-MM-DD&teacherId=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const { date, studentId } = req.query;

    if (studentId) {
      const records = await getStudentAttendanceHistory(studentId as string);
      return res.json(records);
    }

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const teacherId = req.query.teacherId as string;
    if (!teacherId) {
      return res.status(400).json({ error: "TeacherId is required" });
    }

    const records = await getAttendance(date as string, teacherId);
    res.json(records);
  } catch (error) {
    console.error("Error getting attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/attendance
router.post("/", async (req: Request, res: Response) => {
  try {
    const { date, teacherId, updates } = req.body;

    if (!date || !teacherId || !updates) {
      return res
        .status(400)
        .json({ error: "Date, teacherId, and updates are required" });
    }

    await saveAttendance(date, teacherId, updates);
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
