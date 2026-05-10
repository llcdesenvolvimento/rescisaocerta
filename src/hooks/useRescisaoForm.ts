import { useState, useEffect, useCallback } from 'react';
import { FormData } from '@/types/rescisao';

const STORAGE_KEY = 'rescisao-calculator-form';
const SESSION_KEY = 'rescisao-session-active';

const defaultFormData: FormData = {
  // Bloco 1 - Dados do Contrato
  situacaoAtual: '',
  objetivo: '',
  tipoDesligamento: '',
  dataAdmissao: '',
  dataDesligamento: '',
  aindaTrabalhando: false,
  salarioFixo: 0,
  mediaVariavel: 0,
  temVariavel: false,
  
  // Bloco 2 - Verbas Rescisórias (2026)
  // Usar -1 para indicar "não selecionado" nos campos numéricos com Select
  periodosFeriasVencidas: -1,
  mesesDesdeUltimaFerias: -1,
  mesesTrabalhados2026: 0,
  tipoAvisoPrevio: '',
  anosServico: 0,
  saldoFGTS: 0,
  sabeSaldoFGTS: undefined as unknown as boolean, // undefined = não selecionado
  numDependentes: -1,
  
  // Bloco 3 - Detecção de oportunidade + detalhamento
  faziaHorasExtras: '',
  bancoHoras: '',
  controlePonto: '',
  exerciaFuncoesDiferentes: '',
  funcoesDiferentes: '',
  diferencaSalarialEstimada: 0,
  valorPorFora: '',
  valorPorForaMensal: 0,
  adicionaisTrabalho: [],
  recebiaAdicionalNoturno: '',
  horasNoturnasSemana: '',
  grauInsalubridade: '',
  recebiaInsalubridade: '',
  recebiaPericulosidade: '',
  erroNaRescisao: '',
};

export function useRescisaoForm() {
  const [formData, setFormData] = useState<FormData>(() => {
    // Verificar se há uma etapa salva (usuário voltando da página de resultado)
    const savedStep = sessionStorage.getItem("rescisao-current-step");
    
    // Se está voltando do resultado, preservar os dados
    if (savedStep) {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Error loading form data:', e);
      }
    }
    
    // Caso contrário, limpar e começar do zero
    sessionStorage.removeItem(STORAGE_KEY);
    return defaultFormData;
  });

  // Salvar no sessionStorage quando mudar
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Error saving form data:', e);
    }
  }, [formData]);

  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    formData,
    updateField,
    resetForm,
  };
}
