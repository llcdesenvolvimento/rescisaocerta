import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { QuizQuestion as QuizQuestionType } from './types';
import { QuizCard } from './QuizCard';
import { QuizOption } from './QuizOption';
import { QuizInputCurrency } from './QuizInputCurrency';
import { QuizInputDateRange } from './QuizInputDateRange';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function MonthYearPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  const parsedYear = value && value.length >= 7 ? parseInt(value.slice(0, 4), 10) : NaN;
  const selectedYear = !isNaN(parsedYear) && parsedYear >= 1900 ? parsedYear : currentYear;
  const selectedMonth = value && value.length >= 7 ? parseInt(value.slice(5, 7), 10) - 1 : -1;

  const [displayYear, setDisplayYear] = useState(selectedYear);

  const handleSelect = (monthIndex: number) => {
    const mm = String(monthIndex + 1).padStart(2, '0');
    onChange(`${displayYear}-${mm}`);
  };

  const isFuture = (monthIndex: number) => {
    return displayYear > currentYear || (displayYear === currentYear && monthIndex > currentMonth);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setDisplayYear(y => y - 1)}
          className="w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-lg font-semibold text-foreground w-16 text-center">{displayYear}</span>
        <button
          type="button"
          onClick={() => setDisplayYear(y => Math.min(y + 1, currentYear))}
          disabled={displayYear >= currentYear}
          className="w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {MONTH_NAMES.map((name, i) => {
          const isSelected = displayYear === selectedYear && i === selectedMonth;
          const disabled = isFuture(i);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(i)}
              className={cn(
                "h-10 rounded-lg text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground hover:bg-muted",
                disabled && "opacity-30 cursor-not-allowed"
              )}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface QuizQuestionScreenProps {
  question: QuizQuestionType;
  value: unknown;
  onAnswer: (value: unknown) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
  direction: 'forward' | 'backward';
  extraValues?: {
    dataAdmissao?: string;
    dataDesligamento?: string;
  };
  onExtraChange?: (field: string, value: string) => void;
  currentEtapa: number;
  totalEtapas: number;
  progress: number;
  questionIndex: number;
  totalQuestions: number;
  formData?: Record<string, unknown>;
}

