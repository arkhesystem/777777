import React, { useState } from 'react';
import { Client } from '../types';
import { Plus, Trash2, Building, Phone, CreditCard } from 'lucide-react';

interface ClientManagerProps {
  clients: Client[];
  onAdd: (client: Omit<Client, 'id'>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const GestorClientes: React.FC<ClientManagerProps> = ({ clients, onAdd, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', cuit: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(newClient);
      setNewClient({ name: '', cuit: '', phone: '' });
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cartera de Clientes</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-2 shadow-sm">
          <h3 className="text-sm font-bold text-energen-orange mb-4 uppercase tracking-wide">Alta de Cliente</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1">Razón Social</label>
              <input 
                type="text" 
                required 
                value={newClient.name}
                onChange={e => setNewClient({...newClient, name: e.target.value})}
                // Explicit bg-white and text-slate-900 to ensure visibility
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white text-slate-900 focus:ring-2 focus:ring-energen-orange outline-none placeholder:text-slate-400"
                placeholder="Ej: Empresa S.A."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1">CUIT</label>
              <input 
                type="text" 
                required 
                value={newClient.cuit}
                onChange={e => setNewClient({...newClient, cuit: e.target.value})}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white text-slate-900 focus:ring-2 focus:ring-energen-orange outline-none placeholder:text-slate-400"
                placeholder="00-00000000-0"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-200 mb-1">Teléfono</label>
              <input 
                type="text" 
                required 
                value={newClient.phone}
                onChange={e => setNewClient({...newClient, phone: e.target.value})}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white text-slate-900 focus:ring-2 focus:ring-energen-orange outline-none placeholder:text-slate-400"
                placeholder="11 1234 5678"
              />
            </div>
            <button 
                type="submit" 
                disabled={loading}
                className="bg-energen-orange text-white font-bold py-2 px-4 rounded hover:bg-orange-700 transition shadow-md"
            >
                {loading ? '...' : 'Guardar'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 col-span-full text-center py-10">No hay clientes cargados.</p>
        ) : (
            clients.map(client => (
            <div key={client.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition relative group">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Building className="w-4 h-4 text-energen-orange" />
                            {client.name}
                        </h3>
                        <div className="mt-3 space-y-1">
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                <CreditCard className="w-3 h-3 text-slate-400" /> {client.cuit}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                <Phone className="w-3 h-3 text-slate-400" /> {client.phone}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => onDelete(client.id)}
                        className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 p-2"
                        title="Eliminar Cliente"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default GestorClientes;