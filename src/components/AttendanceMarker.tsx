import { useEffect, useState } from "react";
import { Calendar, Check, X, Save } from "lucide-react";
import { Student, AttendanceStatus } from "../types";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
interface AttendanceMarkerProps {
  students: Student[];
  onSaveAttendance: (
    date: string,
    records: Record<string, AttendanceStatus>,
  ) => void;
  history?: Record<string, Record<string, AttendanceStatus>>;
}
export function AttendanceMarker({
  students,
  onSaveAttendance,
  history = {},
}: AttendanceMarkerProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (history[date]) {
      setAttendance(history[date]);
    } else {
      setAttendance({});
    }
    setIsSaved(false);
  }, [date, history]);
  const toggleStatus = (studentId: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    setIsSaved(false);
  };
  const markAll = (status: AttendanceStatus) => {
    const newAttendance: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
    setIsSaved(false);
  };
  const handleSave = () => {
    onSaveAttendance(date, attendance);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };
  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          Please add students before marking attendance.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      <Card className="sticky top-0 z-10 shadow-md border-b-4 border-sage">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-sage" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block rounded-md border-warm-gray shadow-sm focus:border-sage focus:ring focus:ring-sage focus:ring-opacity-50 bg-white py-2 px-3"
              aria-label="Select date for attendance"
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
              <div>
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-gray-500">ID: {student.id}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleStatus(student.id, "present")}
                  className={`
                    flex items-center justify-center h-12 w-12 rounded-full border-2 transition-all
                    ${status === "present" ? "bg-sage border-sage text-white scale-110 shadow-md" : "bg-white border-gray-200 text-gray-300 hover:border-sage hover:text-sage"}
                  `}
                  aria-label={`Mark ${student.name} present`}
                  aria-pressed={status === "present"}
                >
                  <Check className="h-6 w-6" />
                </button>

                <button
                  onClick={() => toggleStatus(student.id, "absent")}
                  className={`
                    flex items-center justify-center h-12 w-12 rounded-full border-2 transition-all
                    ${status === "absent" ? "bg-red-500 border-red-500 text-white scale-110 shadow-md" : "bg-white border-gray-200 text-gray-300 hover:border-red-500 hover:text-red-500"}
                  `}
                  aria-label={`Mark ${student.name} absent`}
                  aria-pressed={status === "absent"}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto shadow-xl rounded-full">
          <Button
            size="lg"
            onClick={handleSave}
            className={`min-w-[200px] rounded-full shadow-lg transition-all duration-300 ${isSaved ? "bg-green-600" : ""}`}
          >
            {isSaved ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                Saved Successfully
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Attendance
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
