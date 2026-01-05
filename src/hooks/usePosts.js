'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';

export const usePosts = (initialPage = 1, limit = 20) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const { token } = useAuth();

  const fetchPosts = useCallback(async (pageNum = 1, replace = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/posts?page=${pageNum}&limit=${limit}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      
      setPosts(prev => replace ? data.data : [...prev, ...data.data]);
      setTotalCount(data.pagination.totalCount);
      setHasMore(data.pagination.hasNextPage);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, token]);

  useEffect(() => {
    fetchPosts(page);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchPosts(page + 1);
    }
  }, [page, hasMore, loading, fetchPosts]);

  const refresh = useCallback(() => {
    setPosts([]);
    setPage(1);
    fetchPosts(1, true);
  }, [fetchPosts]);

  const addPost = useCallback((newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setTotalCount(prev => prev + 1);
  }, []);

  const removePost = useCallback((postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setTotalCount(prev => Math.max(0, prev - 1));
  }, []);

  const updatePost = useCallback((postId, updates) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  }, []);

  return {
    posts,
    page,
    loading,
    error,
    hasMore,
    totalCount,
    fetchPosts,
    loadMore,
    refresh,
    addPost,
    removePost,
    updatePost
  };
};
