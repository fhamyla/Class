import pool from '../db/pool.js';

interface TeacherStatsRow {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  student_count: string;
}

export async function getAdminStats() {
  try {
    const teachersResult = await pool.query(
      `SELECT COUNT(*) as count FROM users WHERE role = 'teacher'`
    );
    const totalTeachers = parseInt(teachersResult.rows[0].count);

    const studentsResult = await pool.query(
      `SELECT COUNT(*) as count FROM students`
    );
    const totalStudents = parseInt(studentsResult.rows[0].count);

    const teacherStatsResult = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.name,
        u.role,
        u.created_at,
        COUNT(s.id) as student_count
       FROM users u
       LEFT JOIN teachers t ON u.id = t.user_id
       LEFT JOIN students s ON t.id = s.teacher_id
       WHERE u.role = 'teacher'
       GROUP BY u.id, u.email, u.name, u.role, u.created_at
       ORDER BY u.name`
    );

    const teacherStats = teacherStatsResult.rows.map((row: TeacherStatsRow) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      createdAt: row.created_at,
      studentCount: parseInt(row.student_count),
    }));

    return {
      totalTeachers,
      totalStudents,
      teacherStats,
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw error;
  }
}
