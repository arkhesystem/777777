export type PaymentMethod = 'EFECTIVO' | 'TRANSFERENCIA' | 'CHEQUE' | 'E_CHEQ';

export interface Client {
  id: string;
  name: string;
  cuit: string;
  phone: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO String
  invoice_number: string;
  description: string;
  client_id: string;
  client_name?: string; // Joined field for display
  payment_method: PaymentMethod;
  amount: number;
  // Conditional fields for checks
  check_number?: string;
  check_payment_date?: string; // ISO String
  bank_issuer?: string;
  created_at: string;
}

export interface KpiData {
  totalInvoiced: number;
  totalCollected: number;
  pendingChecks: number;
}