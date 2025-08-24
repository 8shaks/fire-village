'use client';

import React from 'react';
import { Item } from '@/services/plaid.service';

interface ConnectedAccountsProps {
  items: Item[];
  onRemoveItem?: (itemId: string) => void;
}

const ConnectedAccounts: React.FC<ConnectedAccountsProps> = ({ 
  items, 
  onRemoveItem 
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Connected Accounts ({items.length})
      </h3>
      
      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {/* Bank Icon */}
                  <svg 
                    className="h-5 w-5 text-gray-500 dark:text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" 
                    />
                  </svg>
                  
                  {/* Institution Name */}
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {item.institutionName || 'Bank Account'}
                  </h4>
                  
                  {/* Status Badge */}
                  {item.status && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      item.status === 'active' || item.status === 'good' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : item.status === 'needs_attention' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>
                
                {/* Item Details */}
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {item.institutionId && (
                    <p>
                      <span className="font-medium">Institution ID:</span> {item.institutionId}
                    </p>
                  )}
                  <p className="font-mono text-xs">
                    <span className="font-sans font-medium">Item ID:</span> {item.id}
                  </p>
                </div>
              </div>
              
              {/* Remove Button */}
              {onRemoveItem && (
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Remove account"
                >
                  <svg 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Info Message */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex">
          <svg 
            className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your bank connections are secure and encrypted. Account data is stored safely on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccounts;