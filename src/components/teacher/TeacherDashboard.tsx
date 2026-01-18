import { useCallback, useEffect, useState } from 'react';
import { Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { Student, AttendanceRecord } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { StudentManagement } from './StudentManagement';
import { AttendanceMarker } from './AttendanceMarker';
type Tab = 'overview' | 'students' | 'attendance';
export function TeacherDashboard() {
  const {
    user
  } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loadData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const studentData = await mockApi.getStudentsByTeacher(user.id);
      setStudents(studentData);
      const today = new Date().toISOString().split('T')[0];
      const attendanceData = await mockApi.getAttendance(today, user.id);
      setTodayAttendance(attendanceData);
    } catch (error) {
      console.error('Failed to load teacher data', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  useEffect(() => {
    loadData();
  }, [user, loadData]);
  if (isLoading) return <div className="p-8 text-center">Loading class data...</div>;
  const presentCount = todayAttendance.filter(r => r.status === 'present').length;
  const absentCount = todayAttendance.filter(r => r.status === 'absent').length;
  return <div className="space-y-6 animate-in fade-in duration-500">
      {/* Dashboard Navigation */}
      <div className="flex flex-wrap gap-1 bg-white p-1 rounded-lg border border-warm-gray/20 shadow-sm">
        <button onClick={() => setActiveTab('overview')} className={`flex-1 py-2 px-4 text-xs sm:text-sm font-medium rounded-md transition-colors text-center ${activeTab === 'overview' ? 'bg-sage text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
          Overview
        </button>
        <button onClick={() => setActiveTab('attendance')} className={`flex-1 py-2 px-4 text-xs sm:text-sm font-medium rounded-md transition-colors text-center ${activeTab === 'attendance' ? 'bg-sage text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
          Mark Attendance
        </button>
        <button onClick={() => setActiveTab('students')} className={`flex-1 py-2 px-4 text-xs sm:text-sm font-medium rounded-md transition-colors text-center ${activeTab === 'students' ? 'bg-sage text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
          Manage Students
        </button>
      </div>

      {activeTab === 'overview' && <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-sage to-sage/90 text-white border-none">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sage-100 text-sm font-medium">
                    Total Students
                  </p>
                  <p className="text-3xl font-bold mt-1">{students.length}</p>
                </div>
                <Users className="h-8 w-8 text-sage-100 opacity-50" />
              </div>
            </Card>

            <Card className="bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Present Today
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {presentCount}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-100" />
              </div>
            </Card>

            <Card className="bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Absent Today
                  </p>
                  <p className="text-3xl font-bold text-red-500 mt-1">
                    {absentCount}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-100" />
              </div>
            </Card>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-warm-gray/20">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => setActiveTab('attendance')} className="h-auto py-4 justify-start">
                <div className="bg-sage/10 p-2 rounded-full mr-3">
                  <Calendar className="h-5 w-5 text-sage" />
                </div>
                <div className="text-left">
                  <span className="block font-semibold text-gray-900">
                    Mark Attendance
                  </span>
                  <span className="block text-xs text-gray-500 font-normal">
                    Record today's class presence
                  </span>
                </div>
              </Button>
              <Button variant="outline" onClick={() => setActiveTab('students')} className="h-auto py-4 justify-start">
                <div className="bg-moss/10 p-2 rounded-full mr-3">
                  <Users className="h-5 w-5 text-moss" />
                </div>
                <div className="text-left">
                  <span className="block font-semibold text-gray-900">
                    Add Student
                  </span>
                  <span className="block text-xs text-gray-500 font-normal">
                    Update your class roster
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </div>}

      {activeTab === 'students' && <StudentManagement students={students} onUpdate={loadData} />}

      {activeTab === 'attendance' && <AttendanceMarker students={students} onSave={loadData} />}
    </div>;
}