'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import Loading from '@/components/UI/Loading';

export default function InfiniteScroll({ userId = null }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  const fetchPosts = useCallback(async (pageNum) => {
    setLoading(true);

    try {
      const url = new URL('/api/posts', window.location.origin);
      url.searchParams.set('page', pageNum);
      url.searchParams.set('limit', '10');
      if (userId) url.searchParams.set('authorId', userId);

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      if (pageNum === 1) {
        setPosts(data.data);
      } else {
        setPosts(prev => [...prev, ...data.data]);
      }

      setHasMore(data.pagination.hasNextPage);
      setPage(pageNum);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts(1);
  }, [userId, fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts(page + 1);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [page, hasMore, loading, fetchPosts]);

  return (
    <div className="space-y-6">
      {posts.map((post, idx) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          <PostCard post={post} />
        </motion.div>
      ))}

      {loading && <Loading />}

      {hasMore && (
        <div ref={observerTarget} className="py-8">
          <Loading />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400"
        >
          You've reached the end! 🎉
        </motion.div>
      )}

      {posts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400">No posts found</p>
        </motion.div>
      )}
    </div>
  );
}

