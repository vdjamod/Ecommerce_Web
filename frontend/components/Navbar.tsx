'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            E-Commerce
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/products" className="hover:text-blue-400 transition">
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/cart" className="hover:text-blue-400 transition">
                  Cart
                </Link>
                <Link href="/orders" className="hover:text-blue-400 transition">
                  Orders
                </Link>
                {isAdmin && (
                  <>
                    <Link href="/admin" className="hover:text-blue-400 transition">
                      Admin
                    </Link>
                    <Link href="/reports" className="hover:text-blue-400 transition">
                      Reports
                    </Link>
                  </>
                )}
                <span className="text-blue-400">Hello, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-blue-400 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

