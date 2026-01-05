'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/src/components/UI/Loading';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return children;
}