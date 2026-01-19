import pool from "../db/pool.js";
import bcrypt from "bcryptjs";
import { User } from "./types.js";

export async function authenticateUser(
  email: string,
  password: string,
): Promise<User | null> {
  try {
    const result = await pool.query(
      `SELECT id, email, name, role, created_at FROM users WHERE email = $1`,
      [email],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const passwordResult = await pool.query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [user.id],
    );

    const passwordHash = passwordResult.rows[0].password_hash;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.created_at,
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await pool.query(
      `SELECT id, email, name, role, created_at FROM users WHERE id = $1`,
      [id],
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

export async function getTeachers(): Promise<User[]> {
  try {
    const result = await pool.query(
      `SELECT id, email, name, role, created_at FROM users WHERE role = 'teacher' ORDER BY name`,
    );
    return result.rows;
  } catch (error) {
    console.error("Error getting teachers:", error);
    throw error;
  }
}

export async function createTeacher(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  try {
    const { v4: uuidv4 } = await import("uuid");
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (id, email, password_hash, role, name) VALUES ($1, $2, $3, $4, $5)`,
      [id, email, passwordHash, "teacher", name],
    );

    const teacherId = uuidv4();
    await pool.query(
      `INSERT INTO teachers (id, user_id, name, email) VALUES ($1, $2, $3, $4)`,
      [teacherId, id, name, email],
    );

    return {
      id,
      email,
      name,
      role: "teacher",
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
}

export async function deleteTeacher(id: string): Promise<void> {
  try {
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
}
