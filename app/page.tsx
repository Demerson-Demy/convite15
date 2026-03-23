'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { MapPin, Calendar, Clock, Waves, Utensils, ShieldCheck, Settings, Bell } from 'lucide-react';
import RSVPForm from '@/components/RSVPForm';
import AdminDashboard from '@/components/AdminDashboard';
import Countdown from '@/components/Countdown';
import ShareButton from '@/components/ShareButton';

export default function Page() {
  const [view, setView] = useState<'invite' | 'admin'>('invite');

  useEffect(() => {
    console.log('Page mounted');
  }, []);

  return (
    <main className="min-h-screen relative font-sans selection:bg-red-200 overflow-x-hidden bg-zinc-950 antialiased">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Navigation for Admin Toggle (Subtle) */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => setView(view === 'invite' ? 'admin' : 'invite')}
          className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl hover:bg-white transition-all text-gray-500 hover:text-red-600 border border-white/20 group"
          title={view === 'invite' ? 'Área do Administrador' : 'Voltar para o Convite'}
          suppressHydrationWarning
        >
          {view === 'invite' ? <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" /> : <ShieldCheck className="w-6 h-6" />}
        </button>
      </div>

      {view === 'invite' ? (
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
          {/* Hero Section */}
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl border-t-8 border-red-600 border-b-8 border-black overflow-hidden">
            {/* Background Image for the Card Content */}
            <div className="absolute inset-0 z-0 opacity-[0.08]">
              <Image 
                src="https://picsum.photos/seed/spfc/1920/1080" 
                alt="Estádio"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Football Field Hero Image */}
            <div className="relative h-48 md:h-64 w-full overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2000&auto=format&fit=crop"
                alt="Campo de Futebol"
                fill
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
            </div>

            <div className="relative p-8 md:p-16 pt-8 md:pt-10 text-center">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(255,0,0,0.05)_20px,rgba(255,0,0,0.05)_40px)]"></div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-red-600 font-display font-black text-xl md:text-2xl tracking-[0.3em] uppercase mb-2">
                  Convocação Tricolor
                </h2>
                <h1 className="text-4xl md:text-7xl font-display font-black text-gray-900 mb-6 leading-tight">
                  EMILY <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-zinc-800 to-gray-600">
                    14 ANOS
                  </span>
                </h1>
                
                <div className="flex flex-wrap justify-center gap-6 text-gray-600 font-medium mb-10">
                  <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                    <Calendar className="w-5 h-5 text-red-600" />
                    <span>Domingo, 5 de Abril</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                    <Clock className="w-5 h-5 text-red-600" />
                    <span>A partir das 12h</span>
                  </div>
                </div>

                <div className="mb-8">
                  <button 
                    onClick={() => {
                      const event = {
                        title: 'Aniversário da Emily - 14 Anos',
                        details: 'Festa de aniversário da Emily com tema SPFC. Local: Jorge Alves Brawn, 85 - Indaiatuba-SP',
                        location: 'Jorge Alves Brawn, 85, Bela Vista, Indaiatuba-SP',
                        start: '20260405T120000',
                        end: '20260405T200000'
                      };
                      const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}&dates=${event.start}/${event.end}`;
                      window.open(googleUrl, '_blank');
                    }}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                    suppressHydrationWarning
                  >
                    <Bell className="w-3 h-3" />
                    Adicionar ao meu Calendário
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Countdown Section */}
          <div className="mt-12 mb-12">
            <h3 className="text-center text-white/40 font-display font-bold text-sm uppercase tracking-[0.4em] mb-6">
              Faltam apenas:
            </h3>
            <Countdown targetDate="2026-04-05T12:00:00" />
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {/* Details Card */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg border border-white/20"
            >
              <h3 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-red-600" />
                Local da Partida
              </h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Jorge Alves Brawn, 85 <br />
                Bela Vista - Indaiatuba-SP
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-50 p-3 rounded-2xl">
                    <Utensils className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Kit Churrasco</h4>
                    <p className="text-sm text-gray-500">Pedimos a gentileza de trazer seu kit churrasco (carne e bebida de sua preferência).</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-2xl">
                    <Waves className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Liberado Piscina</h4>
                    <p className="text-sm text-gray-500">Não esqueça sua roupa de banho e toalha!</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RSVP Form */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <RSVPForm />
            </motion.div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-center space-y-8">
            <div className="flex justify-center">
              <ShareButton />
            </div>
            <p className="text-white font-bold text-sm uppercase tracking-widest drop-shadow-md">
              #Emily14 #SPFC #FutebolParty
            </p>
          </footer>
        </div>
      ) : (
        <div className="py-20">
          <AdminDashboard onBack={() => setView('invite')} />
        </div>
      )}
    </main>
  );
}
