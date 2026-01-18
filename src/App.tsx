import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { Loader2 } from 'lucide-react';
// Simple Router Component since we don't have react-router-dom installed in the base template usually
// In a real app, use react-router-dom
function AppContent() {
  const {
    user,
    isLoading
  } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="h-8 w-8 animate-spin text-sage" />
      </div>;
  }
  if (!user) {
    return <Login />;
  }
  return <div className="min-h-screen bg-cream font-sans text-gray-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {user.role === 'admin' ? <AdminDashboard /> : <TeacherDashboard />}
      </main>
    </div>;
}
export function App() {
  return <AuthProvider>
      <AppContent />
    </AuthProvider>;
}