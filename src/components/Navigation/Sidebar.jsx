'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, BarChart3, Flag, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const adminItems = [
    { label: 'Dashboard', href: '/dashboard/admin', icon: Home },
    { label: 'Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { label: 'Moderation', href: '/dashboard/admin/moderation', icon: Flag }
  ];

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-gray-800 border-r border-gray-700 p-6 h-screen sticky top-0"
    >
      <h2 className="text-lg font-bold text-white mb-8">Admin Panel</h2>

      <nav className="space-y-2">
        {adminItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === item.href
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={logout}
        className="w-full flex items-center gap-3 px-4 py-3 mt-8 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </motion.button>
    </motion.aside>
  );
}