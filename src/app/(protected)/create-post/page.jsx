'use client';

import { motion } from 'framer-motion';
import CreatePostForm from '@/src/components/Posts/CreatePostForm';

export default function CreatePostPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <CreatePostForm />
    </motion.div>
  );
}
