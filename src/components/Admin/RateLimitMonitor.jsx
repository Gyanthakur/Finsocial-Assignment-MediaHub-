'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function RateLimitMonitor() {
  const [rateLimitStatus, setRateLimitStatus] = useState({
    remaining: 100,
    total: 100,
    resetTime: new Date()
  });

  useEffect(() => {
    const checkRateLimit = () => {
      const headers = new Headers(fetch.prototype.constructor.name);
      // In production, fetch rate limit headers from responses
      const remaining = 100 - Math.random() * 20;
      setRateLimitStatus({
        remaining: Math.floor(remaining),
        total: 100,
        resetTime: new Date(Date.now() + 15 * 60 * 1000)
      });
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 5000);
    return () => clearInterval(interval);
  }, []);

  const percentage = (rateLimitStatus.remaining / rateLimitStatus.total) * 100;
  const isWarning = percentage < 30;
  const isCritical = percentage < 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800/50 border border-gray-700 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Rate Limit Monitor</h3>
        {!isCritical ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-500" />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">API Requests</span>
            <span className="text-white font-semibold">
              {rateLimitStatus.remaining}/{rateLimitStatus.total}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              animate={{ width: `${percentage}%` }}
              className={`h-2 rounded-full transition-all ${
                isCritical
                  ? 'bg-red-500'
                  : isWarning
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
          </div>
        </div>

        <p className="text-sm text-gray-400">
          Resets at {rateLimitStatus.resetTime.toLocaleTimeString()}
        </p>

        {isCritical && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
            ⚠️ Approaching rate limit. Reduce API calls.
          </div>
        )}

        {isWarning && !isCritical && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-sm">
            ⚠️ Rate limit is at {percentage.toFixed(0)}%. Monitor usage.
          </div>
        )}
      </div>
    </motion.div>
  );
}
