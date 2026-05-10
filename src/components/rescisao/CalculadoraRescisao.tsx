import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  FileText,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Zap,
  Clock,
  Briefcase,
  CheckCircle,
} from "lucide-react";

import { useRescisaoForm } from "@/hooks/useRescisaoForm";
import { calcularRescisaoCompleta } from "@/lib/calculadora-rescisao-completa";

import { FormSection } from "./FormSection";
import { CurrencyInput } from "./CurrencyInput";
import { MaskedDateInput } from "./MaskedDateInput";
import { StepperProgress } from "./StepperProgress";
import { cn } from "@/lib/utils";
import { CalculationLoader } from "./CalculationLoader";
import {
  TipoDesligamento,
  TipoAvisoPrevio,
  StatusFeriasVencidas,
  OpcaoSimNao,
  AdicionalTrabalho,
  OpcaoErroRescisao,
  FrequenciaHorasExtras,
} from "@/types/rescisao";

const tiposDesligamento: { value: TipoDesligamento; label: string }[] = [
  { value: "demissao_sem_justa_causa", label: "Demissão sem justa causa" },
  { value: "justa_causa", label: "Demissão por justa causa" },
  { value: "pedido_demissao", label: "Pedido de demissão" },
  { value: "acordo", label: "Demissão por acordo" },
  { value: "termino_contrato", label: "Término de contrato (prazo)" },
];

const tiposAvisoPrevio: { value: TipoAvisoPrevio; label: string }[] = [
  { value: "trabalhado", label: "Trabalhado" },
  { value: "indenizado", label: "Indenizado" },
  { value: "nao_cumprido", label: "Não cumprido" },
  { value: "metade", label: "Metade (acordo)" },
  { value: "nao_se_aplica", label: "Não se aplica" },
];

const periodosFerias = [
  { value: 0, label: "Não, estou com as férias em dia" },
  { value: 1, label: "Sim, tenho 1 período de férias que não tirei" },
  { value: 2, label: "Sim, tenho 2 ou mais períodos acumulados" },
];

const mesesDesdeFerias = [
  { value: 0, label: "Menos de 1 mês" },
  { value: 1, label: "1 mês" },
  { value: 2, label: "2 meses" },
  { value: 3, label: "3 meses" },
  { value: 4, label: "4 meses" },
  { value: 5, label: "5 meses" },
  { value: 6, label: "6 meses" },
  { value: 7, label: "7 meses" },
  { value: 8, label: "8 meses" },
  { value: 9, label: "9 meses" },
  { value: 10, label: "10 meses" },
  { value: 11, label: "11 meses" },
  { value: 12, label: "12 meses ou mais" },
];

const dependentesOptions = [
  { value: 0, label: "Nenhum" },
  { value: 1, label: "1 dependente" },
  { value: 2, label: "2 dependentes" },
  { value: 3, label: "3 dependentes" },
  { value: 4, label: "4 dependentes" },
  { value: 5, label: "5 dependentes" },
  { value: 6, label: "6 dependentes" },
  { value: 7, label: "7 dependentes" },
  { value: 8, label: "8 dependentes" },
  { value: 9, label: "9 dependentes" },
  { value: 10, label: "10 ou mais" },
];

const frequenciasHorasExtras: { value: FrequenciaHorasExtras; label: string }[] = [
  { value: "sempre", label: "Sempre" },
  { value: "quase_sempre", label: "Quase sempre" },
  { value: "vez_em_quando", label: "De vez em quando" },
  { value: "raramente", label: "Raramente" },
  { value: "nao_fazia", label: "Nunca" },
];

const opcoesSimNao: { value: OpcaoSimNao; label: string }[] = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
];

const adicionaisTrabalho: { value: AdicionalTrabalho; label: string }[] = [
  { value: "periculosidade", label: "Periculosidade" },
  { value: "insalubridade", label: "Insalubridade" },
  { value: "trabalho_noturno", label: "Trabalho noturno" },
  { value: "nenhum", label: "Nenhum desses" },
];

