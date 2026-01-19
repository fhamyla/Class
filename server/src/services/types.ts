export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "teacher";
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  teacherId: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  teacherId: string;
  status: "present" | "absent";
  markedAt: string;
}
