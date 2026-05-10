import { useEffect, useState } from 'react';
import { FormularioPosPagamentoV2 } from '@/components/pos-pagamento-v2';
import { DadosFluxoAnterior } from '@/types/pos-pagamento-v2';
import { useNavigate } from 'react-router-dom';
import { FormData } from '@/types/rescisao';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

const STORAGE_KEY = 'rescisao-calculator-form';

// Mapear frequência para labels amigáveis
function mapFrequencia(valor: string): string {
  const map: Record<string, string> = {
    'sempre': 'Sempre',
    'quase_sempre': 'Quase sempre',
    'vez_em_quando': 'De vez em quando',
    'raramente': 'Raramente',
    'nao_fazia': 'Nunca',
    '': 'Nunca',
  };
  return map[valor] || valor;
}

// Mapear adicionais para labels amigáveis
function mapAdicionais(adicionais: string[]): string[] {
  const map: Record<string, string> = {
    'periculosidade': 'Periculosidade',
    'insalubridade': 'Insalubridade',
    'trabalho_noturno': 'Trabalho noturno',
    'nenhum': 'Nenhum desses',
  };
  return adicionais.map(a => map[a] || a);
}

// Mapear sim/não
function mapSimNao(valor: string): string {
  return valor === 'sim' ? 'Sim' : 'Não';
}

export default function PosPagamentoV2() {
  const navigate = useNavigate();
  const [dadosFluxoAnterior, setDadosFluxoAnterior] = useState<DadosFluxoAnterior | null>(null);

  // Google Ads conversion tracking
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-16527190384/3YgMCNuUhtYZEPDS48g9',
        'value': 1.0,
        'currency': 'BRL',
        'transaction_id': ''
      });
    }
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      const valorBaseStr = sessionStorage.getItem('rescisao-valor-base-original');
      
      if (saved) {
        const formData: FormData = JSON.parse(saved);
        const valorBase = valorBaseStr ? parseFloat(valorBaseStr) : 0;
        
        // Converter FormData para DadosFluxoAnterior
        const dados: DadosFluxoAnterior = {
          salarioBrutoMensal: formData.salarioFixo + (formData.temVariavel ? formData.mediaVariavel : 0),
          dataAdmissao: formData.dataAdmissao,
          dataDesligamento: formData.dataDesligamento,
          motivoRescisao: formData.tipoDesligamento,
          dependentes: formData.numDependentes >= 0 ? formData.numDependentes : 0,
          saldoFGTS: formData.saldoFGTS || 0,
          freqHorasExtras: mapFrequencia(formData.faziaHorasExtras),
          desvioFuncaoFreq: mapFrequencia(formData.funcoesDiferentes),
          pagamentoPorFora: mapSimNao(formData.valorPorFora),
          adicionaisSelecionados: mapAdicionais(formData.adicionaisTrabalho || []),
          suspeitaErroEmpregador: formData.erroNaRescisao === 'sim' || formData.erroNaRescisao === 'talvez' ? 'Sim' : 'Não',
          totalBasico: valorBase,
        };
        
        setDadosFluxoAnterior(dados);
      } else {
        navigate('/');
      }
    } catch {
      navigate('/');
    }
  }, [navigate]);

  const handleVoltar = () => {
    navigate('/resultado');
  };

  if (!dadosFluxoAnterior) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header fixo */}
      <header className="sticky top-0 z-50 bg-primary shadow-lg">
        <div className="container mx-auto px-4 h-16 sm:h-18 flex items-center justify-center">
          <Logo variant="light" size="md" />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 py-8 px-4">
        <FormularioPosPagamentoV2 
          dadosFluxoAnterior={dadosFluxoAnterior} 
          onVoltar={handleVoltar} 
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
