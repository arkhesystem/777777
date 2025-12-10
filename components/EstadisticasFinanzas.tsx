import React, { useMemo, useState } from 'react';
import { Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, CreditCard, AlertCircle, Filter, CalendarDays } from 'lucide-react';

interface FinanceStatsProps {
  transactions: Transaction[];
}

type TimeFilter = 'WEEK' | 'MONTH' | 'ALL';

const EstadisticasFinanzas: React.FC<FinanceStatsProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<TimeFilter>('MONTH');
  
  // Filter Transactions logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
        const txDate = new Date(t.date);
        if (filter === 'ALL') return true;
        if (filter === 'MONTH') {
            return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        }
        if (filter === 'WEEK') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return txDate >= oneWeekAgo;
        }
        return true;
    });
  }, [transactions, filter]);

  const kpis = useMemo(() => {
    const total = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
    const now = new Date();
    // Checks that are pending future payment
    const pendingChecks = filteredTransactions
      .filter(t => (t.payment_method === 'CHEQUE' || t.payment_method === 'E_CHEQ') && t.check_payment_date && new Date(t.check_payment_date) > now)
      .reduce((acc, t) => acc + t.amount, 0);
      
    const collected = total - pendingChecks;

    return { total, collected, pendingChecks };
  }, [filteredTransactions]);

  const chartData = useMemo(() => {
    // Group by Date for Weekly/Monthly view, Group by Month for All view
    const data: Record<string, number> = {};
    
    filteredTransactions.forEach(t => {
      let key = '';
      const dateObj = new Date(t.date);
      
      if (filter === 'ALL') {
          key = dateObj.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' });
      } else {
          key = dateObj.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      }
      
      data[key] = (data[key] || 0) + t.amount;
    });

    return Object.keys(data).map(key => ({ name: key, monto: data[key] }));
  }, [filteredTransactions, filter]);

  return (
    <div className="space-y-6">
      
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Filter className="w-5 h-5 text-energen-orange" />
            <span className="font-bold text-slate-800 dark:text-white">Filtrar período:</span>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
            <button 
                onClick={() => setFilter('WEEK')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === 'WEEK' ? 'bg-white dark:bg-slate-700 text-energen-orange shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
            >
                Esta Semana
            </button>
            <button 
                onClick={() => setFilter('MONTH')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === 'MONTH' ? 'bg-white dark:bg-slate-700 text-energen-orange shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
            >
                Este Mes
            </button>
            <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${filter === 'ALL' ? 'bg-white dark:bg-slate-700 text-energen-orange shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
            >
                Histórico
            </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-l-4 border-energen-orange flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total Facturado</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">${kpis.total.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-slate-700 rounded-full">
            <TrendingUp className="w-8 h-8 text-energen-orange" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-l-4 border-emerald-500 flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cobrado Real</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">${kpis.collected.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-slate-700 rounded-full">
            <CreditCard className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-l-4 border-slate-500 flex items-center justify-between transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cheques Diferidos</p>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">${kpis.pendingChecks.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full">
            <AlertCircle className="w-8 h-8 text-slate-600 dark:text-slate-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-96 transition-colors">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-energen-orange" />
                Evolución de Ingresos ({filter === 'ALL' ? 'Mensual' : 'Diaria'})
            </h3>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.3} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 500}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `$${val/1000}k`} />
            <Tooltip 
              cursor={{fill: 'rgba(234, 88, 12, 0.1)'}}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#1e293b', color: '#fff' }} 
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monto']}
            />
            <Bar dataKey="monto" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EstadisticasFinanzas;