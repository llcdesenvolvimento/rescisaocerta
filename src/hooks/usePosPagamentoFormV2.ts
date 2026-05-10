import { useState, useCallback, useEffect } from 'react';
import {
  FormularioPosPagamentoV2,
  DadosJornadaV2,
  DadosAdicionaisV2,
  DadosValoresExtrasV2,
  defaultDadosJornadaV2,
  defaultDadosAdicionaisV2,
  defaultDadosValoresExtrasV2,
  DadosFluxoAnterior,
} from '@/types/pos-pagamento-v2';

export type EtapaFormularioV2 = 'jornada' | 'adicionais' | 'valores' | 'relatorio';

const STORAGE_KEY = 'rescisao-pos-pagamento-form-v2';

export function usePosPagamentoFormV2(dadosFluxoAnterior: DadosFluxoAnterior | null) {
  const [etapaAtual, setEtapaAtual] = useState<EtapaFormularioV2>('jornada');
  
  const [formData, setFormData] = useState<FormularioPosPagamentoV2>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved form data:', e);
    }
    return {
      jornada: defaultDadosJornadaV2,
      adicionais: defaultDadosAdicionaisV2,
      valoresExtras: defaultDadosValoresExtrasV2,
    };
  });

  // Salvar no sessionStorage sempre que formData mudar
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Error saving form data:', e);
    }
  }, [formData]);

  // Determinar quais etapas são necessárias
  const etapasNecessarias = useCallback((): EtapaFormularioV2[] => {
    const etapas: EtapaFormularioV2[] = ['jornada'];
    
    if (!dadosFluxoAnterior) return etapas;
    
    // Verificar se precisa da etapa de adicionais
    const temNoturno = dadosFluxoAnterior.adicionaisSelecionados.some(
      a => a.toLowerCase().includes('noturno')
    );
    const temPericulosidade = dadosFluxoAnterior.adicionaisSelecionados.some(
      a => a.toLowerCase().includes('periculosidade')
    );
    const temInsalubridade = dadosFluxoAnterior.adicionaisSelecionados.some(
      a => a.toLowerCase().includes('insalubridade')
    );
    
    if (temNoturno || temPericulosidade || temInsalubridade) {
      etapas.push('adicionais');
    }
    
    // Verificar se precisa da etapa de valores extras
    const temPorFora = dadosFluxoAnterior.pagamentoPorFora?.toLowerCase() === 'sim';
    const temDesvio = dadosFluxoAnterior.desvioFuncaoFreq?.toLowerCase() !== 'nunca' && 
                      dadosFluxoAnterior.desvioFuncaoFreq !== '';
    
    if (temPorFora || temDesvio) {
      etapas.push('valores');
    }
    
    etapas.push('relatorio');
    return etapas;
  }, [dadosFluxoAnterior]);

  const updateJornada = useCallback(<K extends keyof DadosJornadaV2>(
    field: K,
    value: DadosJornadaV2[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      jornada: { ...prev.jornada, [field]: value },
    }));
  }, []);

  const updateAdicionais = useCallback(<K extends keyof DadosAdicionaisV2>(
    field: K,
    value: DadosAdicionaisV2[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      adicionais: { ...prev.adicionais, [field]: value },
    }));
  }, []);

  const updateValoresExtras = useCallback(<K extends keyof DadosValoresExtrasV2>(
    field: K,
    value: DadosValoresExtrasV2[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      valoresExtras: { ...prev.valoresExtras, [field]: value },
    }));
  }, []);

  const proximaEtapa = useCallback(() => {
    const etapas = etapasNecessarias();
    const indexAtual = etapas.indexOf(etapaAtual);
    if (indexAtual < etapas.length - 1) {
      setEtapaAtual(etapas[indexAtual + 1]);
    }
  }, [etapaAtual, etapasNecessarias]);

  const etapaAnterior = useCallback(() => {
    const etapas = etapasNecessarias();
    const indexAtual = etapas.indexOf(etapaAtual);
    if (indexAtual > 0) {
      setEtapaAtual(etapas[indexAtual - 1]);
    }
  }, [etapaAtual, etapasNecessarias]);

  const irParaEtapa = useCallback((etapa: EtapaFormularioV2) => {
    setEtapaAtual(etapa);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      jornada: defaultDadosJornadaV2,
      adicionais: defaultDadosAdicionaisV2,
      valoresExtras: defaultDadosValoresExtrasV2,
    });
    setEtapaAtual('jornada');
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const isEtapaValida = useCallback((etapa: EtapaFormularioV2): boolean => {
    switch (etapa) {
      case 'jornada':
        return formData.jornada.cargaContratadaSemanaH > 0;
      case 'adicionais':
        return true; // Campos opcionais
      case 'valores':
        return true; // Campos opcionais
      case 'relatorio':
        return true;
      default:
        return false;
    }
  }, [formData]);

  return {
    formData,
    etapaAtual,
    setEtapaAtual,
    etapasNecessarias,
    updateJornada,
    updateAdicionais,
    updateValoresExtras,
    proximaEtapa,
    etapaAnterior,
    irParaEtapa,
    resetForm,
    isEtapaValida,
  };
}
