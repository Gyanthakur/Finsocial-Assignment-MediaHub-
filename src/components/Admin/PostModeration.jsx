'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Flag, Eye } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

export default function PostModeration() {
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
    if (!confirm('Are you sure?')) return;

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Post Moderation</h2>

      {loading ? (
        <p className="text-gray-400">Loading posts...</p>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-gray-400">No posts to moderate</p>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg hover:border-gray-500 transition"
              >
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{post.title}</h3>
                  <p className="text-gray-400 text-sm">
                    by {post.author.name} • {formatTimeAgo(post.createdAt)}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {post.views} views
                    </span>
                    <span>{post._count?.likes || 0} likes</span>
                    <span>{post._count?.comments || 0} comments</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}

