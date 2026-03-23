'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Users, LogOut, Lock, ShieldAlert } from 'lucide-react';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "dgoncalves@hotmail.com.br";

interface AdminDashboardProps {
  onBack?: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [rsvps, setRsvps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      const fetchRsvps = async () => {
        const { data, error } = await supabase
          .from('rsvps')
          .select('*')
          .order('timestamp', { ascending: false });

        if (error) {
          console.error("Erro ao carregar RSVPs:", error);
          let msg = "Erro ao carregar dados. Verifique suas permissões.";
          if (error.message?.includes('Failed to fetch')) {
            msg = "Erro de conexão com o Supabase. Verifique se a URL está correta.";
          }
          setError(msg);
        } else {
          setRsvps(data || []);
          setError(null);
        }
      };

      fetchRsvps();

      // Real-time subscription
      const channel = supabase
        .channel('public:rsvps')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'rsvps' }, () => {
          fetchRsvps();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Erro no login:", err);
    }
  };

  const handleLogout = () => supabase.auth.signOut();

  const totalGuests = rsvps.reduce((sum, rsvp) => sum + Number(rsvp.guests_count || 0), 0);

  if (loading) return <div className="p-8 text-center text-white">Carregando...</div>;

  // Check for placeholder credentials
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder-project') || 
      !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="max-w-md mx-auto p-8 bg-amber-50 rounded-2xl shadow-xl text-center border border-amber-200">
        <ShieldAlert className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-4 text-amber-800">Configuração Necessária</h2>
        <p className="text-amber-700 mb-6">
          As chaves do Supabase não foram configuradas. Por favor, adicione 
          <strong> NEXT_PUBLIC_SUPABASE_URL</strong> e 
          <strong> NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> nas configurações do projeto.
        </p>
        <button onClick={onBack} className="text-amber-600 font-semibold underline">Voltar ao Convite</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl text-center border border-gray-200">
        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-4">Acesso Restrito</h2>
        <p className="text-gray-600 mb-6">Apenas o administrador pode ver a lista de convidados.</p>
        <button
          onClick={handleLogin}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 w-full mb-4"
          suppressHydrationWarning
        >
          Entrar com Google
        </button>
        <button onClick={onBack} className="text-gray-500 underline text-sm">Voltar ao Convite</button>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl text-center border border-red-200">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-4 text-red-600">Acesso Negado</h2>
        <p className="text-gray-600 mb-6">Seu e-mail ({user.email}) não tem permissão para acessar esta lista.</p>
        <div className="space-y-4">
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Conta não autorizada.
          </div>
          <button onClick={handleLogout} className="text-gray-500 underline text-sm block mx-auto">Sair da conta</button>
          <button onClick={onBack} className="text-gray-400 underline text-xs block mx-auto">Voltar ao Convite</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <button 
            onClick={onBack}
            className="text-red-600 font-bold text-sm mb-2 hover:underline flex items-center gap-1"
          >
            ← Voltar ao Convite
          </button>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="text-red-600" />
            Lista de Convidados
          </h2>
          <p className="text-gray-500">Total de {rsvps.length} confirmações | {totalGuests} pessoas no total</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors bg-gray-100 px-4 py-2 rounded-lg"
          suppressHydrationWarning
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Nome</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Qtd</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Telefone</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {rsvps.map((rsvp, idx) => (
                  <motion.tr 
                    key={rsvp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800">{rsvp.name}</td>
                    <td className="p-4 text-gray-600">{rsvp.guests_count}</td>
                    <td className="p-4 text-gray-600">{rsvp.phone || '-'}</td>
                    <td className="p-4 text-xs text-gray-400" suppressHydrationWarning>
                      {rsvp.timestamp?.toDate ? rsvp.timestamp.toDate().toLocaleDateString('pt-BR') : 
                       rsvp.timestamp ? new Date(rsvp.timestamp).toLocaleDateString('pt-BR') : '-'}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {rsvps.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-400 italic">Nenhuma confirmação ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

