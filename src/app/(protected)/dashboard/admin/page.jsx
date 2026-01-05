

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Image, Heart, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Posts', value: stats?.totalPosts || 0, icon: Image, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Likes', value: stats?.totalLikes || 0, icon: Heart, color: 'from-red-500 to-red-600' },
    { label: 'Active Users (7d)', value: stats?.activeUsers || 0, icon: TrendingUp, color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your platform overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-lg bg-gradient-to-br ${card.color} text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">{card.label}</p>
                <p className="text-3xl font-bold mt-2">
                  {loading ? '...' : card.value.toLocaleString()}
                </p>
              </div>
              <card.icon className="w-12 h-12 opacity-20" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/dashboard/admin/users" className="p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition">
            Manage Users
          </a>
          <a href="/dashboard/admin/moderation" className="p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 transition">
            Moderate Posts
          </a>
          <a href="/dashboard/admin/analytics" className="p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-purple-400 transition">
            View Analytics
          </a>
          <a href="/dashboard/user" className="p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 transition">
            View Feed
          </a>
        </div>
      </motion.div>
    </div>
  );
}