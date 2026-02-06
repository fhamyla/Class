import { useEffect, useState } from "react";
import { Calendar, Check, X, Save, Loader2 } from "lucide-react";
import { Student, AttendanceStatus } from "../../types";
import { mockApi } from "../../services/mockApi";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
interface Props {
  students: Student[];
  onSave: () => void;
}
export function AttendanceMarker({ students, onSave }: Props) {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  useEffect(() => {
    const loadAttendance = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const records = await mockApi.getAttendance(date, user.id);
        const statusMap: Record<string, AttendanceStatus> = {};
        records.forEach((r) => {
          statusMap[r.studentId] = r.status;
        });
        setAttendance(statusMap);
      } catch (error) {
        console.error("Failed to load attendance", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAttendance();
  }, [date, user]);
  const toggleStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setSuccessMsg("");
  };
  const markAll = (status: AttendanceStatus) => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
  };
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updates = Object.entries(attendance).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      await mockApi.saveAttendance(date, user.id, updates);
      setSuccessMsg("Attendance saved successfully!");
      onSave();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      alert("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };
  if (students.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No students to mark. Add students first.
      </div>
    );
  }
  return (
    <div className="space-y-6 pb-20">
      <Card className="sticky top-0 z-10 shadow-md border-b-4 border-sage">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-sage" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block rounded-md border-warm-gray shadow-sm focus:border-sage focus:ring focus:ring-sage focus:ring-opacity-50 bg-white py-2 px-3"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAll("present")}
            >
              All Present
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAll("absent")}
            >
              All Absent
            </Button>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="space-y-3">
          {students.map((student) => {
            const status = attendance[student.id];
            return (
              <div
                key={student.id}
                className={`
                  flex items-center justify-between p-4 rounded-xl border transition-all duration-200
                  ${status === "present" ? "bg-green-50 border-green-200" : ""}
                  ${status === "absent" ? "bg-red-50 border-red-200" : ""}
                  ${!status ? "bg-white border-warm-gray/30" : ""}
                `}
              >
                <div className="font-medium text-gray-900">{student.name}</div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleStatus(student.id, "present")}
                    className={`
                      flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all
                      ${status === "present" ? "bg-sage border-sage text-white scale-110 shadow-md" : "bg-white border-gray-200 text-gray-300 hover:border-sage hover:text-sage"}
                    `}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => toggleStatus(student.id, "absent")}
                    className={`
                      flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all
                      ${status === "absent" ? "bg-red-500 border-red-500 text-white scale-110 shadow-md" : "bg-white border-gray-200 text-gray-300 hover:border-red-500 hover:text-red-500"}
                    `}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="fixed bottom-6 left-0 right-0 px-4 flex flex-col items-center pointer-events-none gap-2">
        {successMsg && (
          <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-in slide-in-from-bottom-5 fade-in">
            {successMsg}
          </div>
        )}
        <div className="pointer-events-auto shadow-xl rounded-full">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[200px] rounded-full shadow-lg"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            {isSaving ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      </div>
    </div>
  );
}
