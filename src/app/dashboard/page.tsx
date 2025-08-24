'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useLogout } from '@/hooks/useAuth';
import { usePlaid } from '@/hooks/usePlaid';
import PlaidLinkButton from '@/components/PlaidLink';
import ConnectedAccounts from '@/components/ConnectedAccounts';
import { PlaidLinkOnSuccessMetadata, PlaidLinkOnExitMetadata } from 'react-plaid-link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const logoutMutation = useLogout();
  const { 
    items, 
    hasConnectedAccounts, 
    refreshItems,
    removeItem 
  } = usePlaid();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handlePlaidSuccess = (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
    console.log('Bank account connected successfully!', { publicToken, metadata });
    setShowSuccessMessage(true);
    refreshItems(); // Refresh the list of connected accounts
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePlaidExit = (err: any, metadata: PlaidLinkOnExitMetadata) => {
    if (err) {
      console.error('Plaid Link error:', err);
    } else {
      console.log('User exited Plaid Link', metadata);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* User Info Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to your Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage your account and connected bank accounts
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
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

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Bank account connected successfully!
                </p>
                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                  Your bank account has been securely linked to your account.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bank Accounts Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Bank Accounts
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect your bank accounts to get started with financial tracking
            </p>
          </div>

          {/* Connected Accounts */}
          {hasConnectedAccounts ? (
            <div className="mb-6">
              <ConnectedAccounts 
                items={items} 
                onRemoveItem={removeItem}
              />
            </div>
          ) : (
            <div className="mb-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400 mb-3" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                No bank accounts connected yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Connect your first bank account to start tracking your finances
              </p>
            </div>
          )}

          {/* Connect Bank Account Button */}
          <div className="flex justify-center">
            <PlaidLinkButton
              onSuccess={handlePlaidSuccess}
              onExit={handlePlaidExit}
              buttonText={hasConnectedAccounts ? "Connect Another Account" : "Connect Your First Account"}
              className="w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Navigation */}
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