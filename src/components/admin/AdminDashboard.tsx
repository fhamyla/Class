import React, { useEffect, useState } from "react";
import { Users, GraduationCap, Plus, Trash2 } from "lucide-react";
import { mockApi } from "../../services/mockApi";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
interface AdminStats {
  totalTeachers: number;
  totalStudents: number;
  teacherStats: Array<{
    id: string;
    name: string;
    email: string;
    studentCount: number;
  }>;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [suffix, setSuffix] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load admin stats", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !suffix.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim()
    ) {
      setEmailError(
        "All required fields must be filled (Suffix, First Name, Last Name, Email)",
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      setEmailError("");
      const fullName = [suffix, firstName, middleName, lastName]
        .filter(Boolean)
        .join(" ")
        .trim();
      await mockApi.createTeacher(fullName, email);
      setIsAdding(false);
      setSuffix("");
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setEmail("");
      loadData();
    } catch (error) {
      setEmailError("This email is already in use.");
    }
  };
  const handleDeleteTeacher = async (id: string) => {
    if (window.confirm("Are you sure? This will remove the teacher access.")) {
      await mockApi.deleteTeacher(id);
      loadData();
    }
  };
  if (isLoading)
    return <div className="p-8 text-center">Loading dashboard...</div>;
  if (!stats)
    return <div className="p-8 text-center">Unable to load dashboard data</div>;
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-warm-gray/20 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Teachers</p>
            <p className="text-3xl font-bold text-sage">
              {stats.totalTeachers}
            </p>
          </div>
          <div className="p-3 bg-sage/10 rounded-full">
            <Users className="h-6 w-6 text-sage" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-warm-gray/20 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-3xl font-bold text-moss">
              {stats.totalStudents}
            </p>
          </div>
          <div className="p-3 bg-moss/10 rounded-full">
            <GraduationCap className="h-6 w-6 text-moss" />
          </div>
        </div>
      </div>

      {/* Teacher Management */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Teacher Management
          </h2>
          <Button
            onClick={() => setIsAdding(!isAdding)}
            size="sm"
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>

        {isAdding && (
          <Card className="bg-sage/5 border-sage/20">
            <form onSubmit={handleAddTeacher} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suffix *
                  </label>
                  <select
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage"
                  >
                    <option value="">Select suffix</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                </div>

                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />

                <Input
                  label="Middle Name (Optional)"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Optional"
                />

                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={emailError ? "border-red-500" : ""}
                  placeholder="teacher@school.com"
                />
              </div>

              {emailError && (
                <p className="text-sm text-red-600">
                  This email is already in use.
                </p>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-warm-gray/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Students
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.teacherStats.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {teacher.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {teacher.studentCount} students
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                        aria-label={`Delete ${teacher.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
