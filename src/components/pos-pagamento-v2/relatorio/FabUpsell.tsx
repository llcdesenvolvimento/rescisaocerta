import { useEffect, useState } from 'react';
import { Sparkles, ArrowDown } from 'lucide-react';

/**
 * Botão flutuante que aparece enquanto o usuário lê o relatório
 * e leva direto para a seção de upsells (#upsells).
 *
 * Comportamento:
 *  - Mostra após o usuário rolar 300px (passa da capa).
 *  - Esconde quando a seção de upsells já está visível na tela
 *    (evita poluir quando ele já chegou lá).
 */
export function FabUpsell() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      const upsellsEl = document.getElementById('upsells');
      const upsellsVisible = upsellsEl
        ? upsellsEl.getBoundingClientRect().top < window.innerHeight - 100
        : false;
      // Aparece desde o início; só some quando a seção de upsells entra na tela.
      setVisible(!upsellsVisible);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  const handleClick = () => {
    const el = document.getElementById('upsells');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className={`fixed z-50 bottom-5 left-1/2 -translate-x-1/2 sm:bottom-7
        transition-all duration-300 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
      `}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label="Veja o que falta fazer"
        className="flex items-center gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5
          rounded-full shadow-xl shadow-primary/30
          bg-primary text-primary-foreground
          font-bold text-sm sm:text-base whitespace-nowrap
          transition-transform duration-200 ease-out
          hover:scale-105 hover:shadow-2xl hover:shadow-primary/40
          active:scale-95"
      >
        <span className="relative flex w-5 h-5 items-center justify-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white/40 animate-ping" />
          <Sparkles className="relative w-4 h-4" strokeWidth={2.5} />
        </span>
        Veja o que falta fazer
        <ArrowDown className="w-3.5 h-3.5 opacity-80" strokeWidth={2.5} />
      </button>
    </div>
  );
}
