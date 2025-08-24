import client from '@/lib/apollo-client';
import { 
  CREATE_LINK_TOKEN_MUTATION, 
  EXCHANGE_PUBLIC_TOKEN_MUTATION 
} from '@/graphql/mutations';

export interface CreateLinkTokenInput {
  products?: string[];
  countryCodes?: string[];
  language?: string;
  webhookUrl?: string;
}

export interface LinkTokenResponse {
  linkToken: string;
  expiration: string;
}

export interface ExchangePublicTokenInput {
  publicToken: string;
}

export interface Item {
  id: string;
  institutionId?: string;
  institutionName?: string;
  status?: string;
}

export interface ExchangePublicTokenResponse {
  item: Item;
  accountsCreated: number;
}

export class PlaidService {
  /**
   * Creates a Plaid Link token for initiating the bank connection flow
   */
  static async createLinkToken(input: CreateLinkTokenInput = {}): Promise<LinkTokenResponse> {
    try {
      // Set default values if not provided
      const defaultInput = {
        products: input.products || ['transactions', 'accounts'],
        countryCodes: input.countryCodes || ['US'],
        language: input.language || 'en',
        webhookUrl: input.webhookUrl || undefined,
      };

      const { data } = await client.mutate({
        mutation: CREATE_LINK_TOKEN_MUTATION,
        variables: { 
          input: defaultInput
        },
      });

      return data.createLinkToken;
    } catch (error) {
      console.error('Error creating link token:', error);
      throw new Error('Failed to create Plaid link token');
    }
  }

  /**
   * Exchanges a public token for an access token after successful bank connection
   */
  static async exchangePublicToken(publicToken: string): Promise<ExchangePublicTokenResponse> {
    try {
      const { data } = await client.mutate({
        mutation: EXCHANGE_PUBLIC_TOKEN_MUTATION,
        variables: { 
          input: { 
            publicToken 
          } 
        },
      });

      return data.exchangePublicToken;
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw new Error('Failed to exchange public token');
    }
  }

  /**
   * Stores the Plaid item information in local storage
   */
  static storeItemInfo(item: Item): void {
    if (typeof window !== 'undefined') {
      const existingItems = this.getStoredItems();
      const updatedItems = [...existingItems, item];
      localStorage.setItem('plaid_items', JSON.stringify(updatedItems));
    }
  }

  /**
   * Retrieves stored Plaid items from local storage
   */
  static getStoredItems(): Item[] {
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem('plaid_items');
      return storedItems ? JSON.parse(storedItems) : [];
    }
    return [];
  }

  /**
   * Clears all stored Plaid items
   */
  static clearStoredItems(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('plaid_items');
    }
  }
}

export default PlaidService;