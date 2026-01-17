import React, { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { Student } from '../../types';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
interface Props {
  students: Student[];
  onUpdate: () => void;
}
export function StudentManagement({
  students,
  onUpdate
}: Props) {
  const {
    user
  } = useAuth();
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newName.trim()) return;
    setIsSubmitting(true);
    try {
      await mockApi.createStudent(newName, user.id);
      setNewName('');
      onUpdate();
    } catch (error) {
      alert('Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this student? This will also delete their attendance history.')) {
      await mockApi.deleteStudent(id);
      onUpdate();
    }
  };
  return <div className="space-y-6">
      <Card title="Add New Student">
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <Input label="Student Name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. John Doe" required />
          <Button type="submit" disabled={isSubmitting}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Class Roster ({students.length})
        </h3>

        {students.length === 0 ? <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-warm-gray">
            <User className="mx-auto h-12 w-12 text-warm-gray" />
            <p className="mt-2 text-gray-600">No students added yet.</p>
          </div> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {students.map(student => <div key={student.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-warm-gray/20">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blush flex items-center justify-center text-gray-700 font-medium">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-500">
                      ID: {student.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(student.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" aria-label={`Delete ${student.name}`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>)}
          </div>}
      </div>
    </div>;
}