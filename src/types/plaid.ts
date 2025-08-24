// Plaid Link metadata types
export interface PlaidLinkOnSuccessMetadata {
  institution?: {
    name: string;
    institution_id: string;
  };
  accounts: Array<{
    id: string;
    name: string;
    type: string;
    subtype: string;
    mask: string;
  }>;
  link_session_id: string;
  transfer_status?: string;
}

export interface PlaidLinkOnExitMetadata {
  status?: string;
  institution?: {
    name: string;
    institution_id: string;
  };
  link_session_id: string;
  request_id: string;
}

export interface PlaidLinkError {
  error_type: string;
  error_code: string;
  error_message: string;
  display_message: string | null;
}