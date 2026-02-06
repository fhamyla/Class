export type Role = 'admin' | 'teacher';
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}
export interface Teacher extends User {
  studentCount?: number;
}
export interface Student {
  id: string;
  name: string;
  teacherId: string;
  createdAt: string;
  absences?: number;
}
export type AttendanceStatus = 'present' | 'absent';
export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  teacherId: string;
  status: AttendanceStatus;
  markedAt: string;
}

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