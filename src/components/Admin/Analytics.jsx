'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, FileText } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30s
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
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Total Posts',
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Total Likes',
      value: stats?.totalLikes || 0,
      icon: TrendingUp,
      color: 'from-pink-500 to-pink-600'
    },
    {
      label: 'Active Users (7d)',
      value: stats?.activeUsers || 0,
      icon: Users,
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Analytics</h2>

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Last Updated</h3>
          <p className="text-gray-400">
            {new Date(stats.timestamp).toLocaleString()}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
