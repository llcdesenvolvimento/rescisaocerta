import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar, AlertCircle } from "lucide-react";

interface QuizInputDateRangeProps {
  valueAdmissao: string;
  valueDesligamento: string;
  onChangeAdmissao: (value: string) => void;
  onChangeDesligamento: (value: string) => void;
  onBothDatesValid?: () => void;
  isPensando?: boolean;
  situacaoAtual?: string;
}

// Máscara DD/MM/AAAA
function applyDateMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  let masked = "";

  if (digits.length > 0) masked += digits.slice(0, 2);
  if (digits.length > 2) masked += "/" + digits.slice(2, 4);
  if (digits.length > 4) masked += "/" + digits.slice(4, 8);

  return masked;
}

// Validar data
function isValidDate(masked: string): boolean {
  if (masked.length !== 10) return false;

  const [dd, mm, yyyy] = masked.split("/").map(Number);
  if (!dd || !mm || !yyyy) return false;
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  if (yyyy < 1950 || yyyy > 2030) return false;

  const date = new Date(yyyy, mm - 1, dd);
  return date.getDate() === dd && date.getMonth() === mm - 1 && date.getFullYear() === yyyy;
}

// Converter para ISO
function toISO(masked: string): string {
  if (!isValidDate(masked)) return "";
  const [dd, mm, yyyy] = masked.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

// Converter de ISO para masked
function fromISO(iso: string): string {
  if (!iso) return "";
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

// Comparar datas (retorna true se date1 <= date2)
// Usa comparação de strings ISO para evitar problemas de timezone
function isDateBeforeOrEqual(date1ISO: string, date2ISO: string): boolean {
  if (!date1ISO || !date2ISO) return true;
  // Comparação de strings YYYY-MM-DD funciona lexicograficamente
  return date1ISO <= date2ISO;
}

export function QuizInputDateRange({
  valueAdmissao,
  valueDesligamento,
  onChangeAdmissao,
  onChangeDesligamento,
  onBothDatesValid,
  isPensando,
  situacaoAtual,
}: QuizInputDateRangeProps) {
  const [admissaoDisplay, setAdmissaoDisplay] = useState(fromISO(valueAdmissao));
  const [desligamentoDisplay, setDesligamentoDisplay] = useState(fromISO(valueDesligamento));
  const admissaoRef = useRef<HTMLInputElement>(null);
  const desligamentoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (admissaoRef.current) {
      admissaoRef.current.focus();
    }
  }, []);

  const handleAdmissaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyDateMask(e.target.value);
    setAdmissaoDisplay(masked);

    if (isValidDate(masked)) {
      const isoDate = toISO(masked);
      onChangeAdmissao(isoDate);

      // Se a data de desligamento é anterior, limpar ela
      if (valueDesligamento && !isDateBeforeOrEqual(isoDate, valueDesligamento)) {
        onChangeDesligamento("");
        setDesligamentoDisplay("");
      }

      // Auto-focus para próximo campo
      if (masked.length === 10 && desligamentoRef.current) {
        setTimeout(() => desligamentoRef.current?.focus(), 100);
      }
    } else if (masked.length < 10) {
      onChangeAdmissao("");
    }
  };

  const handleDesligamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyDateMask(e.target.value);
    setDesligamentoDisplay(masked);

    if (isValidDate(masked)) {
      const isoDate = toISO(masked);

      // Validar que desligamento >= admissão
      if (valueAdmissao && !isDateBeforeOrEqual(valueAdmissao, isoDate)) {
        // Data inválida - não atualizar o valor
        onChangeDesligamento("");
      } else {
        onChangeDesligamento(isoDate);

        // Se ambas as datas estão válidas, disparar callback para auto-avanço
        if (valueAdmissao && isDateBeforeOrEqual(valueAdmissao, isoDate)) {
          setTimeout(() => onBothDatesValid?.(), 500);
        }
      }
    } else if (masked.length < 10) {
      onChangeDesligamento("");
    }
  };

  const admissaoValid = !admissaoDisplay || admissaoDisplay.length < 10 || isValidDate(admissaoDisplay);
  const desligamentoDateValid =
    !desligamentoDisplay || desligamentoDisplay.length < 10 || isValidDate(desligamentoDisplay);

  // Verificar ordem das datas usando os valores de display (não ISO)
  // Isso garante que a validação funcione mesmo quando o valor ISO foi limpo
  const checkDateOrder = (): boolean => {
    if (admissaoDisplay.length !== 10 || desligamentoDisplay.length !== 10) return true;
    if (!isValidDate(admissaoDisplay) || !isValidDate(desligamentoDisplay)) return true;

    const admissaoISO = toISO(admissaoDisplay);
    const desligamentoISO = toISO(desligamentoDisplay);

    return isDateBeforeOrEqual(admissaoISO, desligamentoISO);
  };

  const desligamentoAfterAdmissao = checkDateOrder();
  const desligamentoValid = desligamentoDateValid && desligamentoAfterAdmissao;

  // Mostrar erro se data de desligamento está completa mas é anterior à admissão
  const showDateOrderError =
    desligamentoDisplay.length === 10 &&
    isValidDate(desligamentoDisplay) &&
    admissaoDisplay.length === 10 &&
    isValidDate(admissaoDisplay) &&
    !desligamentoAfterAdmissao;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          Data de admissão
        </label>
        <p className="text-xs text-muted-foreground -mt-1">Data que consta no contrato de trabalho</p>
        <input
          ref={admissaoRef}
          type="text"
          inputMode="numeric"
          value={admissaoDisplay}
          onChange={handleAdmissaoChange}
          placeholder="DD/MM/AAAA"
          maxLength={10}
          className={cn(
            "w-full h-14 px-4 text-center text-lg font-medium rounded-xl border",
            "bg-background transition-all duration-200",
            "placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
            !admissaoValid && "border-destructive bg-destructive/5",
            admissaoValid && admissaoDisplay.length === 10 && "border-success bg-success/5",
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          {situacaoAtual === "pensando"
            ? "Data estimada de saída"
            : situacaoAtual === "demitido_aviso"
              ? "Qual será seu último dia de trabalho?"
              : "Qual foi seu último dia de trabalho?"}
        </label>
        <p className="text-xs text-muted-foreground -mt-1">
          {situacaoAtual === "pensando"
            ? "Se você saísse hoje, qual seria a data provável de desligamento?"
            : situacaoAtual === "demitido_aviso"
              ? "Informe a data prevista do seu último dia na empresa"
              : "Informe a data do seu último dia na empresa"}
        </p>
        <input
          ref={desligamentoRef}
          type="text"
          inputMode="numeric"
          value={desligamentoDisplay}
          onChange={handleDesligamentoChange}
          placeholder="DD/MM/AAAA"
          maxLength={10}
          className={cn(
            "w-full h-14 px-4 text-center text-lg font-medium rounded-xl border",
            "bg-background transition-all duration-200",
            "placeholder:text-muted-foreground/50",
            "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
            (!desligamentoValid || showDateOrderError) && "border-destructive bg-destructive/5",
            desligamentoValid &&
              desligamentoDisplay.length === 10 &&
              !showDateOrderError &&
              "border-success bg-success/5",
          )}
        />

        {showDateOrderError && (
          <div className="flex items-center gap-1.5 text-destructive text-xs mt-1 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>A data de desligamento deve ser posterior à data de admissão</span>
          </div>
        )}
      </div>
    </div>
  );
}
