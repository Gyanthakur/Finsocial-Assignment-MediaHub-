'use client';

import { useState, useEffect } from 'react';
import PostCard from './PostCard';

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/posts?page=${page}&limit=20`)
      .then(res => res.json())
      .then(data =>
        setPosts(prev =>
          page === 1 ? data.data : [...prev, ...data.data]
        )
      )
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm">Be the first one to share 🚀</p>
        </div>
      )}

      {/* Posts */}
      {posts.map(post => (
        <PostCard
          key={post.id || post._id}
          post={post}
          className="transition hover:shadow-lg"
        />
      ))}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-800/50 rounded-xl h-40"
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {posts.length > 0 && (
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={loading}
          className="
            w-full py-3 rounded-xl font-medium text-white
            bg-gradient-to-r from-blue-500 to-indigo-600
            hover:opacity-90 transition
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}

// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import PostCard from './PostCard';
// import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll';
// import Loading from '@/src/components/UI/Loading';

// export default function PostFeed({ userId = null }) {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchPosts = useCallback(async (pageNum) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const url = new URL('/api/posts', window.location.origin);
//       url.searchParams.set('page', pageNum);
//       url.searchParams.set('limit', '10');
//       if (userId) url.searchParams.set('authorId', userId);

//       const response = await fetch(url.toString(), {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         }
//       });

//       if (!response.ok) throw new Error('Failed to fetch posts');

//       const data = await response.json();
      
//       if (pageNum === 1) {
//         setPosts(data.data);
//       } else {
//         setPosts(prev => [...prev, ...data.data]);
//       }

//       setHasMore(data.pagination.hasNextPage);
//       setPage(pageNum);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching posts:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchPosts(1);
//   }, [userId, fetchPosts]);

//   const handleLoadMore = useCallback(() => {
//     if (hasMore && !loading) {
//       fetchPosts(page + 1);
//     }
//   }, [page, hasMore, loading, fetchPosts]);

//   const observerTarget = useInfiniteScroll(handleLoadMore, {
//     threshold: 0.1,
//     rootMargin: '100px'
//   });

//   const handlePostDelete = (postId) => {
//     setPosts(prev => prev.filter(post => post.id !== postId));
//   };

//   return (
//     <div className="space-y-6">
//       {error && (
//         <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">
//           {error}
//         </div>
//       )}

//       {posts.length === 0 && !loading && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center py-12"
//         >
//           <p className="text-gray-400 text-lg">No posts yet. Be the first to share!</p>
//         </motion.div>
//       )}

//       <motion.div
//         layout
//         className="space-y-6"
//       >
//         {posts.map((post) => (
//           <PostCard
//             key={post.id}
//             post={post}
//             onDelete={handlePostDelete}
//           />
//         ))}
//       </motion.div>

//       {loading && <Loading />}

//       {hasMore && (
//         <div ref={observerTarget} className="py-8">
//           <Loading />
//         </div>
//       )}

//       {!hasMore && posts.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center py-8 text-gray-400"
//         >
//           You've reached the end
//         </motion.div>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import PostCard from './PostCard';
// import { useInfiniteScroll } from '@/src/hooks/useInfiniteScroll';
// import Loading from '@/src/components/UI/Loading';

// export default function PostFeed({ userId = null }) {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchPosts = useCallback(async (pageNum) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem('accessToken');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const url = new URL('/api/posts', window.location.origin);
//       url.searchParams.set('page', pageNum);
//       url.searchParams.set('limit', '10');
//       if (userId) url.searchParams.set('authorId', userId);

//       console.log('Fetching posts from:', url.toString()); // Debug

//       const response = await fetch(url.toString(), {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch posts');
//       }

//       const data = await response.json();
//       console.log('Posts received:', data); // Debug

//       if (pageNum === 1) {
//         setPosts(data.data || []);
//       } else {
//         setPosts(prev => [...prev, ...(data.data || [])]);
//       }

//       setHasMore(data.pagination?.hasNextPage || false);
//       setPage(pageNum);
//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching posts:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [userId]);

//   useEffect(() => {
//     fetchPosts(1);
//   }, [userId, fetchPosts]);

//   const handleLoadMore = useCallback(() => {
//     if (hasMore && !loading) {
//       fetchPosts(page + 1);
//     }
//   }, [page, hasMore, loading, fetchPosts]);

//   const observerTarget = useInfiniteScroll(handleLoadMore, {
//     threshold: 0.1,
//     rootMargin: '100px'
//   });

//   const handlePostDelete = (postId) => {
//     setPosts(prev => prev.filter(post => post.id !== postId));
//   };

//   return (
//     <div className="space-y-6">
//       {error && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg"
//         >
//           {error}
//         </motion.div>
//       )}

//       {posts.length === 0 && !loading && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center py-12"
//         >
//           <p className="text-gray-400 text-lg">No posts yet. Be the first to share!</p>
//         </motion.div>
//       )}

//       <motion.div layout className="space-y-6">
//         {posts.map((post, idx) => (
//           <motion.div
//             key={post.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: idx * 0.1 }}
//           >
//             <PostCard
//               post={post}
//               onDelete={handlePostDelete}
//             />
//           </motion.div>
//         ))}
//       </motion.div>

//       {loading && <Loading />}

//       {hasMore && !loading && (
//         <div ref={observerTarget} className="py-8">
//           <Loading />
//         </div>
//       )}

//       {!hasMore && posts.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center py-8 text-gray-400"
//         >
//           You've reached the end
//         </motion.div>
//       )}
//     </div>
//   );
// }
