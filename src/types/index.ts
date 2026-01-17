export type Role = 'admin' | 'teacher';
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}
export interface Teacher extends User {
  // Teacher specific fields if any, effectively extends User for now
  // In a real DB, this might link to a separate teachers table
  studentCount?: number; // Computed field for UI
}
export interface Student {
  id: string;
  name: string;
  teacherId: string; // Link to the teacher who manages them
  createdAt: string;
  absences?: number; // Computed field for UI
}
export type AttendanceStatus = 'present' | 'absent';
export interface AttendanceRecord {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  studentId: string;
  teacherId: string;
  status: AttendanceStatus;
  markedAt: string;
}

// For the mock database structure in localStorage
export interface MockDatabase {
  users: User[];
  students: Student[];
  attendance: AttendanceRecord[];
}
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}