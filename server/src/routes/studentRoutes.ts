import express, { Request, Response } from "express";
import {
  getStudentsByTeacher,
  getAllStudents,
  createStudent,
  deleteStudent,
} from "../services/studentService.js";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.query;

    if (teacherId) {
      const students = await getStudentsByTeacher(teacherId as string);
      return res.json(students);
    }

    const students = await getAllStudents();
    res.json(students);
  } catch (error) {
    console.error("Error getting students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, teacherId } = req.body;

    if (!name || !teacherId) {
      return res.status(400).json({ error: "Name and teacherId are required" });
    }

    const student = await createStudent(name, teacherId);
    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteStudent(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
