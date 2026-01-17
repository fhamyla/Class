import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
export function Login() {
  const {
    login
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password. Try admin@classtrack.com / admin123');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-sage rounded-xl shadow-lg mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Luminara University</h1>
          <p className="text-gray-600 mt-2">Illuminare Mentem, Excelsior Anima —<br /> Illuminate the Mind, Elevate the Soul</p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-sage">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-center text-xl font-semibold text-gray-900">
                Welcome Back
              </h2>
              <p className="text-center text-sm text-gray-500">
                Please sign in to your account
              </p>
            </div>

            {error && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 flex items-center">
                <span className="mr-2">⚠️</span> {error}
              </div>}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                <Input label="Email Address" type="email" placeholder="name@school.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10" required />
              </div>
            </div>

            <Button type="submit" fullWidth disabled={isSubmitting} className="mt-2">
              {isSubmitting ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </> : 'Sign In'}
            </Button>
          </form>
        </Card>
      </div>
    </div>;
}