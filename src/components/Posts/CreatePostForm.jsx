'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Video, Loader, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Toast from '@/src/components/UI/Toast';

export default function CreatePostForm({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('IMAGE');
  const [mediaUrl, setMediaUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In production, upload to Cloudinary
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setMediaUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !mediaUrl) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          title,
          description,
          type,
          mediaUrl
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const data = await response.json();
      setSuccess('Post created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setMediaUrl('');
      setPreview('');
      setType('IMAGE');

      onPostCreated?.(data);

      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Create a New Post</h2>

      {error && <Toast type="error" message={error} />}
      {success && <Toast type="success" message={success} />}

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition"
            placeholder="Enter post title"
            required
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none"
            placeholder="Enter post description (optional)"
            rows={4}
            disabled={loading}
          />
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Media Type *
          </label>
          <div className="flex gap-4">
            {[
              { value: 'IMAGE', label: 'Image', icon: Image },
              { value: 'VIDEO', label: 'Video', icon: Video }
            ].map(({ value, label, icon: Icon }) => (
              <motion.button
                key={value}
                type="button"
                onClick={() => setType(value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                  type === value
                    ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                    : 'bg-gray-700/30 border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Upload {type === 'IMAGE' ? 'Image' : 'Video'} *
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleMediaChange}
              accept={type === 'IMAGE' ? 'image/*' : 'video/*'}
              className="hidden"
              id="media-upload"
              required
              disabled={loading}
            />
            <label
              htmlFor="media-upload"
              className="flex flex-col items-center justify-center w-full p-8 bg-gray-700/30 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 cursor-pointer transition"
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-400 text-center">
                Click to upload or drag and drop
              </p>
            </label>
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-4 relative group">
              {type === 'IMAGE' ? (
                <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
              ) : (
                <video src={preview} className="w-full h-64 object-cover rounded-lg" />
              )}
              <motion.button
                type="button"
                onClick={() => {
                  setPreview('');
                  setMediaUrl('');
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-2 right-2 p-1 bg-red-500/20 hover:bg-red-500/40 rounded transition"
              >
                <X className="w-5 h-5 text-red-400" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Creating Post...
            </>
          ) : (
            'Create Post'
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}