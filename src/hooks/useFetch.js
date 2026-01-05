
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

const cache = new Map();

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const cacheKeyRef = useRef(null);

  const fetchData = useCallback(async () => {
    const { skipCache = false } = options;
    cacheKeyRef.current = `${url}:${token}`;

    // Check cache first
    if (!skipCache && cache.has(cacheKeyRef.current)) {
      const cached = cache.get(cacheKeyRef.current);
      setData(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch(url, { headers, ...options });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result
      if (!skipCache) {
        cache.set(cacheKeyRef.current, result);
      }
      
      setData(result);
    } catch (err) {
      setError(err);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [url, token, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const clearCache = useCallback(() => {
    if (cacheKeyRef.current) {
      cache.delete(cacheKeyRef.current);
    }
  }, []);

  return { data, loading, error, refetch, clearCache };
};
