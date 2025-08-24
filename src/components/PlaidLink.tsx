'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink, PlaidLinkOnSuccess, PlaidLinkOnExit, PlaidLinkOnSuccessMetadata, PlaidLinkOnExitMetadata } from 'react-plaid-link';
import PlaidService from '@/services/plaid.service';

interface PlaidLinkButtonProps {
  onSuccess?: (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => void;
  onExit?: (err: unknown, metadata: PlaidLinkOnExitMetadata) => void;
  className?: string;
  buttonText?: string;
  products?: string[];
  countryCodes?: string[];
}

export const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({
  onSuccess: onSuccessProp,
  onExit: onExitProp,
  className = '',
  buttonText = 'Connect Bank Account',
  products = ['transactions', 'accounts'],
  countryCodes = ['US'],
}) => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch link token when component mounts
  useEffect(() => {
    const fetchLinkToken = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await PlaidService.createLinkToken({
          products,
          countryCodes,
        });
        setLinkToken(response.linkToken);
      } catch (err) {
        console.error('Error fetching link token:', err);
        setError('Failed to initialize bank connection. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkToken();
  }, [products, countryCodes]);

  // Handle successful bank connection
  const onSuccess: PlaidLinkOnSuccess = useCallback(
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      console.log('Plaid Link success:', { publicToken, metadata });
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Exchange public token for access token
        const response = await PlaidService.exchangePublicToken(publicToken);
        
        // Store the item information with institution name if available
        const itemToStore = {
          ...response.item,
          institutionName: metadata.institution?.name || response.item.institutionName,
          institutionId: metadata.institution?.institution_id || response.item.institutionId,
        };
        PlaidService.storeItemInfo(itemToStore);
        
        console.log('Successfully exchanged token:', response);
        
        // Call the parent's onSuccess callback if provided
        if (onSuccessProp) {
          onSuccessProp(publicToken, metadata);
        }
      } catch (err) {
        console.error('Error exchanging public token:', err);
        setError('Failed to complete bank connection. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccessProp]
  );

  // Handle exit from Plaid Link
  const onExit: PlaidLinkOnExit = useCallback(
    (err: unknown, metadata: PlaidLinkOnExitMetadata) => {
      console.log('Plaid Link exit:', { error: err, metadata });
      
      if (err) {
        // User encountered an error
        console.error('Plaid Link error:', err);
      }
      
      // Call the parent's onExit callback if provided
      if (onExitProp) {
        onExitProp(err, metadata);
      }
    },
    [onExitProp]
  );

  // Configure Plaid Link
  const config = {
    token: linkToken,
    onSuccess,
    onExit,
  };

  const { open, ready } = usePlaidLink(config);

  const handleClick = () => {
    if (ready) {
      open();
    }
  };

  // Show loading state while fetching link token
  if (isLoading && !linkToken) {
    return (
      <button
        disabled
        className={`px-6 py-3 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed ${className}`}
      >
        Initializing...
      </button>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors ${className}`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!ready || isLoading}
      className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Processing...' : buttonText}
    </button>
  );
};

export default PlaidLinkButton;