// Progress bar component
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
      <div className="px-4 py-3">
        <div className="max-w-[520px] mx-auto">
          <div className="relative">
            <div className="h-2.5 w-full bg-primary/15 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-[width] duration-500 ease-out bg-primary/60"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-end items-center mt-2">
              <span className="text-xs font-medium text-primary/70">
                {Math.round(Math.min(progress, 100))}% concluído
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuizQuestionScreen({ 
  question, 
  value, 
  onAnswer, 
  onNext, 
  onPrevious,
  isFirst,
  isLast,
  direction,
  extraValues,
  onExtraChange,
  progress,
  questionIndex,
  totalQuestions,
  formData,
}: QuizQuestionScreenProps) {
  const isPensando = formData?.situacaoAtual === 'pensando' || formData?.situacaoAtual === 'demitido_aviso';
  const pergunta = (isPensando && question.perguntaPensando) ? question.perguntaPensando : question.pergunta;
  const subtexto = (isPensando && question.subtextoPensando) ? question.subtextoPensando : question.subtexto;
  const opcoes = (isPensando && question.opcoesPensando) ? question.opcoesPensando : (question.opcoesCondicional && formData ? question.opcoesCondicional(formData) : question.opcoes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationState, setAnimationState] = useState<'entering' | 'idle'>('entering');
  const autoAdvanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset animation on question change
  useEffect(() => {
    setAnimationState('entering');
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = setTimeout(() => setAnimationState('idle'), 350);
    return () => clearTimeout(timer);
  }, [questionIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeout.current) clearTimeout(autoAdvanceTimeout.current);
    };
  }, []);

  const handleSingleSelect = useCallback((optionValue: string) => {
    if (isAnimating) return;
    
    onAnswer(optionValue);
    setIsAnimating(true);
    
    // Fast auto-advance
    autoAdvanceTimeout.current = setTimeout(() => {
      onNext();
      setIsAnimating(false);
    }, 300);
  }, [isAnimating, onAnswer, onNext]);

  const handleMultiSelect = useCallback((optionValue: string) => {
    const currentValues = (value as string[]) || [];
    
    if (optionValue === 'nenhum') {
      onAnswer(['nenhum']);
    } else {
      const filtered = currentValues.filter(v => v !== 'nenhum');
      if (currentValues.includes(optionValue)) {
        onAnswer(filtered.filter(v => v !== optionValue));
      } else {
        onAnswer([...filtered, optionValue]);
      }
    }
  }, [value, onAnswer]);

  const canProceed = useCallback(() => {
    if (question.opcional) return true;
    
    if (question.tipo === 'single') {
      return !!value && value !== '' && value !== undefined;
    }
    if (question.tipo === 'multi') {
      return Array.isArray(value) && value.length > 0;
    }
    if (question.tipo === 'input-currency') {
      return typeof value === 'number' && value > 0;
    }
    if (question.tipo === 'input-number') {
      return typeof value === 'number' && value >= 0;
    }
    if (question.tipo === 'input-month') {
      return typeof value === 'string' && value.length === 7; // YYYY-MM
    }
    if (question.tipo === 'input-date-range') {
      const admissao = extraValues?.dataAdmissao;
      const desligamento = extraValues?.dataDesligamento;
      return !!admissao && !!desligamento && admissao.length > 0 && desligamento.length > 0;
    }
    return true;
  }, [question.opcional, question.tipo, value, extraValues]);

  const handleNextClick = useCallback(() => {
    if (isAnimating) return;
    onNext();
  }, [isAnimating, onNext]);

  const handlePreviousClick = useCallback(() => {
    if (isAnimating) return;
    onPrevious();
  }, [isAnimating, onPrevious]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <ProgressBar progress={progress} />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-[520px]">
          <div className={cn(
            "w-full transform-gpu",
            animationState === 'entering' && "animate-fade-scale-in"
          )}>
            <QuizCard>
              <h2 className="text-xl sm:text-2xl font-bold text-center text-foreground leading-tight mb-2">
                {pergunta}
              </h2>
              
              <p className="text-sm text-muted-foreground text-center mb-5 max-w-sm mx-auto">
                {subtexto.split(/\*\*(.*?)\*\*/).map((part, index) => 
                  index % 2 === 1 ? (
                    <strong key={index} className="text-foreground font-semibold">{part}</strong>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                )}
                {question.subtextoDestaque && (
                  <> <strong className="text-foreground">{question.subtextoDestaque}</strong></>
                )}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {question.tipo === 'single' && opcoes?.map((opcao) => (
                  <QuizOption
                    key={opcao.value}
                    label={opcao.label}
                    sublabel={opcao.sublabel}
                    selected={value === opcao.value}
                    onClick={() => handleSingleSelect(opcao.value)}
                    disabled={isAnimating}
                  />
                ))}

                {question.tipo === 'multi' && (
                  <>
                    <p className="text-xs text-center text-muted-foreground mb-1">
                      Selecione todas as opções que se aplicam
                    </p>
                    {opcoes?.map((opcao) => (
                      <QuizOption
                        key={opcao.value}
                        label={opcao.label}
                        sublabel={opcao.sublabel}
                        selected={Array.isArray(value) && value.includes(opcao.value)}
                        onClick={() => handleMultiSelect(opcao.value)}
                        isMulti
                      />
                    ))}
                  </>
                )}

                {question.tipo === 'input-currency' && (
                  <div className="space-y-3">
                    <QuizInputCurrency
                      value={typeof value === 'number' ? value : 0}
                      onChange={(v) => onAnswer(v)}
                    />
                    {question.opcional && (
                      <p className="text-xs text-center text-muted-foreground">
                        💡 Campo opcional - pode deixar em branco
                      </p>
                    )}
                  </div>
                )}

                {question.tipo === 'input-number' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => onAnswer(Math.max(0, (typeof value === 'number' ? value : 0) - 1))}
                        className="w-12 h-12 rounded-xl border border-border bg-background text-xl font-bold text-foreground hover:bg-muted transition-colors"
                      >
                        −
                      </button>
                      <span className="text-4xl font-bold text-primary w-16 text-center">
                        {typeof value === 'number' ? value : 0}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAnswer(Math.min(10, (typeof value === 'number' ? value : 0) + 1))}
                        className="w-12 h-12 rounded-xl border border-border bg-background text-xl font-bold text-foreground hover:bg-muted transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {question.tipo === 'input-month' && (
                  <MonthYearPicker
                    value={typeof value === 'string' ? value : ''}
                    onChange={(v) => onAnswer(v)}
                  />
                )}

                {question.tipo === 'input-date-range' && (
                  <QuizInputDateRange
                    valueAdmissao={extraValues?.dataAdmissao || ''}
                    valueDesligamento={extraValues?.dataDesligamento || ''}
                    onChangeAdmissao={(v) => onExtraChange?.('dataAdmissao', v)}
                    onChangeDesligamento={(v) => onExtraChange?.('dataDesligamento', v)}
                    onBothDatesValid={handleNextClick}
                    isPensando={isPensando}
                    situacaoAtual={formData?.situacaoAtual as string}
                  />
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="ghost"
                  onClick={handlePreviousClick}
                  disabled={isAnimating}
                  className="flex-1 h-12 rounded-xl text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                
                <Button
                  onClick={handleNextClick}
                  disabled={!canProceed() || isAnimating}
                  className={cn(
                    "flex-1 h-12 rounded-xl font-semibold",
                    canProceed() && !isAnimating
                      ? "bg-primary active:scale-[0.98]" 
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isLast ? 'Ver Resultado' : 'Continuar'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </QuizCard>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
