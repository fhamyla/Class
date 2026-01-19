import pool from './pool.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const SEED_USERS = [
  {
    email: 'admin@classtrack.com',
    password: 'admin123',
    name: 'Principal Skinner',
    role: 'admin',
  },
  {
    email: 'teacher@classtrack.com',
    password: 'teacher123',
    name: 'Ms. Krabappel',
    role: 'teacher',
  },
  {
    email: 'hoover@classtrack.com',
    password: 'teacher123',
    name: 'Ms. Hoover',
    role: 'teacher',
  },
];

const SEED_STUDENTS = [
  { name: 'Bart Simpson', teacherEmail: 'teacher@classtrack.com' },
  { name: 'Milhouse Van Houten', teacherEmail: 'teacher@classtrack.com' },
  { name: 'Martin Prince', teacherEmail: 'teacher@classtrack.com' },
  { name: 'Lisa Simpson', teacherEmail: 'hoover@classtrack.com' },
  { name: 'Ralph Wiggum', teacherEmail: 'hoover@classtrack.com' },
];

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher')),
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created');

    // Create teachers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Teachers table created');

    // Create students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        teacher_id VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Students table created');

    // Create attendance_records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id VARCHAR(36) PRIMARY KEY,
        student_id VARCHAR(36) NOT NULL,
        teacher_id VARCHAR(36) NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent')),
        marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
        UNIQUE (student_id, date)
      );
    `);
    console.log('✓ Attendance records table created');

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_students_teacher ON students(teacher_id);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);`);
    console.log('✓ Indexes created');

    // Seed users
    for (const user of SEED_USERS) {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [user.email]
      );
      
      if (existingUser.rows.length === 0) {
        const id = uuidv4();
        const passwordHash = await bcrypt.hash(user.password, 10);
        await pool.query(
          'INSERT INTO users (id, email, password_hash, role, name) VALUES ($1, $2, $3, $4, $5)',
          [id, user.email, passwordHash, user.role, user.name]
        );
      }
    }
    console.log('✓ Users seeded');

    // Seed teachers and students
    for (const user of SEED_USERS) {
      if (user.role === 'teacher') {
        const userResult = await pool.query(
          'SELECT id FROM users WHERE email = $1',
          [user.email]
        );
        const userId = userResult.rows[0].id;

        const existingTeacher = await pool.query(
          'SELECT id FROM teachers WHERE user_id = $1',
          [userId]
        );

        if (existingTeacher.rows.length === 0) {
          const teacherId = uuidv4();
          await pool.query(
            'INSERT INTO teachers (id, user_id, name, email) VALUES ($1, $2, $3, $4)',
            [teacherId, userId, user.name, user.email]
          );
        }
      }
    }
    console.log('✓ Teachers seeded');

    // Seed students
    for (const student of SEED_STUDENTS) {
      const teacherResult = await pool.query(
        'SELECT id FROM teachers WHERE email = $1',
        [student.teacherEmail]
      );
      
      if (teacherResult.rows.length > 0) {
        const teacherId = teacherResult.rows[0].id;
        const existingStudent = await pool.query(
          'SELECT id FROM students WHERE name = $1 AND teacher_id = $2',
          [student.name, teacherId]
        );

        if (existingStudent.rows.length === 0) {
          const studentId = uuidv4();
          await pool.query(
            'INSERT INTO students (id, name, teacher_id) VALUES ($1, $2, $3)',
            [studentId, student.name, teacherId]
          );
        }
      }
    }
    console.log('✓ Students seeded');

    console.log('✓ Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export default initializeDatabase;
