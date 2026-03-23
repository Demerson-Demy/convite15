'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Convite Emily 14 - SPFC',
      text: 'Você foi convocado para o aniversário da Emily! Confira os detalhes aqui:',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar link:', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-full font-bold hover:bg-zinc-800 transition-all shadow-lg border border-white/10 group"
      suppressHydrationWarning
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center gap-2"
          >
            <Check className="w-5 h-5 text-green-400" />
            <span>Link Copiado!</span>
          </motion.div>
        ) : (
          <motion.div
            key="share"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Compartilhar Convite</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
