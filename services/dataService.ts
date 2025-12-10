import { supabase } from '../supabaseClient';
import { Client, Transaction } from '../types';

// --- Clients Service ---

export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  return data || [];
};

export const addClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();

  if (error) {
    console.error('Error adding client:', error);
    throw error;
  }

  return data;
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

// --- Transactions Service ---

export const getTransactions = async (): Promise<Transaction[]> => {
  // We join with the clients table to get the client name efficiently
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      clients (
        name
      )
    `)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }

  // Map the nested Supabase response to our flat Transaction interface
  return (data || []).map((t: any) => ({
    ...t,
    client_name: t.clients?.name || 'Cliente Eliminado',
    amount: Number(t.amount) // Ensure amount is a number (Supabase might return string for numeric types)
  }));
};

export const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> => {
  // Clean up undefined fields before sending to Supabase
  const payload = {
    ...transaction,
    // Convert empty strings to null for date fields if necessary, though our form usually handles this
    check_payment_date: transaction.check_payment_date || null,
    check_number: transaction.check_number || null,
    bank_issuer: transaction.bank_issuer || null
  };

  const { data, error } = await supabase
    .from('transactions')
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }

  return {
    ...data,
    amount: Number(data.amount)
  };
};