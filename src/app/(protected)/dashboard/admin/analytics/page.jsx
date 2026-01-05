'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, FileText } from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Likes', value: stats?.totalLikes || 0, icon: TrendingUp, color: 'from-pink-500 to-pink-600' },
    { label: 'Active Users (7d)', value: stats?.activeUsers || 0, icon: Users, color: 'from-green-500 to-green-600' }
  ];

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Platform Analytics</h1>
        <p className="text-gray-400">Real-time statistics and insights</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gray-800/50 border border-gray-700 rounded-lg p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Last Updated</h2>
          <p className="text-gray-400">
            {new Date(stats.timestamp).toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
        </motion.div>
      )}
    </div>
  );
}
