import { useState, useCallback, useEffect } from 'react';
import {
  FormularioPosPagamento,
  DadosJornada,
  DadosValores,
  DadosTempo,
  defaultDadosJornada,
  defaultDadosValores,
  defaultDadosTempo,
} from '@/types/pos-pagamento';

export type EtapaFormulario = 'jornada' | 'valores' | 'tempo';

const STORAGE_KEY = 'rescisao-pos-pagamento-form';

export function usePosPagamentoForm() {
  const [etapaAtual, setEtapaAtual] = useState<EtapaFormulario>('jornada');
  
  const [formData, setFormData] = useState<FormularioPosPagamento>(() => {
    try {
      // Usar sessionStorage para consistência com o resto do sistema
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved form data:', e);
    }
    return {
      jornada: defaultDadosJornada,
      valores: defaultDadosValores,
      tempo: defaultDadosTempo,
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

  const updateJornada = useCallback(<K extends keyof DadosJornada>(
    field: K,
    value: DadosJornada[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      jornada: { ...prev.jornada, [field]: value },
    }));
  }, []);

  const updateValores = useCallback(<K extends keyof DadosValores>(
    field: K,
    value: DadosValores[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      valores: { ...prev.valores, [field]: value },
    }));
  }, []);

  const updateTempo = useCallback(<K extends keyof DadosTempo>(
    field: K,
    value: DadosTempo[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      tempo: { ...prev.tempo, [field]: value },
    }));
  }, []);

  const proximaEtapa = useCallback(() => {
    setEtapaAtual(prev => {
      if (prev === 'jornada') return 'valores';
      if (prev === 'valores') return 'tempo';
      return prev;
    });
  }, []);

  const etapaAnterior = useCallback(() => {
    setEtapaAtual(prev => {
      if (prev === 'tempo') return 'valores';
      if (prev === 'valores') return 'jornada';
      return prev;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      jornada: defaultDadosJornada,
      valores: defaultDadosValores,
      tempo: defaultDadosTempo,
    });
    setEtapaAtual('jornada');
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const isEtapaValida = useCallback((etapa: EtapaFormulario): boolean => {
    switch (etapa) {
      case 'jornada':
        return !!(
          formData.jornada.horarioContratado &&
          formData.jornada.horarioRealMedio &&
          formData.jornada.diasTrabalhadosPorSemana > 0
        );
      case 'valores':
        return true; // Valores são opcionais
      case 'tempo':
        return !!(
          formData.tempo.mesesTrabalhadosAnoRescisao > 0 &&
          formData.tempo.avisoPrevioConfirmado
        );
      default:
        return false;
    }
  }, [formData]);

  return {
    formData,
    etapaAtual,
    setEtapaAtual,
    updateJornada,
    updateValores,
    updateTempo,
    proximaEtapa,
    etapaAnterior,
    resetForm,
    isEtapaValida,
  };
}
