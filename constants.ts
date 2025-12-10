export const APP_NAME = "EnerGen Finanzas";

export const PAYMENT_METHODS: { value: string; label: string }[] = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
  { value: 'CHEQUE', label: 'Cheque Físico' },
  { value: 'E_CHEQ', label: 'E-Cheq' },
];

// Mock Initial Data for Demo purposes since we don't have a live Supabase URL
export const MOCK_CLIENTS = [
  { id: '1', name: 'Constructora del Sur S.A.', cuit: '30-11223344-5', phone: '11-4455-6677' },
  { id: '2', name: 'Edificios Modernos SRL', cuit: '30-99887766-1', phone: '11-2233-4455' },
  { id: '3', name: 'Industrias Metalúrgicas', cuit: '33-55667788-9', phone: '02320-445566' },
];

export const MOCK_TRANSACTIONS = [
  {
    id: '101',
    date: '2023-10-25',
    invoice_number: '0001-00000452',
    description: 'Mantenimiento preventivo Grupo Electrógeno CAT 500kVA',
    client_id: '1',
    payment_method: 'TRANSFERENCIA',
    amount: 150000,
    created_at: new Date().toISOString()
  },
  {
    id: '102',
    date: '2023-10-26',
    invoice_number: '0001-00000453',
    description: 'Reparación de tablero de transferencia automática',
    client_id: '2',
    payment_method: 'E_CHEQ',
    amount: 320000,
    check_number: '99881122',
    check_payment_date: '2023-11-20',
    bank_issuer: 'Banco Galicia',
    created_at: new Date().toISOString()
  }
];