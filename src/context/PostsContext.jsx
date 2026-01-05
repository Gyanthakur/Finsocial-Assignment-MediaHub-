'use client';

import { createContext, useState, useCallback } from 'react';

export const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/posts?page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data.data);
      setCurrentPage(page);
      setTotalPages(data.pagination.totalPages);

      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback((newPost) => {
    setPosts(prev => [newPost, ...prev]);
  }, []);

  const removePost = useCallback((postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  }, []);

  const updatePost = useCallback((postId, updates) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, ...updates } : post
      )
    );
  }, []);

  const value = {
    posts,
    currentPage,
    totalPages,
    loading,
    fetchPosts,
    addPost,
    removePost,
    updatePost
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

