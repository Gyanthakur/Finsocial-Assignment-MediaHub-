'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Lock, AlertCircle, Loader, Check } from 'lucide-react';

export default function SignupForm() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser, setToken } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Signup failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      setToken(data.accessToken);
      setUser(data.user);

      router.push('/dashboard/user');
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 5 ? 'medium' : 'weak';

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {errors.submit && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{errors.submit}</p>
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 bg-gray-700/50 border rounded-lg focus:outline-none transition ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="John Doe"
            required
            disabled={loading}
          />
        </div>
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 bg-gray-700/50 border rounded-lg focus:outline-none transition ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full pl-10 pr-12 py-2 bg-gray-700/50 border rounded-lg focus:outline-none transition ${
              errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="••••••••"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
            disabled={loading}
          >
            {showPassword ? '✕' : '○'}
          </button>
        </div>
        {formData.password && (
          <div className="mt-2">
            <div className="flex gap-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div className={`flex-1 ${passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
              {passwordStrength !== 'weak' && <div className={`flex-1 ${passwordStrength === 'medium' ? 'bg-gray-600' : 'bg-green-500'}`} />}
              {passwordStrength === 'strong' && <div className="flex-1 bg-green-500" />}
            </div>
            <p className="text-xs text-gray-400 mt-1">{passwordStrength} password</p>
          </div>
        )}
        {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 bg-gray-700/50 border rounded-lg focus:outline-none transition ${
              errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }`}
            placeholder="••••••••"
            required
            disabled={loading}
          />
          {formData.password === formData.confirmPassword && formData.confirmPassword && (
            <Check className="absolute right-3 top-3 w-5 h-5 text-green-500" />
          )}
        </div>
        {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </motion.button>
    </motion.form>
  );
}
