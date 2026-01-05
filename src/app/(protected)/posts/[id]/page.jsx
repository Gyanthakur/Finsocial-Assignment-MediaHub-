'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/src/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import { Heart, MessageCircle, Trash2, ArrowLeft, Eye, Loader } from 'lucide-react';
import { formatTimeAgo } from '@/src/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import ProtectedRoute from '@/src/components/Auth/ProtectedRoute';

export default function PostDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [error, setError] = useState(null);

  const postId = params.id;

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      const data = await response.json();
      setPost(data);
      setLikeCount(data._count?.likes || 0);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(!liked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        router.push('/posts');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Loader className="w-12 h-12 text-blue-500" />
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !post) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/posts">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Feed
            </motion.button>
          </Link>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              {error || 'Post not found'}
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isAuthor = user?.userId === post.authorId;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/posts">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </motion.button>
        </Link>

        {/* Post Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {post.author?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{post.author?.name}</h2>
                <p className="text-sm text-gray-400">{formatTimeAgo(post.createdAt)}</p>
              </div>
            </div>

            {isAuthor && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDelete}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
            {post.description && (
              <p className="text-gray-300 text-lg mb-6 whitespace-pre-wrap">
                {post.description}
              </p>
            )}
          </div>

          {/* Media */}
          {post.mediaUrl && (
            <div className="relative w-full overflow-hidden bg-gray-900">
              {post.type === 'IMAGE' ? (
                <div className="relative w-full h-96 sm:h-[500px]">
                  <Image
                    src={post.mediaUrl}
                    alt={post.title}
                    fill
                    className="object-cover w-full h-full"
                    priority={false}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                    onError={(e) => {
                      console.error('Image failed to load:', post.mediaUrl);
                    }}
                  />
                </div>
              ) : post.type === 'VIDEO' ? (
                <video
                  src={post.mediaUrl}
                  className="w-full h-96 sm:h-[500px] object-cover"
                  controls
                  controlsList="nodownload"
                  poster={post.thumbnail}
                />
              ) : null}
            </div>
          )}

          {/* Stats */}
          <div className="px-6 py-4 border-t border-gray-700">
            <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" /> {post.views || 0} views
              </span>
              <span>{likeCount} likes</span>
              <span>{post._count?.comments || 0} comments</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition font-semibold ${
                  liked
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-700/30 text-gray-400 hover:bg-gray-700/50'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                Like
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 rounded-lg transition font-semibold"
              >
                <MessageCircle className="w-5 h-5" />
                Comment
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Author Info */}
        {post.author?.bio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-3">About the Author</h3>
            <p className="text-gray-300">{post.author.bio}</p>
            
            <Link href={`/dashboard/user/profile/${post.authorId}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition"
              >
                View Profile
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  );
}