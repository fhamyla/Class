import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Search } from 'lucide-react';
import { Student, AttendanceStatus } from '../types';
import { Card } from './ui/Card';
interface AttendanceHistoryProps {
  students: Student[];
  history: Record<string, Record<string, AttendanceStatus>>;
}
export function AttendanceHistory({
  students,
  history
}: AttendanceHistoryProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const currentRecords = history[selectedDate] || {};
  const presentCount = Object.values(currentRecords).filter(s => s === 'present').length;
  const absentCount = Object.values(currentRecords).filter(s => s === 'absent').length;
  const totalMarked = presentCount + absentCount;
  const attendanceRate = totalMarked > 0 ? Math.round(presentCount / totalMarked * 100) : 0;
  return <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <div className="flex flex-col space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Date to View
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-warm-gray rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage sm:text-sm" />
          </div>
        </div>
      </Card>

      {totalMarked > 0 ? <>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-warm-gray/20 text-center">
              <p className="text-sm text-gray-500">Present</p>
              <p className="text-2xl font-bold text-sage">{presentCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-warm-gray/20 text-center">
              <p className="text-sm text-gray-500">Absent</p>
              <p className="text-2xl font-bold text-red-500">{absentCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-warm-gray/20 text-center">
              <p className="text-sm text-gray-500">Rate</p>
              <p className="text-2xl font-bold text-moss">{attendanceRate}%</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-warm-gray/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-warm-gray/20 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Attendance Log
              </h3>
            </div>
            <ul className="divide-y divide-warm-gray/20">
              {students.map(student => {
            const status = currentRecords[student.id];
            if (!status) return null; // Only show marked students? Or show all with status? Let's show all.
            return <li key={student.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-sm text-gray-500">ID: {student.id}</p>
                    </div>
                    <div className="flex items-center">
                      {status === 'present' ? <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1.5 h-4 w-4" />
                          Present
                        </span> : status === 'absent' ? <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          <XCircle className="mr-1.5 h-4 w-4" />
                          Absent
                        </span> : <span className="text-gray-400 text-sm italic">
                          Not Marked
                        </span>}
                    </div>
                  </li>;
          })}
            </ul>
          </div>
        </> : <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-warm-gray">
          <Search className="mx-auto h-12 w-12 text-warm-gray" />
          <p className="mt-2 text-gray-600">
            No attendance records found for this date.
          </p>
        </div>}
    </div>;
}