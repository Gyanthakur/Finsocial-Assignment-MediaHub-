'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function PostGrid({ posts = [] }) {
  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post, idx) => (
        <motion.div
          key={post.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          className="group relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700 hover:border-blue-500 transition cursor-pointer"
        >
          <Link href={`/posts/${post.id}`}>
            <div className="relative w-full h-48 bg-gray-900">
              {post.type === 'IMAGE' ? (
                <Image
                  src={post.mediaUrl}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-300"
                />
              ) : (
                <video
                  src={post.mediaUrl}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition" />
            </div>

            <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-semibold truncate">{post.title}</h3>
              <p className="text-gray-300 text-sm">{post.author?.name}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}