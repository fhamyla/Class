import React, { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { Student } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
interface StudentListProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}
export function StudentList({
  students,
  onAddStudent,
  onDeleteStudent
}: StudentListProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !id.trim()) {
      setError('Both Name and ID are required');
      return;
    }
    if (students.some(s => s.id === id)) {
      setError('Student ID already exists');
      return;
    }
    onAddStudent({
      id: id.trim(),
      name: name.trim(),
      teacherId: '',
      createdAt: new Date().toISOString()
    });
    setName('');
    setId('');
  };
  return <div className="space-y-6 max-w-2xl mx-auto">
      <Card title="Add New Student" description="Enter student details below to add them to the roster.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Student Name" placeholder="e.g. Jane Doe" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Student ID" placeholder="e.g. 2024001" value={id} onChange={e => setId(e.target.value)} />
          {error && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100" role="alert">
              {error}
            </div>}
          <Button type="submit" fullWidth>
            <Plus className="mr-2 h-5 w-5" />
            Add Student
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 px-1">
          Class Roster ({students.length})
        </h3>

        {students.length === 0 ? <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-warm-gray">
            <User className="mx-auto h-12 w-12 text-warm-gray" />
            <p className="mt-2 text-gray-600">No students added yet.</p>
          </div> : <ul className="space-y-3" role="list">
            {students.map(student => <li key={student.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-warm-gray/20">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-blush flex items-center justify-center text-gray-700 font-medium">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">ID: {student.id}</p>
                  </div>
                </div>
                <button onClick={() => onDeleteStudent(student.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500" aria-label={`Delete ${student.name}`}>
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>)}
          </ul>}
      </div>
    </div>;
}