// // 'use client';

// // import { createContext, useContext, useState, useEffect } from 'react';

// // const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [token, setToken] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const storedToken = localStorage.getItem('accessToken');
// //     if (storedToken) {
// //       setToken(storedToken);
// //       // Verify token is still valid
// //       fetch('/api/auth/verify', {
// //         headers: { 'Authorization': `Bearer ${storedToken}` }
// //       })
// //         .then(res => res.json())
// //         .then(data => setUser(data.user))
// //         .catch(() => {
// //           localStorage.removeItem('accessToken');
// //           setToken(null);
// //         })
// //         .finally(() => setLoading(false));
// //     } else {
// //       setLoading(false);
// //     }
// //   }, []);

// //   const login = async (email, password) => {
// //     const res = await fetch('/api/auth/login', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ email, password })
// //     });
    
// //     if (!res.ok) throw new Error('Login failed');
    
// //     const { accessToken, user: userData } = await res.json();
// //     localStorage.setItem('accessToken', accessToken);
// //     setToken(accessToken);
// //     setUser(userData);
// //   };

// //   const logout = () => {
// //     localStorage.removeItem('accessToken');
// //     setToken(null);
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, token, loading, login, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export const useAuth = () => useContext(AuthContext);


// 'use client';

// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   const login = async (email, password) => {
//     const res = await fetch('/api/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password })
//     });
//     const data = await res.json();
//     localStorage.setItem('accessToken', data.accessToken);
//     setToken(data.accessToken);
//     setUser(data.user);
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

'use client';

import { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    
    if (storedToken) {
      setToken(storedToken);
      // Verify token is valid
      fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${storedToken}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setToken(data.accessToken);
    setUser(data.user);

    return data;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setToken(data.accessToken);
    setUser(data.user);

    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const refreshTok = localStorage.getItem('refreshToken');
    if (!refreshTok) throw new Error('No refresh token');

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refreshTok })
    });

    if (!response.ok) {
      logout();
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    setToken(data.accessToken);

    return data;
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    refreshToken,
    setUser,
    setToken,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
