'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Eye, Flag } from 'lucide-react';
import { formatTimeAgo } from '@/src/lib/utils';

export default function ModerationPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts?limit=50', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const data = await response.json();
      setPosts(data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      if (response.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Post Moderation</h1>
        <p className="text-gray-400">Review and manage user posts</p>
      </motion.div>

      {loading ? (
        <p className="text-gray-400">Loading posts...</p>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-400">No posts to moderate</p>
          ) : (
            posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-gray-600 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {post.author?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{post.title}</h3>
                      <p className="text-gray-400 text-sm">
                        by {post.author?.name} • {formatTimeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {post.views || 0} views
                    </span>
                    <span>{post._count?.likes || 0} likes</span>
                    <span>{post._count?.comments || 0} comments</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeletePost(post.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded transition"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

