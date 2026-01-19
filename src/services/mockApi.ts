import { User, Student, AttendanceRecord, AttendanceStatus } from "../types";

declare global {
  interface ImportMeta {
    env: Record<string, string | undefined>;
  }
}

// API Base URL  
const API_BASE_URL: string = (import.meta.env.VITE_API_URL) || "http://localhost:5000/api";

// Helper to handle API errors
const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    throw error;
  }
  const apiError = error as Record<string, unknown>;
  if (apiError.response && typeof apiError.response === 'object') {
    const res = apiError.response as Record<string, unknown>;
    if (res.data && typeof res.data === 'object') {
      const data = res.data as Record<string, unknown>;
      if (data.error) {
        throw new Error(String(data.error));
      }
    }
  }
  throw new Error(String(error));
};

// --- API Methods ---

export const mockApi = {
  // Auth
  login: async (email: string, password: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const user: User = await response.json();
      localStorage.setItem("ams-current-user", JSON.stringify(user));
      return user;
    } catch (error) {
      return handleApiError(error);
    }
  },
  logout: async () => {
    localStorage.removeItem("ams-current-user");
  },
  getCurrentUser: async (): Promise<User | null> => {
    const stored = localStorage.getItem("ams-current-user");
    return stored ? JSON.parse(stored) : null;
  },
  // Admin: Teachers
  getTeachers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/teachers`);
      if (!response.ok) throw new Error("Failed to fetch teachers");
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  createTeacher: async (name: string, email: string, password = "teacher123"): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error: { error?: string } = await response.json();
        throw new Error(error.error || "Failed to create teacher");
      }

      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  deleteTeacher: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/teachers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete teacher");
    } catch (error) {
      return handleApiError(error);
    }
  },
  // Teacher: Students
  getStudentsByTeacher: async (teacherId: string): Promise<Student[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/students?teacherId=${teacherId}`);
      if (!response.ok) throw new Error("Failed to fetch students");
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  getAllStudents: async (): Promise<Student[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`);
      if (!response.ok) throw new Error("Failed to fetch students");
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  createStudent: async (name: string, teacherId: string): Promise<Student> => {
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, teacherId }),
      });

      if (!response.ok) throw new Error("Failed to create student");
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  deleteStudent: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete student");
    } catch (error) {
      return handleApiError(error);
    }
  },
  // Attendance
  getAttendance: async (
    date: string,
    teacherId: string,
  ): Promise<AttendanceRecord[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance?date=${date}&teacherId=${teacherId}`);
      if (!response.ok) throw new Error("Failed to fetch attendance");
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  getStudentAttendanceHistory: async (
    studentId: string,
  ): Promise<AttendanceRecord[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance?studentId=${studentId}`);
      if (!response.ok) throw new Error("Failed to fetch attendance history");
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  saveAttendance: async (
    date: string,
    teacherId: string,
    updates: {
      studentId: string;
      status: AttendanceStatus;
    }[],
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, teacherId, updates }),
      });

      if (!response.ok) throw new Error("Failed to save attendance");
      await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  // Stats
  getAdminStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`);
      if (!response.ok) throw new Error("Failed to fetch admin stats");
      return await response.json();
    } catch (error) {
      handleApiError(error);
    }
  },
};
