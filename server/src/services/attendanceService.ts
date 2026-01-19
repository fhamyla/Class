import pool from '../db/pool.js';
import { AttendanceRecord } from './types.js';
import { v4 as uuidv4 } from 'uuid';

interface AttendanceRow {
  id: string;
  student_id: string;
  teacher_id: string;
  date: string;
  status: 'present' | 'absent';
  marked_at: string;
}

export async function getAttendance(date: string, teacherId: string): Promise<AttendanceRecord[]> {
  try {
    const result = await pool.query(
      `SELECT id, student_id, teacher_id, date, status, marked_at 
       FROM attendance_records 
       WHERE date = $1 AND teacher_id = $2
       ORDER BY marked_at`,
      [date, teacherId]
    );
    return result.rows.map((row: AttendanceRow) => ({
      id: row.id,
      date: row.date,
      studentId: row.student_id,
      teacherId: row.teacher_id,
      status: row.status,
      markedAt: row.marked_at,
    }));
  } catch (error) {
    console.error('Error getting attendance:', error);
    throw error;
  }
}

export async function getStudentAttendanceHistory(studentId: string): Promise<AttendanceRecord[]> {
  try {
    const result = await pool.query(
      `SELECT id, student_id, teacher_id, date, status, marked_at 
       FROM attendance_records 
       WHERE student_id = $1
       ORDER BY date DESC`,
      [studentId]
    );
    return result.rows.map((row: AttendanceRow) => ({
      id: row.id,
      date: row.date,
      studentId: row.student_id,
      teacherId: row.teacher_id,
      status: row.status,
      markedAt: row.marked_at,
    }));
  } catch (error) {
    console.error('Error getting student attendance history:', error);
    throw error;
  }
}

export async function saveAttendance(
  date: string,
  teacherId: string,
  updates: { studentId: string; status: 'present' | 'absent' }[]
): Promise<void> {
  try {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Delete existing records for these students on this date
      const studentIds = updates.map(u => u.studentId);
      if (studentIds.length > 0) {
        const placeholders = studentIds.map((_, i) => `$${i + 1}`).join(',');
        await client.query(
          `DELETE FROM attendance_records WHERE date = $${studentIds.length + 1} AND student_id IN (${placeholders})`,
          [...studentIds, date]
        );
      }

      // Insert new records
      for (const update of updates) {
        const id = uuidv4();
        const markedAt = new Date().toISOString();
        await client.query(
          `INSERT INTO attendance_records (id, student_id, teacher_id, date, status, marked_at) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, update.studentId, teacherId, date, update.status, markedAt]
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error saving attendance:', error);
    throw error;
  }
}
