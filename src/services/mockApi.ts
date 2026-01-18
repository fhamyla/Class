import { User, Student, AttendanceRecord, AttendanceStatus } from '../types';

// Keys for localStorage
const STORAGE_KEYS = {
  USERS: 'ams-users',
  STUDENTS: 'ams-students',
  ATTENDANCE: 'ams-attendance',
  CURRENT_USER: 'ams-current-user'
};

// Seed Data
const SEED_USERS: User[] = [{
  id: 'admin-1',
  email: 'admin@classtrack.com',
  name: 'Principal Skinner',
  role: 'admin',
  createdAt: new Date().toISOString()
}, {
  id: 'teacher-1',
  email: 'teacher@classtrack.com',
  name: 'Ms. Krabappel',
  role: 'teacher',
  createdAt: new Date().toISOString()
}, {
  id: 'teacher-2',
  email: 'hoover@classtrack.com',
  name: 'Ms. Hoover',
  role: 'teacher',
  createdAt: new Date().toISOString()
}];
const SEED_STUDENTS: Student[] = [{
  id: 's1',
  name: 'Bart Simpson',
  teacherId: 'teacher-1',
  createdAt: new Date().toISOString()
}, {
  id: 's2',
  name: 'Milhouse Van Houten',
  teacherId: 'teacher-1',
  createdAt: new Date().toISOString()
}, {
  id: 's3',
  name: 'Martin Prince',
  teacherId: 'teacher-1',
  createdAt: new Date().toISOString()
}, {
  id: 's4',
  name: 'Lisa Simpson',
  teacherId: 'teacher-2',
  createdAt: new Date().toISOString()
}, {
  id: 's5',
  name: 'Ralph Wiggum',
  teacherId: 'teacher-2',
  createdAt: new Date().toISOString()
}];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize Storage if empty
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(SEED_STUDENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([]));
  }
};

// --- API Methods ---

export const mockApi = {
  // Auth
  login: async (email: string): Promise<User> => {
    await delay(500);
    initializeStorage();

    // Mock password check (accept any password for demo if email matches)
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.email === email);
    if (!user) throw new Error('Invalid credentials');

    // In a real app, we'd verify password hash here
    // For demo: password must be 'admin123' or 'teacher123' etc.
    // But to keep it simple for the user, we'll just accept the user if found.

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },
  logout: async () => {
    await delay(200);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
  getCurrentUser: async (): Promise<User | null> => {
    await delay(100);
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },
  // Admin: Teachers
  getTeachers: async (): Promise<User[]> => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    return users.filter((u: User) => u.role === 'teacher');
  },
  createTeacher: async (name: string, email: string): Promise<User> => {
    await delay(400);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.some((u: User) => u.email === email)) {
      throw new Error('Email already exists');
    }
    const newTeacher: User = {
      id: `teacher-${Date.now()}`,
      name,
      email,
      role: 'teacher',
      createdAt: new Date().toISOString()
    };
    users.push(newTeacher);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newTeacher;
  },
  deleteTeacher: async (id: string) => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const filtered = users.filter((u: User) => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));

    // Also cleanup students assigned to this teacher?
    // For simplicity, we'll leave them orphaned or reassign logic would go here.
  },
  // Teacher: Students
  getStudentsByTeacher: async (teacherId: string): Promise<Student[]> => {
    await delay(300);
    const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    return students.filter((s: Student) => s.teacherId === teacherId);
  },
  getAllStudents: async (): Promise<Student[]> => {
    await delay(300);
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
  },
  createStudent: async (name: string, teacherId: string): Promise<Student> => {
    await delay(300);
    const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name,
      teacherId,
      createdAt: new Date().toISOString()
    };
    students.push(newStudent);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    return newStudent;
  },
  deleteStudent: async (id: string) => {
    await delay(300);
    const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    const filtered = students.filter((s: Student) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
  },
  // Attendance
  getAttendance: async (date: string, teacherId: string): Promise<AttendanceRecord[]> => {
    await delay(300);
    const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
    return records.filter((r: AttendanceRecord) => r.date === date && r.teacherId === teacherId);
  },
  getStudentAttendanceHistory: async (studentId: string): Promise<AttendanceRecord[]> => {
    await delay(300);
    const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
    return records.filter((r: AttendanceRecord) => r.studentId === studentId);
  },
  saveAttendance: async (date: string, teacherId: string, updates: {
    studentId: string;
    status: AttendanceStatus;
  }[]) => {
    await delay(400);
    const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');

    // Remove existing records for this date/teacher/students to avoid duplicates (upsert logic)
    const studentIds = updates.map(u => u.studentId);
    const filteredRecords = records.filter((r: AttendanceRecord) => !(r.date === date && studentIds.includes(r.studentId)));
    const newRecords = updates.map(u => ({
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date,
      teacherId,
      studentId: u.studentId,
      status: u.status,
      markedAt: new Date().toISOString()
    }));
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify([...filteredRecords, ...newRecords]));
  },
  // Stats
  getAdminStats: async () => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
    const teachers = users.filter((u: User) => u.role === 'teacher');
    const teacherStats = teachers.map((t: User) => ({
      ...t,
      studentCount: students.filter((s: Student) => s.teacherId === t.id).length
    }));
    return {
      totalTeachers: teachers.length,
      totalStudents: students.length,
      teacherStats
    };
  }
};