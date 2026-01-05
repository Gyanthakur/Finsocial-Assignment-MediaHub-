'use client';

import { motion } from 'framer-motion';

export default function Error({ error, reset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-400 mb-8">{error?.message || 'An unexpected error occurred'}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => reset()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Try Again
        </motion.button>
      </div>
    </motion.div>
  );
}