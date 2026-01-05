'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Trash2, Shield, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebounce } from '@/src/hooks/useDebounce';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-4">User Management</h1>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition text-white"
          />
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr className="border-b border-gray-700">
                <th className="px-6 py-3 text-left text-gray-300">User</th>
                <th className="px-6 py-3 text-left text-gray-300">Email</th>
                <th className="px-6 py-3 text-left text-gray-300">Role</th>
                <th className="px-6 py-3 text-left text-gray-300">Posts</th>
                <th className="px-6 py-3 text-left text-gray-300">Joined</th>
                <th className="px-6 py-3 text-left text-gray-300">Actions</th>
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
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-white">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                      user.role === 'ADMIN'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">{user._count?.posts || 0}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && <p className="text-gray-400 p-6">Loading...</p>}
        {users.length === 0 && !loading && <p className="text-gray-400 p-6">No users found</p>}

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <span className="text-gray-400 text-sm">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 bg-gray-700/50 hover:bg-gray-700 disabled:opacity-50 text-white rounded transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 bg-gray-700/50 hover:bg-gray-700 disabled:opacity-50 text-white rounded transition"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
