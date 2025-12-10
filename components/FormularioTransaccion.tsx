import React, { useState } from 'react';
import { Client, PaymentMethod } from '../types';
import { PAYMENT_METHODS } from '../constants';
import { Save, Calendar, FileText, User, DollarSign, CreditCard } from 'lucide-react';

interface TransactionFormProps {
  clients: Client[];
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const FormularioTransaccion: React.FC<TransactionFormProps> = ({ clients, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    invoice_number: '',
    description: '',
    client_id: '',
    amount: '',
    payment_method: 'TRANSFERENCIA' as PaymentMethod,
    // Conditional
    check_number: '',
    check_payment_date: '',
    bank_issuer: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isCheckMethod = formData.payment_method === 'CHEQUE' || formData.payment_method === 'E_CHEQ';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id) {
        alert("Por favor seleccione un cliente.");
        return;
    }
    setLoading(true);
    try {
      await onSave({
        ...formData,
        amount: Number(formData.amount)
      });
    } catch (error) {
      console.error(error);
      alert("Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
      <div className="bg-slate-50 dark:bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-energen-orange text-xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Nueva Facturación
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Row 1: Date & Invoice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                // Explicit bg-white
                className="w-full pl-10 pr-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-energen-orange focus:border-transparent outline-none transition dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">N° Factura</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-500 font-bold">#</span>
              <input
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                placeholder="0001-0000XXXX"
                className="w-full pl-8 pr-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-energen-orange focus:border-transparent outline-none transition font-mono dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 2: Client */}
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Cliente</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-energen-orange focus:border-transparent outline-none transition dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              required
            >
              <option value="">Seleccionar Cliente...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name} (CUIT: {client.cuit})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Description */}
        <div>
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Descripción del Servicio</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Detalle de trabajos realizados, materiales, equipo..."
            className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-energen-orange focus:border-transparent outline-none transition dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            required
          />
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>

        {/* Row 4: Payment Header */}
        <h3 className="text-md font-bold text-slate-900 dark:text-slate-200">Detalles del Cobro</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Monto Total</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-10 pr-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-energen-orange focus:border-transparent outline-none transition text-lg font-bold dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              />
            </div>
          </div>

           {/* Payment Method */}
           <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Forma de Cobro</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-energen-orange focus:border-transparent outline-none transition dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                required
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Conditional Fields for Checks */}
        {isCheckMethod && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4">
             <div className="col-span-full mb-1">
                <span className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wide">Datos del Cheque Obligatorios</span>
             </div>
             
             <div>
                <label className="block text-xs font-bold text-orange-900 dark:text-orange-200 mb-1">N° Cheque</label>
                <input
                  type="text"
                  name="check_number"
                  value={formData.check_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-orange-300 rounded bg-white text-slate-900 focus:outline-none focus:border-energen-orange dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required={isCheckMethod}
                />
             </div>
             
             <div>
                <label className="block text-xs font-bold text-orange-900 dark:text-orange-200 mb-1">Banco Emisor</label>
                <input
                  type="text"
                  name="bank_issuer"
                  value={formData.bank_issuer}
                  onChange={handleChange}
                  className="w-full p-2 border border-orange-300 rounded bg-white text-slate-900 focus:outline-none focus:border-energen-orange dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required={isCheckMethod}
                />
             </div>

             <div>
                <label className="block text-xs font-bold text-orange-900 dark:text-orange-200 mb-1">Fecha de Cobro</label>
                <input
                  type="date"
                  name="check_payment_date"
                  value={formData.check_payment_date}
                  onChange={handleChange}
                  className="w-full p-2 border border-orange-300 rounded bg-white text-slate-900 focus:outline-none focus:border-energen-orange dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  required={isCheckMethod}
                />
             </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 bg-energen-orange text-white font-bold rounded-lg hover:bg-orange-700 transition shadow-md flex justify-center items-center gap-2"
          >
            {loading ? 'Guardando...' : (
                <>
                    <Save className="w-5 h-5" />
                    Guardar Factura
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioTransaccion;