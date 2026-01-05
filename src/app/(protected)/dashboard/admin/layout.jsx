'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/src/components/Navigation/Sidebar';
import ProtectedRoute from '@/src/components/Auth/ProtectedRoute';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex gap-0 min-h-screen">
        <Sidebar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </ProtectedRoute>
  );
}
