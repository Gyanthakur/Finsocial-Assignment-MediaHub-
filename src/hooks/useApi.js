'use client';

import { useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const abortControllerRef = useRef(null);

  const execute = useCallback(async (method = 'GET', body = null, customHeaders = {}) => {
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...customHeaders
      };

      const fetchOptions = {
        method,
        headers,
        signal: abortControllerRef.current.signal,
        ...options
      };

      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('API Error:', err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, token, options]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return { data, loading, error, execute, cancel };
};