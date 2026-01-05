// 'use client';

// // import { useAuth } from '@/context/AuthContext';
// import { useAuth } from '@/src/hooks/useAuth';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// // import PostFeed from '@/src/components/Posts/PostFeed';
// import PostFeed from '@/src/components/Posts/PostFeed';
// import { motion } from 'framer-motion';

// export default function DashboardPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login');
//     }
//   }, [user, loading, router]);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="min-h-screen pt-20">
//       <div className="max-w-4xl mx-auto px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
//           <p className="text-gray-400">Role: {user?.role}</p>
//         </motion.div>

//         <PostFeed />
//       </div>
//     </div>
//   );
// }


import { redirect } from 'next/navigation';

export default function DashboardPage() {
  redirect('/dashboard/user');
}
