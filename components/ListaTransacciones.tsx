import React, { useState } from 'react';
import { Transaction } from '../types';
import { PAYMENT_METHODS } from '../constants';
import { Calendar, User, Search, FilterX } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

const ListaTransacciones: React.FC<TransactionListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');

  const getMethodLabel = (value: string) => {
    return PAYMENT_METHODS.find(m => m.value === value)?.label || value;
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('es-AR');
  };

  const filtered = transactions.filter(tx => {
    const matchesSearch = 
        tx.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.invoice_number.includes(searchTerm);
    
    const matchesMethod = methodFilter === 'ALL' || tx.payment_method === methodFilter;

    return matchesSearch && matchesMethod;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
      
      {/* List Controls */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-4 justify-between bg-slate-50 dark:bg-slate-900">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
                type="text"
                placeholder="Buscar por cliente, factura o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-energen-orange text-black dark:text-white placeholder:text-slate-400"
            />
        </div>
        <div className="flex gap-2">
            <select 
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-energen-orange text-black dark:text-white"
            >
                <option value="ALL">Todos los Medios</option>
                {PAYMENT_METHODS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
            </select>
            {(searchTerm || methodFilter !== 'ALL') && (
                <button 
                    onClick={() => {setSearchTerm(''); setMethodFilter('ALL');}}
                    className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition"
                    title="Limpiar filtros"
                >
                    <FilterX className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Fecha</th>
              <th className="p-4 font-bold">Factura</th>
              <th className="p-4 font-bold">Cliente</th>
              <th className="p-4 font-bold w-1/3">Descripción</th>
              <th className="p-4 font-bold">Forma de Cobro</th>
              <th className="p-4 font-bold text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-900 dark:text-slate-200 divide-y divide-slate-100 dark:divide-slate-700">
            {filtered.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 dark:text-slate-500">
                        {transactions.length === 0 ? "No hay facturas cargadas." : "No se encontraron resultados con los filtros actuales."}
                    </td>
                </tr>
            ) : (
                filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-orange-50/30 dark:hover:bg-slate-700/50 transition group">
                    <td className="p-4 whitespace-nowrap font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400 group-hover:text-energen-orange" />
                            {formatDate(tx.date)}
                        </div>
                    </td>
                    <td className="p-4 whitespace-nowrap font-mono text-xs text-slate-600 dark:text-slate-400">
                        {tx.invoice_number}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 font-semibold">
                            <User className="w-4 h-4 text-slate-400" />
                            {tx.client_name}
                        </div>
                    </td>
                    <td className="p-4">
                        <p className="truncate max-w-xs text-slate-600 dark:text-slate-300" title={tx.description}>{tx.description}</p>
                    </td>
                    <td className="p-4">
                        <div className="flex flex-col">
                            <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded text-xs font-bold border ${
                                tx.payment_method === 'EFECTIVO' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' :
                                tx.payment_method === 'TRANSFERENCIA' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                                'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                            }`}>
                                {getMethodLabel(tx.payment_method)}
                            </span>
                            {/* Smart Detail for Checks */}
                            {(tx.payment_method === 'CHEQUE' || tx.payment_method === 'E_CHEQ') && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-1 border-l-2 border-slate-300 dark:border-slate-600">
                                    #{tx.check_number} <br/> Vence: {formatDate(tx.check_payment_date || '')}
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="p-4 text-right font-black text-slate-900 dark:text-white text-base">
                        ${tx.amount.toLocaleString()}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaTransacciones;