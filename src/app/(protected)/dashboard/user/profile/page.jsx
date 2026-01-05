'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Mail, MapPin, Calendar, Edit2, LogOut, Heart, FileText } from 'lucide-react';
import Image from 'next/image';
import PostFeed from '@/src/components/Posts/PostFeed';
import DashboardBackground from '@/src/components/3D/DashboardBackground';

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        bio: user.bio || ''
      });
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/users/${user?.userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserStats(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/users/${user?.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setIsEditing(false);
        // Refresh user data
        fetchUserStats();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <DashboardBackground/>
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden"
      >
        {/* Background Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

        {/* Profile Content */}
        <div className="px-6 pb-6 -mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Profile Info */}
            <div className="flex items-end gap-4">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-gray-800 flex items-center justify-center text-white text-4xl font-bold shadow-lg"
              >
                {user.name?.[0]?.toUpperCase() || 'U'}
              </motion.div>

              {/* Name & Info */}
              <div className="pb-2">
                <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur transition"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg backdrop-blur transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition text-white"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition text-white resize-none"
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdateProfile}
                disabled={updateLoading}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-semibold transition"
              >
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      {!loading && userStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Posts</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {userStats.postsCount || 0}
                </p>
              </div>
              <FileText className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Likes</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {userStats.totalLikes || 0}
                </p>
              </div>
              <Heart className="w-10 h-10 text-red-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Member Since</p>
                <p className="text-lg font-bold text-white mt-2">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short'
                  })}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </motion.div>
        </div>
      )}

      {/* User's Posts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Your Posts</h2>
        <PostFeed userId={user?.userId} />
      </motion.div>
    </div>
  );
}

