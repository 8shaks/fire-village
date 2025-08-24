'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      // Redirect to login if no token
      router.push('/login');
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, [router]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to home
    router.push('/');
  };

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to your Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                You are successfully logged in!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {user.name}
                </dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {user.email}
                </dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  User ID
                </dt>
                <dd className="text-sm text-gray-900 dark:text-white font-mono">
                  {user.id}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}