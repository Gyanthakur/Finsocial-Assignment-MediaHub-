

import { AuthProvider } from '../context/AuthContext';
import './globals.css';

import Navbar from '../components/Navigation/Navbar';


export const metadata = {
  title: 'Multimedia Platform',
  description: 'Share images and videos with our community',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <AuthProvider>
          <Navbar/>
          <main className="relative z-10">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
