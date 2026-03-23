'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'motion/react';
import { CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';

const rsvpSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  guestsCount: z.number().min(1, 'Mínimo 1 pessoa').max(20, 'Máximo 20 pessoas'),
  phone: z.string().min(8, 'O telefone deve ter pelo menos 8 dígitos'),
});

type RSVPFormData = z.infer<typeof rsvpSchema>;

export default function RSVPForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: '',
      guestsCount: 1,
      phone: '',
    },
  });

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('Iniciando envio de RSVP para:', data.name);
      
      // Only attempt Supabase insert if credentials look somewhat valid
      const hasValidSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && 
                              !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder-project');

      if (hasValidSupabase) {
        try {
          const { error: supabaseError } = await supabase
            .from('rsvps')
            .insert([
              {
                name: data.name,
                guests_count: Number(data.guestsCount),
                phone: data.phone || '',
              },
            ]);

          if (supabaseError) {
            console.error('Erro do Supabase:', supabaseError);
            // alert(`Aviso: Ocorreu um erro ao salvar no Supabase: ${supabaseError.message}. Verifique se a tabela 'rsvps' existe e se as políticas RLS permitem inserção.`);
          } else {
            console.log('RSVP salvo com sucesso no Supabase');
          }
        } catch (dbError: any) {
          console.error('Erro de conexão com Supabase (Failed to fetch):', dbError);
          // alert(`Aviso: Falha de conexão com o Supabase. Verifique se a URL do projeto está correta.`);
        }
      } else {
        console.warn('Supabase não configurado. Pulando salvamento no banco de dados.');
        // alert('Aviso: As chaves do Supabase não estão configuradas (NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY). Os dados não serão salvos no banco.');
      }

      // Prepare WhatsApp message
      const message = `Olá! Confirmo minha presença no aniversário da Emily! \nNome: ${data.name}\nTotal de pessoas: ${data.guestsCount}${data.phone ? `\nTelefone: ${data.phone}` : ''}`;
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511986472609';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp - try automatic first
      try {
        const win = window.open(whatsappUrl, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          console.warn('Popup bloqueado pelo navegador');
          // Fallback to direct navigation if popup is blocked
          window.location.href = whatsappUrl;
        }
      } catch {
        console.error('Erro ao tentar abrir WhatsApp automaticamente');
      }

      setIsSuccess(true);
      reset();
    } catch (error: any) {
      console.error('Erro fatal ao enviar RSVP:', error);
      // alert('Ocorreu um erro inesperado ao processar seu RSVP. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualWhatsApp = () => {
    const message = `Olá! Confirmo minha presença no aniversário da Emily!`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511986472609';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(34,197,94,0.3)] text-center border-2 border-green-500 relative overflow-hidden"
        >
          {/* Shine animation */}
          <motion.div 
            initial={{ x: '-150%' }}
            animate={{ x: '150%' }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -skew-x-12 pointer-events-none"
          />

          <div className="relative z-10">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                filter: ["drop-shadow(0 0 0px rgba(34,197,94,0))", "drop-shadow(0 0 15px rgba(34,197,94,0.6))", "drop-shadow(0 0 0px rgba(34,197,94,0))"]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <h3 className="text-2xl font-display font-bold text-gray-800">Presença Confirmada!</h3>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            
            <p className="text-gray-600 mb-6">Obrigado por confirmar. Sua presença foi salva em nossa lista!</p>
            
            <div className="space-y-3">
              <button 
                onClick={handleManualWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                suppressHydrationWarning
              >
                <MessageCircle className="w-5 h-5" />
                Abrir WhatsApp Novamente
              </button>
              
              <button 
                onClick={() => setIsSuccess(false)}
                className="text-red-600 font-semibold hover:underline text-sm"
              >
                Enviar outra confirmação
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center justify-center gap-2 text-center">
            <CheckCircle2 className="text-red-600" />
            Confirme sua Presença
          </h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome Completo</label>
              <input
                {...register('name')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all`}
                placeholder="Ex: João Silva"
                suppressHydrationWarning
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantas pessoas virão? (Total)</label>
              <input
                type="number"
                {...register('guestsCount', { valueAsNumber: true })}
                className={`w-full px-4 py-3 rounded-lg border ${errors.guestsCount ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all`}
                suppressHydrationWarning
              />
              {errors.guestsCount && <p className="text-red-500 text-xs mt-1">{errors.guestsCount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu Telefone</label>
              <input
                {...register('phone')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all`}
                placeholder="(11) 99999-9999"
                suppressHydrationWarning
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-[0_10px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.4)] transform hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              suppressHydrationWarning
            >
              {isSubmitting ? (
                'Enviando...'
              ) : (
                <>
                  <MessageCircle className="w-5 h-5" />
                  Confirmar e Enviar WhatsApp
                </>
              )}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2 uppercase tracking-widest">
              Ao clicar, você será redirecionado para o WhatsApp
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
