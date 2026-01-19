import pool from "../db/pool.js";
import { Student } from "./types.js";
import { v4 as uuidv4 } from "uuid";

interface StudentRow {
  id: string;
  name: string;
  teacher_id: string;
  created_at: string;
}

export async function getStudentsByTeacher(
  teacherId: string,
): Promise<Student[]> {
  try {
    const result = await pool.query(
      `SELECT id, name, teacher_id, created_at FROM students WHERE teacher_id = $1 ORDER BY name`,
      [teacherId],
    );
    return result.rows.map((row: StudentRow) => ({
      id: row.id,
      name: row.name,
      teacherId: row.teacher_id,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error("Error getting students by teacher:", error);
    throw error;
  }
}

export async function getAllStudents(): Promise<Student[]> {
  try {
    const result = await pool.query(
      `SELECT id, name, teacher_id, created_at FROM students ORDER BY name`,
    );
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      teacherId: row.teacher_id,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error("Error getting all students:", error);
    throw error;
  }
}

export async function createStudent(
  name: string,
  teacherId: string,
): Promise<Student> {
  try {
    const id = uuidv4();
    const createdAt = new Date().toISOString();

    await pool.query(
      `INSERT INTO students (id, name, teacher_id, created_at) VALUES ($1, $2, $3, $4)`,
      [id, name, teacherId, createdAt],
    );

    return {
      id,
      name,
      teacherId,
      createdAt,
    };
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}

export async function deleteStudent(id: string): Promise<void> {
  try {
    await pool.query(`DELETE FROM students WHERE id = $1`, [id]);
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
}

export async function getStudentById(id: string): Promise<Student | null> {
  try {
    const result = await pool.query(
      `SELECT id, name, teacher_id, created_at FROM students WHERE id = $1`,
      [id],
    );
    if (result.rows.length === 0) return null;

    const row: StudentRow = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      teacherId: row.teacher_id,
      createdAt: row.created_at,
    };
  } catch (error) {
    console.error("Error getting student:", error);
    throw error;
  }
}
