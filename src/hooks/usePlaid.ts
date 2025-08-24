'use client';

import { useState, useEffect, useCallback } from 'react';
import PlaidService, { Item } from '@/services/plaid.service';

/**
 * Custom hook for managing Plaid items (connected bank accounts)
 */
export const usePlaidItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load items from local storage on mount
  useEffect(() => {
    const loadItems = () => {
      try {
        const storedItems = PlaidService.getStoredItems();
        setItems(storedItems);
      } catch (error) {
        console.error('Error loading Plaid items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();
  }, []);

  // Add a new item
  const addItem = useCallback((item: Item) => {
    PlaidService.storeItemInfo(item);
    setItems(prevItems => [...prevItems, item]);
  }, []);

  // Remove an item
  const removeItem = useCallback((itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('plaid_items', JSON.stringify(updatedItems));
    }
    setItems(updatedItems);
  }, [items]);

  // Clear all items
  const clearItems = useCallback(() => {
    PlaidService.clearStoredItems();
    setItems([]);
  }, []);

  // Refresh items from storage
  const refreshItems = useCallback(() => {
    const storedItems = PlaidService.getStoredItems();
    setItems(storedItems);
  }, []);

  return {
    items,
    isLoading,
    addItem,
    removeItem,
    clearItems,
    refreshItems,
    hasConnectedAccounts: items.length > 0,
  };
};

/**
 * Custom hook for managing Plaid Link connection state
 */
export const usePlaidConnection = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastConnectedItem, setLastConnectedItem] = useState<Item | null>(null);

  const handleConnectionSuccess = useCallback((item: Item) => {
    setLastConnectedItem(item);
    setConnectionError(null);
    setIsConnecting(false);
  }, []);

  const handleConnectionError = useCallback((error: string) => {
    setConnectionError(error);
    setIsConnecting(false);
  }, []);

  const startConnection = useCallback(() => {
    setIsConnecting(true);
    setConnectionError(null);
  }, []);

  const resetConnection = useCallback(() => {
    setIsConnecting(false);
    setConnectionError(null);
    setLastConnectedItem(null);
  }, []);

  return {
    isConnecting,
    connectionError,
    lastConnectedItem,
    handleConnectionSuccess,
    handleConnectionError,
    startConnection,
    resetConnection,
  };
};

/**
 * Combined hook for complete Plaid functionality
 */
export const usePlaid = () => {
  const itemsHook = usePlaidItems();
  const connectionHook = usePlaidConnection();

  return {
    ...itemsHook,
    ...connectionHook,
  };
};

export default usePlaid;