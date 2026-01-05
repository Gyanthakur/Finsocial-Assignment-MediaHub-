'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trash2, Shield, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/users', window.location.origin);
      url.searchParams.set('page', page);
      url.searchParams.set('limit', '10');

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-gray-300">Name</th>
              <th className="px-4 py-3 text-left text-gray-300">Email</th>
              <th className="px-4 py-3 text-left text-gray-300">Role</th>
              <th className="px-4 py-3 text-left text-gray-300">Posts</th>
              <th className="px-4 py-3 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-gray-700 hover:bg-gray-700/20 transition"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {user.name[0]}
                  </div>
                  <span className="text-white">{user.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-400">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'ADMIN'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-white">{user._count?.posts || 0}</td>
                <td className="px-4 py-3">
                  <button className="p-2 hover:bg-red-500/20 text-red-400 rounded transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && <p className="text-gray-400 mt-4">Loading...</p>}
      {users.length === 0 && !loading && <p className="text-gray-400 mt-4">No users found</p>}

      {/* Pagination */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded transition"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
