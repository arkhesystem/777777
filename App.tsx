import React, { useState, useEffect } from 'react';
import EstadisticasFinanzas from './components/EstadisticasFinanzas';
import FormularioTransaccion from './components/FormularioTransaccion';
import ListaTransacciones from './components/ListaTransacciones';
import GestorClientes from './components/GestorClientes';
import Login from './components/Login';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Client, Transaction } from './types';
import * as DataService from './services/dataService';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import { LayoutDashboard, PlusCircle, Users, LogOut, Sun, Moon } from 'lucide-react';

// --- MAIN LAYOUT COMPONENT (INTEGRATED) ---
interface MainLayoutProps {
  children: React.ReactNode;
  currentView: 'DASHBOARD' | 'NEW_TRANSACTION' | 'CLIENTS';
  onChangeView: (view: 'DASHBOARD' | 'NEW_TRANSACTION' | 'CLIENTS') => void;
  onLogout: () => void;
  userEmail: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentView, onChangeView, onLogout, userEmail }) => {
  const { theme, toggleTheme } = useTheme();
  
  const NavItem = ({ view, label, icon: Icon }: { view: 'DASHBOARD' | 'NEW_TRANSACTION' | 'CLIENTS', label: string, icon: any }) => (
    <button
      onClick={() => onChangeView(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        currentView === view 
          ? 'bg-energen-orange text-white font-bold shadow-md' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-energen-black text-white flex-col hidden md:flex sticky top-0 h-screen border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src="https://storage.googleapis.com/msgsndr/W7R1X8YOEgKpF0ad1L2W/media/6882c991bfd98750b2523a14.png" 
              alt="EnerGen Logo" 
              className="h-10 w-auto object-contain bg-white/5 rounded p-1"
            />
            <h1 className="text-xl font-bold tracking-tight text-white">EnerGen <span className="text-energen-orange">Ing</span></h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider pl-10">Finanzas</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem view="DASHBOARD" label="Tablero" icon={LayoutDashboard} />
          <NavItem view="NEW_TRANSACTION" label="Cargar Factura" icon={PlusCircle} />
          <NavItem view="CLIENTS" label="Clientes" icon={Users} />
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-4">
            <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg transition"
            >
                <span className="text-xs font-medium">Modo {theme === 'light' ? 'Día' : 'Noche'}</span>
                {theme === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-300" />}
            </button>

            <div className="flex items-center gap-3 px-4 pt-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600">
                    {userEmail.substring(0,2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate w-32" title={userEmail}>{userEmail}</p>
                    <p className="text-xs text-slate-500">Acceso Seguro</p>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-red-400 transition"
            >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
            </button>
        </div>
      </aside>

      {/* Header Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-energen-black z-50 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-2">
            <img 
              src="https://storage.googleapis.com/msgsndr/W7R1X8YOEgKpF0ad1L2W/media/6882c991bfd98750b2523a14.png" 
              alt="EnerGen Logo" 
              className="h-8 w-auto object-contain bg-white/10 rounded p-1"
            />
            <span className="font-bold text-white">EnerGen</span>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 text-slate-300">
                {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => onChangeView(currentView === 'NEW_TRANSACTION' ? 'DASHBOARD' : 'NEW_TRANSACTION')} className="text-white">
                <PlusCircle className="w-6 h-6 text-energen-orange" />
            </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-16 md:mt-0">
        <div className="max-w-6xl mx-auto pb-20 md:pb-0">
            {children}
        </div>
      </main>
      
      {/* Navegación Mobile Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-50">
        <button onClick={() => onChangeView('DASHBOARD')} className={`flex flex-col items-center ${currentView === 'DASHBOARD' ? 'text-energen-orange' : 'text-slate-500 dark:text-slate-400'}`}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px]">Inicio</span>
        </button>
        <button onClick={() => onChangeView('CLIENTS')} className={`flex flex-col items-center ${currentView === 'CLIENTS' ? 'text-energen-orange' : 'text-slate-500 dark:text-slate-400'}`}>
            <Users className="w-6 h-6" />
            <span className="text-[10px]">Clientes</span>
        </button>
        <button onClick={onLogout} className="flex flex-col items-center text-slate-500 dark:text-slate-400">
            <LogOut className="w-6 h-6" />
            <span className="text-[10px]">Salir</span>
        </button>
      </div>
    </div>
  );
};

// --- APP COMPONENT ---

type ViewState = 'DASHBOARD' | 'NEW_TRANSACTION' | 'CLIENTS';

const AppContent: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // 1. Session Check
  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch((err) => {
        console.warn("Error verificando sesión:", err);
        setSession(null);
      })
      .finally(() => {
        setCheckingSession(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCheckingSession(false); 
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Data Loading
  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
        const [txs, cls] = await Promise.all([
            DataService.getTransactions(),
            DataService.getClients()
        ]);
        setTransactions(txs);
        setClients(cls);
    } catch (e) {
        console.error("Failed to load data", e);
    } finally {
        setIsLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('DASHBOARD');
  };

  const handleSaveTransaction = async (data: any) => {
    await DataService.addTransaction(data);
    await loadData();
    setView('DASHBOARD');
  };

  const handleAddClient = async (client: any) => {
    await DataService.addClient(client);
    await loadData();
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm("¿Seguro desea eliminar este cliente? Esta acción es irreversible.")) {
        await DataService.deleteClient(id);
        await loadData();
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="text-slate-400 text-sm animate-pulse">Iniciando sistema...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  return (
    <MainLayout 
      currentView={view === 'NEW_TRANSACTION' ? 'NEW_TRANSACTION' : (view === 'CLIENTS' ? 'CLIENTS' : 'DASHBOARD')} 
      onChangeView={setView}
      onLogout={handleLogout}
      userEmail={session.user.email || 'Usuario'}
    >
      {view === 'DASHBOARD' && (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Resumen Financiero</h2>
                    <p className="text-slate-500 dark:text-slate-400">Estado actual de cobranzas y facturación.</p>
                </div>
                <button 
                    onClick={() => setView('NEW_TRANSACTION')}
                    className="w-full md:w-auto bg-energen-orange text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-orange-700 transition"
                >
                    + Nueva Factura
                </button>
            </div>
            
            {isLoadingData ? (
                <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-500">
                   <span className="animate-pulse">Sincronizando datos...</span>
                </div>
            ) : (
                <>
                    <EstadisticasFinanzas transactions={transactions} />
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 mt-8">Últimos Movimientos</h3>
                        <ListaTransacciones transactions={transactions} />
                    </div>
                </>
            )}
        </div>
      )}

      {view === 'NEW_TRANSACTION' && (
        <div className="animate-in slide-in-from-bottom-4 duration-300">
           <FormularioTransaccion 
             clients={clients} 
             onSave={handleSaveTransaction} 
             onCancel={() => setView('DASHBOARD')} 
           />
        </div>
      )}

      {view === 'CLIENTS' && (
        <div className="animate-in fade-in duration-500">
            <GestorClientes 
                clients={clients} 
                onAdd={handleAddClient} 
                onDelete={handleDeleteClient}
            />
        </div>
      )}
    </MainLayout>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;