


// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/src/hooks/useAuth';
// import { Mail, Lock, AlertCircle, Loader } from 'lucide-react';

// export default function LoginForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();
//   const { setUser, setToken } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         throw new Error(data.error || 'Login failed');
//       }

//       const data = await response.json();
//       localStorage.setItem('accessToken', data.accessToken);
//       localStorage.setItem('refreshToken', data.refreshToken);
      
//       setToken(data.accessToken);
//       setUser(data.user);

//       router.push(data.user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.form
//       onSubmit={handleSubmit}
//       className="space-y-6"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//     >
//       {error && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-lg"
//         >
//           <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//           <p className="text-red-400 text-sm">{error}</p>
//         </motion.div>
//       )}

//       <div>
//         <label className="block text-sm font-medium text-gray-300 mb-2">
//           Email Address
//         </label>
//         <div className="relative">
//           <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//             placeholder="you@example.com"
//             required
//             disabled={loading}
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-300 mb-2">
//           Password
//         </label>
//         <div className="relative">
//           <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
//           <input
//             type={showPassword ? 'text' : 'password'}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full pl-10 pr-12 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
//             placeholder="••••••••"
//             required
//             disabled={loading}
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
//             disabled={loading}
//           >
//             {showPassword ? '✕' : '○'}
//           </button>
//         </div>
//       </div>

//       <motion.button
//         type="submit"
//         disabled={loading}
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
//       >
//         {loading ? (
//           <>
//             <Loader className="w-4 h-4 animate-spin" />
//             Signing in...
//           </>
//         ) : (
//           'Sign In'
//         )}
//       </motion.button>

//       <p className="text-sm text-gray-400 text-center">
//         Test Account: demo@example.com / Password123
//       </p>
//     </motion.form>
//   );
// }

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/src/hooks/useAuth';
import { Mail, Lock, AlertCircle, Loader, Shield } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const router = useRouter();
  const { setUser, setToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      
      // Check if user is admin for admin login
      if (isAdminLogin && data.user.role !== 'ADMIN') {
        throw new Error('This account is not an admin account');
      }

      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      setToken(data.accessToken);
      setUser(data.user);

      // Redirect based on role and login type
      if (data.user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Login Type Toggle */}
      <div className="flex gap-2 bg-gray-700/30 p-1 rounded-lg">
        <motion.button
          type="button"
          onClick={() => setIsAdminLogin(false)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-2 px-4 rounded transition font-medium ${
            !isAdminLogin
              ? 'bg-blue-500/20 text-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          User Login
        </motion.button>
        <motion.button
          type="button"
          onClick={() => setIsAdminLogin(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex-1 py-2 px-4 rounded transition font-medium flex items-center justify-center gap-2 ${
            isAdminLogin
              ? 'bg-red-500/20 text-red-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Shield className="w-4 h-4" />
          Admin Login
        </motion.button>
      </div>

      {/* Admin Notice */}
      {isAdminLogin && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">
            Admin login required. Only accounts with admin privileges can access the admin panel.
          </p>
        </motion.div>
      )}

      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            placeholder="••••••••"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-400"
            disabled={loading}
          >
            {showPassword ? '✕' : '○'}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-2 rounded-lg transition flex items-center justify-center gap-2 font-semibold text-white ${
          isAdminLogin
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50'
            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50'
        }`}
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            {isAdminLogin && <Shield className="w-4 h-4" />}
            Sign In
          </>
        )}
      </motion.button>

      {/* Test Credentials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg text-sm text-gray-300"
      >
        <p className="font-semibold text-white mb-2">Test Credentials:</p>
        <div className="space-y-2">
          <div>
            <p className="text-gray-400">👤 User Account:</p>
            <code className="text-blue-400">user@example.com / User123!</code>
          </div>
          <div>
            <p className="text-gray-400">🛡️ Admin Account:</p>
            <code className="text-red-400">admin@example.com / Admin123!</code>
          </div>
        </div>
      </motion.div>
    </motion.form>
  );
}