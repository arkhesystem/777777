import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, AlertTriangle, UserPlus, LogIn, Settings } from 'lucide-react';
import { supabase, isConfigured } from '../supabaseClient';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('energen.adm@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Check configuration on mount
  useEffect(() => {
    if (!isConfigured) {
      setErrorMsg('Faltan las credenciales de Supabase. Por favor configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tus variables de entorno.');
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
        setErrorMsg('Error de configuración: No se puede conectar a la base de datos.');
        return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: email.split('@')[0],
                    }
                }
            });
            if (error) throw error;
            if (data.user) {
                setSuccessMsg('Usuario creado exitosamente. Ya puedes iniciar sesión.');
                setIsSignUp(false);
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
        }
    } catch (error: any) {
        console.error(error);
        setErrorMsg(error.message || 'Error de autenticación.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 bg-energen-orange text-white text-center">
            <div className="mx-auto flex items-center justify-center mb-4">
                <img 
                  src="https://storage.googleapis.com/msgsndr/W7R1X8YOEgKpF0ad1L2W/media/6882c991bfd98750b2523a14.png" 
                  alt="EnerGen Logo" 
                  className="h-24 w-auto object-contain bg-white/10 rounded-lg p-2"
                />
            </div>
            <h1 className="text-2xl font-bold">EnerGen Finanzas</h1>
            <p className="text-white/80 text-sm mt-1">{isSignUp ? 'Crear Cuenta' : 'Acceso Seguro'}</p>
        </div>
        
        <div className="p-8">
            {!isConfigured && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
                    <Settings className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-red-800 text-sm">Configuración Requerida</h3>
                        <p className="text-red-700 text-xs mt-1">
                            La app no detecta las claves de Supabase.
                            <br/><br/>
                            <strong>Si estás en Vercel:</strong> Asegúrate de agregar las variables <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.
                        </p>
                    </div>
                </div>
            )}

            {errorMsg && isConfigured && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}
            {successMsg && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2 border border-green-100">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{successMsg}</span>
                </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">Email Corporativo</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-energen-orange focus:border-transparent outline-none text-black bg-white"
                        placeholder="admin@energen.com"
                        required
                        disabled={!isConfigured}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-900 mb-1">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-energen-orange focus:border-transparent outline-none text-black bg-white"
                            placeholder="••••••••"
                            required
                            disabled={!isConfigured}
                        />
                    </div>
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !isConfigured}
                    className="w-full bg-energen-black text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Procesando...' : (
                        <>
                           {isSignUp ? 'Registrarse' : 'Ingresar'} 
                           <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center border-t border-slate-100 pt-4">
                <button 
                    type="button"
                    onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-sm text-energen-orange hover:text-orange-700 font-semibold flex items-center justify-center gap-1 mx-auto"
                >
                    {isSignUp ? (
                        <><LogIn className="w-4 h-4" /> Volver al Login</>
                    ) : (
                        <><UserPlus className="w-4 h-4" /> Crear cuenta nueva</>
                    )}
                </button>
                <p className="text-xs text-slate-400 mt-2">
                    {isSignUp 
                        ? 'Crea tu usuario para acceder al sistema.' 
                        : 'Sistema protegido. Gestión de accesos vía Supabase.'
                    }
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;