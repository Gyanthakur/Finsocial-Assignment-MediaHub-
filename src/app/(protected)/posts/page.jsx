'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/src/hooks/useAuth';
import PostFeed from '@/src/components/Posts/PostFeed';
import ProtectedRoute from '@/src/components/Auth/ProtectedRoute';
import { Loader } from 'lucide-react';

export default function PostsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Community Feed</h1>
          <p className="text-gray-400">Discover amazing content from creators</p>
        </motion.div>

        <PostFeed />
      </div>
    </ProtectedRoute>
  );
}