const opcoesErroRescisao: { value: OpcaoErroRescisao; label: string }[] = [
  { value: "sim", label: "Sim" },
  { value: "talvez", label: "Talvez" },
  { value: "nao", label: "Não" },
  { value: "nao_sei_avaliar", label: "Não sei avaliar" },
];

const steps = [
  { number: 1, label: "Contrato" },
  { number: 2, label: "Verbas" },
  { number: 3, label: "Oportunidade" },
];

export function CalculadoraRescisao() {
  const navigate = useNavigate();
  const { formData, updateField, resetForm } = useRescisaoForm();
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentStep, setCurrentStep] = useState(() => {
    // Verificar se há uma etapa salva (voltando da página de resultado)
    const savedStep = sessionStorage.getItem("rescisao-current-step");
    if (savedStep) {
      sessionStorage.removeItem("rescisao-current-step");
      return parseInt(savedStep, 10);
    }
    return 1;
  });
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(() => {
    const scrollFlag = sessionStorage.getItem("rescisao-scroll-to-bottom");
    if (scrollFlag) {
      sessionStorage.removeItem("rescisao-scroll-to-bottom");
      return true;
    }
    return false;
  });

  // Scroll para a última pergunta do formulário quando voltar da página de resultado
  useEffect(() => {
    if (shouldScrollToBottom && currentStep === 3) {
      setShouldScrollToBottom(false);
      setTimeout(() => {
        // Encontrar a última seção de pergunta (erro na rescisão) e rolar até ela
        const lastFormSection = document.querySelector('[data-last-question="true"]');
        if (lastFormSection) {
          const headerHeight = 100;
          const elementPosition = lastFormSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - headerHeight, behavior: "smooth" });
        } else {
          // Fallback: rolar até o botão de calcular
          const calculateButton = document.querySelector('[data-calculate-button="true"]');
          if (calculateButton) {
            const headerHeight = 150;
            const elementPosition = calculateButton.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - headerHeight, behavior: "smooth" });
          }
        }
      }, 200);
    }
  }, [shouldScrollToBottom, currentStep]);
  const [showValidationError, setShowValidationError] = useState(false);

  const resultado = useMemo(() => {
    if (!formData.salarioFixo || !formData.dataAdmissao || !formData.dataDesligamento || !formData.tipoDesligamento) {
      return null;
    }
    return calcularRescisaoCompleta(formData);
  }, [formData]);

  // Validação de data: desligamento deve ser maior que admissão
  // As datas estão em formato ISO (YYYY-MM-DD)
  const isDataDesligamentoValida = useMemo(() => {
    if (!formData.dataAdmissao || !formData.dataDesligamento) return true;
    const dataAdm = new Date(formData.dataAdmissao);
    const dataDes = new Date(formData.dataDesligamento);
    return dataDes > dataAdm;
  }, [formData.dataAdmissao, formData.dataDesligamento]);

  // Calcular automaticamente anos de serviço e meses de 2026
  // As datas estão em formato ISO (YYYY-MM-DD)
  useEffect(() => {
    if (formData.dataAdmissao && formData.dataDesligamento) {
      const dataAdm = new Date(formData.dataAdmissao);
      const dataDes = new Date(formData.dataDesligamento);
      
      const anoAdm = dataAdm.getFullYear();
      const mesAdm = dataAdm.getMonth();
      const diaAdm = dataAdm.getDate();
      const anoDes = dataDes.getFullYear();
      const mesDes = dataDes.getMonth();
      const diaDes = dataDes.getDate();
      
      // Calcular anos completos de serviço
      let anos = anoDes - anoAdm;
      if (mesDes < mesAdm || (mesDes === mesAdm && diaDes < diaAdm)) {
        anos--;
      }
      updateField('anosServico', Math.max(0, anos));
      
      // Calcular meses trabalhados em 2026 (com >15 dias)
      if (anoDes === 2026 || anoAdm === 2026) {
        let meses2026 = 0;
        const anoReferencia = 2026;
        
        for (let mes = 0; mes < 12; mes++) {
          const inicioMes = new Date(anoReferencia, mes, 1);
          const fimMes = new Date(anoReferencia, mes + 1, 0);
          
          // Verificar se o mês está dentro do período de trabalho
          if (inicioMes <= dataDes && fimMes >= dataAdm) {
            // Calcular dias trabalhados neste mês
            const inicioTrabMes = dataAdm > inicioMes ? dataAdm : inicioMes;
            const fimTrabMes = dataDes < fimMes ? dataDes : fimMes;
            const diasTrabalhados = Math.max(0, Math.ceil((fimTrabMes.getTime() - inicioTrabMes.getTime()) / (1000 * 60 * 60 * 24)) + 1);
            
            if (diasTrabalhados > 15) {
              meses2026++;
            }
          }
        }
        updateField('mesesTrabalhados2026', meses2026);
      } else {
        updateField('mesesTrabalhados2026', 0);
      }
    }
  }, [formData.dataAdmissao, formData.dataDesligamento]);

  // Validação por etapa
  const isStep1Valid =
    formData.tipoDesligamento && 
    formData.dataAdmissao && 
    formData.dataDesligamento && 
    formData.salarioFixo > 0 &&
    isDataDesligamentoValida;

  const isStep2Valid = formData.tipoAvisoPrevio !== '';

  const isStep3Valid = true; // Etapa 3 é opcional

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      default:
        return false;
    }
  };

  const isValid = isStep1Valid && isStep2Valid;

  const scrollToCard = () => {
    // Scroll para posicionar o conteúdo do card visível (ajuste de 80px para compensar header)
    setTimeout(() => {
      window.scrollTo({ top: 80, behavior: "smooth" });
    }, 50);
  };

  const handleNext = () => {
    if (isCurrentStepValid()) {
      setShowValidationError(false);
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        scrollToCard();
      }
    } else {
      setShowValidationError(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setShowValidationError(false);
      setCurrentStep(currentStep - 1);
      scrollToCard();
    }
  };

  const handleCalcular = () => {
    if (isValid && resultado) {
      setIsCalculating(true);
      // Tempo aleatório entre 3.5s e 4s para o loader visual
      const loadingTime = Math.random() * 500 + 3500;
      setTimeout(() => {
        setIsCalculating(false);
        const sessionId = crypto.randomUUID();
        navigate(`/resultado?id=${sessionId}`);
      }, loadingTime);
    }
  };

  const handleAdicionalChange = (adicional: AdicionalTrabalho, checked: boolean) => {
    const current = formData.adicionaisTrabalho || [];

    if (adicional === "nenhum" && checked) {
      updateField("adicionaisTrabalho", ["nenhum"]);
    } else if (checked) {
      const filtered = current.filter((a) => a !== "nenhum");
      updateField("adicionaisTrabalho", [...filtered, adicional]);
    } else {
      updateField(
        "adicionaisTrabalho",
        current.filter((a) => a !== adicional),
      );
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm animate-fade-in">
            {/* Stepper Progress dentro do card */}
            <div className="px-3 sm:px-6 pt-3 sm:pt-4">
              <StepperProgress steps={steps} currentStep={currentStep} />
            </div>

            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border/50">
              <CardTitle className="text-sm sm:text-lg font-bold flex items-center gap-2">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-foreground" />
                </div>
                <span>Dados do Contrato</span>
              </CardTitle>
              <p className="text-muted-foreground text-[10px] sm:text-xs mt-1">
                Informe os dados básicos do seu contrato
              </p>
            </CardHeader>

            <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* 1. Tipo de desligamento */}
              <FormSection title="Selecione o tipo de desligamento">
                <Select
                  value={formData.tipoDesligamento}
                  onValueChange={(v) => updateField("tipoDesligamento", v as TipoDesligamento)}
                >
                  <SelectTrigger className={cn(
                    "w-full",
                    showValidationError && !formData.tipoDesligamento && "bg-destructive/10 border-destructive"
                  )}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {tiposDesligamento.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormSection>

              <Separator className="bg-border/50" />

              {/* 2 e 3. Datas */}
              <FormSection title="Período do Contrato">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <MaskedDateInput
                    label="Data de admissão"
                    value={formData.dataAdmissao}
                    onChange={(v) => updateField("dataAdmissao", v)}
                    required
                    hasError={showValidationError && !formData.dataAdmissao}
                  />
                  <div className="space-y-1.5 sm:space-y-2">
                    <MaskedDateInput
                      label="Data de desligamento"
                      value={formData.dataDesligamento}
                      onChange={(v) => updateField("dataDesligamento", v)}
                      required
                      disabled={formData.aindaTrabalhando}
                      hasError={showValidationError && !formData.dataDesligamento && !formData.aindaTrabalhando}
                    />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.aindaTrabalhando}
                        onCheckedChange={(v) => updateField("aindaTrabalhando", !!v)}
                        className="h-4 w-4"
                      />
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        Ainda trabalhando, mas fui avisado
                      </span>
                    </label>
                  </div>
                </div>
                {!isDataDesligamentoValida && formData.dataAdmissao && formData.dataDesligamento && (
                  <p className="text-xs text-destructive mt-2">
                    A data de desligamento deve ser posterior à data de admissão.
                  </p>
                )}
              </FormSection>

              <Separator className="bg-border/50" />

              {/* 4. Salário */}
              <FormSection title="Qual era seu último salário bruto?">
                <div className="space-y-3 sm:space-y-4">
                  <CurrencyInput
                    label="Salário fixo"
                    value={formData.salarioFixo}
                    onChange={(v) => updateField("salarioFixo", v)}
                    required
                    hasError={showValidationError && formData.salarioFixo <= 0}
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.temVariavel}
                      onCheckedChange={(v) => updateField("temVariavel", !!v)}
                      className="h-4 w-4"
                    />
                    <span className="text-xs sm:text-sm">Tenho salário + média de variável/comissão</span>
                  </label>
                  {formData.temVariavel && (
                    <CurrencyInput
                      label="Média mensal de variáveis/comissões"
                      value={formData.mediaVariavel}
                      onChange={(v) => updateField("mediaVariavel", v)}
                    />
                  )}
                </div>
              </FormSection>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm animate-fade-in">
            {/* Stepper Progress dentro do card */}
            <div className="px-3 sm:px-6 pt-3 sm:pt-4">
              <StepperProgress steps={steps} currentStep={currentStep} />
            </div>

            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border/50">
              <CardTitle className="text-sm sm:text-lg font-bold flex items-center gap-2">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
                  <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <span>Verbas Rescisórias</span>
              </CardTitle>
              <p className="text-muted-foreground text-[10px] sm:text-xs mt-1">
                Informações sobre férias, aviso prévio e FGTS
              </p>
            </CardHeader>

            <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* Períodos de férias vencidas */}
              <FormSection title="A empresa deixou de conceder suas férias no prazo?">
                <p className="text-xs text-muted-foreground mb-3">
                  Após 12 meses de trabalho, você tem direito a tirar férias. Se a empresa não concedeu dentro do prazo legal (até 12 meses após completar o período), suas férias estão "vencidas" e você tem direito a receber em dobro.
                </p>
                <Select
                  value={formData.periodosFeriasVencidas >= 0 ? String(formData.periodosFeriasVencidas) : ''}
                  onValueChange={(v) => updateField("periodosFeriasVencidas", Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {periodosFerias.map((periodo) => (
                      <SelectItem key={periodo.value} value={String(periodo.value)}>
                        {periodo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormSection>

              <Separator className="bg-border/50" />

              {/* Meses desde última férias */}
              <FormSection title="Quantos meses você trabalhou desde suas últimas férias?">
                <p className="text-xs text-muted-foreground mb-3">
                  Conte os meses desde que você voltou das últimas férias até a data de desligamento. Isso será usado para calcular suas férias proporcionais.
                </p>
                <Select
                  value={formData.mesesDesdeUltimaFerias >= 0 ? String(formData.mesesDesdeUltimaFerias) : ''}
                  onValueChange={(v) => updateField("mesesDesdeUltimaFerias", Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {mesesDesdeFerias.map((opcao) => (
                      <SelectItem key={opcao.value} value={String(opcao.value)}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormSection>

              <Separator className="bg-border/50" />

              {/* Tipo de aviso prévio */}
              <FormSection title="Qual o tipo de aviso prévio?">
                <Select
                  value={formData.tipoAvisoPrevio}
                  onValueChange={(v) => updateField("tipoAvisoPrevio", v as TipoAvisoPrevio)}
                >
                  <SelectTrigger className={cn(
                    "w-full",
                    showValidationError && !formData.tipoAvisoPrevio && "bg-destructive/10 border-destructive"
                  )}>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {tiposAvisoPrevio.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormSection>

              <Separator className="bg-border/50" />

              {/* Saldo FGTS */}
              <FormSection title="Você sabe o saldo total do seu FGTS?">
                <div className="space-y-3">
                  <Select
                    value={formData.sabeSaldoFGTS === undefined ? '' : formData.sabeSaldoFGTS ? "sim" : "nao"}
                    onValueChange={(v) => {
                      updateField("sabeSaldoFGTS", v === "sim");
                      if (v === "nao") {
                        updateField("saldoFGTS", 0);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="sim">Sim, sei o saldo</SelectItem>
                      <SelectItem value="nao">Não sei</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {formData.sabeSaldoFGTS && (
                    <>
                      <CurrencyInput
                        label="Saldo FGTS"
                        value={formData.saldoFGTS}
                        onChange={(v) => updateField("saldoFGTS", v)}
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Consulte o extrato no app FGTS ou Caixa Trabalhador
                      </p>
                    </>
                  )}
                </div>
              </FormSection>

              <Separator className="bg-border/50" />

              {/* Dependentes */}
              <FormSection title="Quantos dependentes você possui?">
                <p className="text-xs text-muted-foreground mb-3">
                  Dependentes para fins de Imposto de Renda (filhos, cônjuge, etc.)
                </p>
                <Select
                  value={formData.numDependentes >= 0 ? String(formData.numDependentes) : ''}
                  onValueChange={(v) => updateField("numDependentes", Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {dependentesOptions.map((opcao) => (
                      <SelectItem key={opcao.value} value={String(opcao.value)}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormSection>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm animate-fade-in">
            {/* Stepper Progress dentro do card */}
            <div className="px-3 sm:px-6 pt-3 sm:pt-4">
              <StepperProgress steps={steps} currentStep={currentStep} />
            </div>

            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border/50">
              <CardTitle className="text-sm sm:text-lg font-bold flex items-center gap-2">
                <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <span>Detectar Oportunidade</span>
              </CardTitle>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                Identifique verbas adicionais que você deve receber
              </p>
            </CardHeader>

            <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* 8. Horas extras */}
              <FormSection title="Com que frequência trabalhava além do horário?">
                <Select
                  value={formData.faziaHorasExtras}
                  onValueChange={(v) => updateField("faziaHorasExtras", v as FrequenciaHorasExtras)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {frequenciasHorasExtras.map((opcao) => (
                      <SelectItem key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormSection>

              <Separator className="bg-border/50" />

              {/* 9. Funções diferentes */}
              <FormSection title="Exercia funções diferentes das registradas?">
                <Select
                  value={formData.funcoesDiferentes}
                  onValueChange={(v) => updateField("funcoesDiferentes", v as FrequenciaHorasExtras)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {frequenciasHorasExtras.map((opcao) => (
                      <SelectItem key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormSection>

              <Separator className="bg-border/50" />

              {/* 10. Valor por fora */}
              <FormSection title="Recebia algum valor 'por fora'?">
                <Select
                  value={formData.valorPorFora}
                  onValueChange={(v) => updateField("valorPorFora", v as OpcaoSimNao)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {opcoesSimNao.map((opcao) => (
                      <SelectItem key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormSection>

              <Separator className="bg-border/50" />

              {/* 11. Adicionais - Múltipla escolha */}
              <FormSection title="Seu trabalho envolvia algum desses?">
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  {adicionaisTrabalho.map((adicional) => (
                    <label
                      key={adicional.value}
                      className={cn(
                        "flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl border-2 p-2 sm:p-3 cursor-pointer transition-all",
                        formData.adicionaisTrabalho?.includes(adicional.value)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <Checkbox
                        checked={formData.adicionaisTrabalho?.includes(adicional.value)}
                        onCheckedChange={(checked) => handleAdicionalChange(adicional.value, !!checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-[11px] sm:text-sm">{adicional.label}</span>
                    </label>
                  ))}
                </div>
              </FormSection>

              <Separator className="bg-border/50" />

              {/* 12. Erro na rescisão */}
              <FormSection title="Acredita que seu empregador pode cometer um erro no cálculo da sua rescisão?" data-last-question="true">
                <Select
                  value={formData.erroNaRescisao}
                  onValueChange={(v) => updateField("erroNaRescisao", v as OpcaoErroRescisao)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {opcoesErroRescisao.map((opcao) => (
                      <SelectItem key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormSection>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Loader Modal */}
      <CalculationLoader open={isCalculating} />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-primary/15 rounded-full blur-3xl" />
      </div>

      <div className="container relative max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Header Chamativo */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
              Descubra o <span className="text-primary">Valor Exato</span> da Sua{" "}
              <span className="text-primary">Rescisão</span>
            </h1>

            <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed px-2">
              7 a cada 10 trabalhadores{" "}
              <span className="font-semibold text-foreground">recebem menos do que têm direito</span>. Garantimos que
              você não seja um deles.
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-emerald-500/10 text-emerald-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold border border-emerald-500/20">
              <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
              <span className="text-center">Preencha e receba o resultado imediatamente</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 sm:gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                className="flex-1 h-11 sm:h-14 text-xs sm:text-base font-semibold rounded-lg sm:rounded-xl"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5 sm:mr-2" />
                Anterior
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                size="lg"
                onClick={handleNext}
                className={cn(
                  "flex-1 h-11 sm:h-14 text-xs sm:text-base font-semibold rounded-lg sm:rounded-xl",
                  "bg-gradient-to-r from-primary via-primary to-primary/90",
                  "hover:from-primary/90 hover:via-primary hover:to-primary",
                  "shadow-lg shadow-primary/30",
                  "transition-all duration-300",
                )}
              >
                Próximo
                <ArrowRight className="h-4 w-4 ml-1.5 sm:ml-2" />
              </Button>
            ) : (
              <Button
                size="lg"
                disabled={!isValid || isCalculating}
                onClick={handleCalcular}
                data-calculate-button="true"
                className={cn(
                  "flex-1 h-12 sm:h-14 text-sm sm:text-base font-bold rounded-lg sm:rounded-xl",
                  "bg-gradient-to-r from-primary via-primary to-primary/90",
                  "hover:from-primary/90 hover:via-primary hover:to-primary",
                  "shadow-xl shadow-primary/40",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                  "transition-all duration-300 hover:scale-[1.02]",
                  "group min-w-0",
                )}
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin flex-shrink-0" />
                    <span className="truncate">Calculando...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-1.5 group-hover:rotate-12 transition-transform flex-shrink-0" />
                    <span>Calcular Agora</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Aviso de validação */}
          {showValidationError && !isCurrentStepValid() && (
            <p className="text-center text-xs sm:text-sm text-destructive font-medium animate-fade-in">
              Preencha todos os campos para avançar
            </p>
          )}
        </div>

        <p className="flex items-center justify-center gap-1.5 text-center text-[10px] sm:text-xs text-emerald-700 font-medium pb-4 px-4 flex-wrap">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>O Rescisão Certa já ajudou + de 80.000 trabalhadores a garantirem seus direitos</span>
        </p>
      </div>
      </div>
    </>
  );
}
