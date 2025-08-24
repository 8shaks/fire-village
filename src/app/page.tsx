'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
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
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in or create an account to continue
          </p>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Link
            href="/login"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg text-center hover:bg-blue-700 transition duration-200"
          >
            Login
          </Link>
          
          <Link
            href="/signup"
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg text-center hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
