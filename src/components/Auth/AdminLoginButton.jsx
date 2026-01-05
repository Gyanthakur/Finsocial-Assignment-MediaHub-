'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function AdminLoginButton() {
  return (
    <Link href="/login?admin=true">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-red-500/50"
      >
        <Shield className="w-4 h-4" />
        Admin Portal
      </motion.button>
    </Link>
  );
}