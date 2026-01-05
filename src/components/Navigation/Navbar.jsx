'use client';

import { useState } from 'react';
// import { useAuth } from '@/hooks/useAuth';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, LogOut, User, Home, Plus } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Create', href: '/create-post', icon: Plus },
    { label: 'Profile', href: '/dashboard/user/profile', icon: User }
  ];

  if (user?.role === 'ADMIN') {
    navItems.push({ label: 'Admin', href: '/dashboard/admin', icon: User });
  }

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-400 hover:text-blue-300 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg" />
            MediaHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <p className="text-white font-semibold">{user.name}</p>
                  <p className="text-gray-400 text-xs">{user.role}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-400 hover:text-blue-300 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-800 rounded transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-gray-800 py-4 space-y-2"
          >
            {user && navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}

            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-gray-800 rounded transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}