import { useState, useEffect, useCallback, useRef } from 'react';
import { UpsellLoadingScreen } from './UpsellLoadingScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock, ClipboardList, Loader2, Copy, CheckCircle2, ShieldCheck, Clock, AlertTriangle, Unlock, CircleAlert, CircleCheck, CircleMinus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DadosChecklist {
  tipoDesligamento: string;
  tempoContrato: string;
  salario: number;
  horasExtras: string;
  adicionais: string;
  variaveis: string;
  totalBasicas: number;
  totalExtras: number;
}

interface SecaoUpsellChecklistProps {
  dadosChecklist: DadosChecklist;
  emailUsuario: string;
  calculoId: string;
}

type EtapaUpsell = 'oferta' | 'pagamento' | 'gerando' | 'checklist-gerado';

const BYPASS_EMAIL = 'liberaragora@gmail.com';
const BYPASS_PRICE_EMAIL = 'jpabreupontes@gmail.com';

export function SecaoUpsellChecklist({ dadosChecklist, emailUsuario, calculoId }: SecaoUpsellChecklistProps) {
  const [etapa, setEtapa] = useState<EtapaUpsell>('oferta');
  const [isLoading, setIsLoading] = useState(false);
  const [checklistGerado, setChecklistGerado] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [jaDesbloqueado, setJaDesbloqueado] = useState(false);

  // PIX
  const [qrCode, setQrCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [chargeId, setChargeId] = useState('');
  const [checkingPayment, setCheckingPayment] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const email = emailUsuario || sessionStorage.getItem('rescisao-email') || 'dejue4djh3ush33z@gmail.com';
  const calcId = calculoId || sessionStorage.getItem('rescisao-calculo-id') || '';

  const isBypass = email.toLowerCase() === BYPASS_EMAIL;
  const isBypassPrice = email.toLowerCase() === BYPASS_PRICE_EMAIL;
  const upsellAmount = isBypassPrice ? 1 : 690;

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Verifica se o checklist já foi gerado para este cálculo (persistido no banco).
  // Permite que, após F5, o upsell apareça já desbloqueado se o usuário pagou antes.
  useEffect(() => {
    if (!calcId) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from('relatorios')
          .select('conteudo')
          .eq('calculo_id', calcId)
          .eq('tipo', 'checklist')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (cancelled) return;
        const checklist = (data?.conteudo as { checklist?: string } | null)?.checklist;
        if (checklist) {
          setChecklistGerado(checklist);
          setJaDesbloqueado(true);
          setEtapa('checklist-gerado');
        }
      } catch {
        // Silently ignore — fallback é o estado bloqueado padrão.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [calcId]);

  const appendTransactionId = () => {
    const txId = crypto.randomUUID();
    const url = new URL(window.location.href);
    url.searchParams.set('transaction_id', txId);
    window.history.replaceState({}, '', url.toString());
  };

  const handleDesbloquear = async () => {
    if (isBypass) {
      setModalAberto(true);
      setEtapa('gerando');
      appendTransactionId();
      await gerarChecklist();
      return;
    }

    if (!email) {
      toast({ title: 'E-mail não encontrado', description: 'Volte à página de resultado e complete o pagamento primeiro.', variant: 'destructive' });
      return;
    }

    if (qrCode && qrCodeUrl && chargeId && etapa === 'pagamento') {
      setModalAberto(true);
      return;
    }

    setModalAberto(true);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-pix', {
        body: { amount: upsellAmount, email, calculoId: calcId || undefined },
      });

      if (error) throw new Error(error.message || 'Erro ao gerar PIX');
      if (data?.error) throw new Error(data.details || data.error);

      if (data?.qrCode && data?.qrCodeUrl) {
        setQrCode(data.qrCode);
        setQrCodeUrl(data.qrCodeUrl);
        setChargeId(data.chargeId);
        setEtapa('pagamento');
        startPolling(data.chargeId);
      } else {
        throw new Error('QR Code não gerado');
      }
    } catch (err: unknown) {
      console.error('Erro ao gerar PIX:', err);
      toast({ title: 'Erro ao gerar PIX', description: err instanceof Error ? err.message : 'Tente novamente.', variant: 'destructive' });
      setModalAberto(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = useCallback((cid: string) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    let attempts = 0;
    const maxAttempts = 60;

    pollingRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        return;
      }
      try {
        const { data } = await supabase.functions.invoke('verificar-pix', { body: { chargeId: cid } });
        if (data?.paid === true || data?.status === 'pago') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          toast({ title: 'Pagamento confirmado! ✅' });
          appendTransactionId();
          setEtapa('gerando');
          await gerarChecklist();
        }
      } catch {
        // Silently ignore
      }
    }, 5000);
  }, [dadosChecklist]);

  const handleVerificarManual = async () => {
    if (!chargeId) return;
    setCheckingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke('verificar-pix', { body: { chargeId } });
      if (error) throw error;
      if (data?.paid === true || data?.status === 'pago') {
        if (pollingRef.current) clearInterval(pollingRef.current);
        toast({ title: 'Pagamento confirmado! ✅' });
        appendTransactionId();
        setEtapa('gerando');
        await gerarChecklist();
      } else {
        toast({ title: 'Pagamento pendente', description: 'Ainda não identificamos o pagamento. Aguarde alguns segundos.' });
      }
    } catch {
      toast({ title: 'Erro ao verificar', variant: 'destructive' });
    } finally {
      setCheckingPayment(false);
    }
  };

  const gerarChecklist = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gerar-checklist-rescisao', {
        body: dadosChecklist,
      });
      if (error) {
        console.error('[gerar-checklist-rescisao] error:', error);
        throw error;
      }
      if (data?.error) {
        console.error('[gerar-checklist-rescisao] data.error:', data);
        throw new Error(data.error);
      }
      if (!data?.checklist) {
        console.error('[gerar-checklist-rescisao] resposta sem checklist:', data);
        throw new Error('Resposta da IA veio vazia');
      }
      setChecklistGerado(data.checklist);
      setEtapa('checklist-gerado');
      setJaDesbloqueado(true);
      // Persiste no banco pra sobreviver a F5 / novo navegador.
      if (calcId) {
        try {
          await supabase.from('relatorios').insert({
            calculo_id: calcId,
            tipo: 'checklist',
            conteudo: { checklist: data.checklist },
          });
        } catch (persistErr) {
          console.error('[gerar-checklist-rescisao] erro ao persistir:', persistErr);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Tente novamente.';
      toast({
        title: 'Erro ao gerar checklist',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(checklistGerado);
      setCopiado(true);
      toast({ title: 'Checklist copiado! 📋' });
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      toast({ title: 'Erro ao copiar', variant: 'destructive' });
    }
  };

  const renderModalContent = () => {
    if (etapa === 'pagamento') {
      return (
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Saiba exatamente o que conferir antes de assinar
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground">
            Receba um checklist com os 15 erros mais comuns, analisados com base no seu contrato, salário e tipo de demissão.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Escaneie o QR Code para pagar <strong className="text-foreground">{isBypassPrice ? 'R$ 0,01' : 'R$ 6,90'}</strong> via PIX
          </p>
          {qrCodeUrl && (
            <div className="flex justify-center">
              <img src={qrCodeUrl} alt="QR Code PIX" className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg" />
            </div>
          )}
          {qrCode && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">Ou copie o código PIX:</p>
              <Input readOnly value={qrCode} className="text-xs font-mono" onClick={(e) => (e.target as HTMLInputElement).select()} />
            </div>
          )}
          <Button
            onClick={() => {
              if (!qrCode) return;
              navigator.clipboard.writeText(qrCode);
              toast({ title: 'Código copiado!' });
            }}
            className="w-full"
            size="lg"
          >
            <Copy className="w-4 h-4 mr-2" /> Copiar Código PIX
          </Button>
          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">O que você vai receber:</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>15 erros mais comuns em rescisões</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Riscos destacados com base no seu contrato</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Indica onde conferir cada valor na sua rescisão</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Copy className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Pronto para copiar e usar como guia</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (etapa === 'gerando') {
      return (
        <UpsellLoadingScreen
          titulo="Gerando seu checklist personalizado..."
          etapas={[
            { label: 'Analisando tipo de demissão' },
            { label: 'Verificando dados do contrato' },
            { label: 'Identificando riscos específicos' },
            { label: 'Classificando nível de cada erro' },
            { label: 'Montando checklist final' },
          ]}
        />
      );
    }

    if (etapa === 'checklist-gerado') {
      // Parse checklist text into structured items.
      // Aceita formatos:
      //   "⚠️ ERRO 1: Título"
      //   "1. Título"  /  "1) Título"
      //   "Título" precedido apenas por emoji
      // Linhas seguintes podem ser:
      //   "Risco no seu caso: Alto — ..."
      //   "Onde conferir: ..."
      //   "O que verificar: ..."
      const parseChecklist = (text: string) => {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        const items: { titulo: string; risco: string; detalhe: string }[] = [];
        let current: { titulo: string; risco: string; detalhe: string } | null = null;

        const pushCurrent = () => {
          if (current && current.titulo.length > 0) items.push(current);
          current = null;
        };

        // Header de novo item: emoji opcional + "ERRO N:" OU "N." no início.
        // Captura: [emoji][ERRO N: ou N.][texto restante]
        const headerWithErro = /^(?:[⚠️✅❌🔴🟡🟢🔍ℹ️]\s*)?ERRO\s*\d+\s*[:\-.]\s*(.+)$/i;
        const headerNumerado = /^(?:[⚠️✅❌🔴🟡🟢🔍ℹ️]\s*)?(\d{1,2})[.)]\s+(.+)$/;
        const headerEmojiTitulo = /^([⚠️✅❌🔴🟡🟢🔍ℹ️])\s+([A-ZÀ-Ú][^\n]{4,})/;

        const riscoLine = /^(?:Risco[^:]*:|Risco:|⚠️\s*Risco)\s*(.+)$/i;
        const labelDetalhe = /^(Onde conferir|O que verificar|Como verificar|Atenção)[:\-]\s*(.+)$/i;

        for (const line of lines) {
          // Pula separadores e linhas de resumo final genéricas
          if (/^[-=_*]{3,}$/.test(line)) continue;

          const mErro = line.match(headerWithErro);
          const mNum = line.match(headerNumerado);
          const mEmoji = line.match(headerEmojiTitulo);

          let titulo = '';
          if (mErro) {
            titulo = mErro[1].trim();
          } else if (mNum) {
            titulo = mNum[2].trim();
          } else if (mEmoji) {
            titulo = mEmoji[2].trim();
          }

          if (titulo) {
            pushCurrent();
            current = { titulo, risco: '', detalhe: '' };
            continue;
          }

          if (!current) continue;

          const mRisco = line.match(riscoLine);
          if (mRisco) {
            current.risco = mRisco[1].trim();
            // Pode ter explicação após "Alto — ..." que também é detalhe valioso
            const aposTraco = mRisco[1].split(/[—–-]/).slice(1).join('—').trim();
            if (aposTraco) {
              current.detalhe += (current.detalhe ? ' ' : '') + aposTraco;
            }
            continue;
          }

          const mLabel = line.match(labelDetalhe);
          if (mLabel) {
            current.detalhe += (current.detalhe ? ' · ' : '') + `${mLabel[1]}: ${mLabel[2].trim()}`;
            continue;
          }

          current.detalhe += (current.detalhe ? ' ' : '') + line;
        }
        pushCurrent();

        // Descarta itens sem título substantivo (ex.: "01" sozinho).
        return items.filter(it => it.titulo.length >= 4);
      };

      const items = parseChecklist(checklistGerado);
      const hasStructuredItems = items.length >= 3;

      const getRiscoConfig = (risco: string) => {
        const lower = risco.toLowerCase();
        if (lower.includes('alto') || lower.includes('high')) {
          return { icon: CircleAlert, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Alto' };
        }
        if (lower.includes('méd') || lower.includes('med') || lower.includes('moderado')) {
          return { icon: CircleMinus, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10', label: 'Médio' };
        }
        return { icon: CircleCheck, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10', label: 'Baixo' };
      };

      return (
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-lg font-bold text-primary">
              <CheckCircle2 className="w-5 h-5" />
              Checklist Gerado com Sucesso!
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Confira os erros mais comuns e os riscos específicos do seu caso.
          </p>

          <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
            {hasStructuredItems ? (
              items.map((item, i) => {
                const config = getRiscoConfig(item.risco);
                const RiscoIcon = config.icon;
                return (
                  <div key={i} className="rounded-lg border bg-card p-3 space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-muted-foreground mt-0.5 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight">{item.titulo}</p>
                        {item.risco && (
                          <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.bg} ${config.color}`}>
                            <RiscoIcon className="w-3 h-3" />
                            {config.label}
                          </div>
                        )}
                        {item.detalhe && (
                          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.detalhe}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-muted/30 border rounded-lg p-4">
                <pre className="text-xs sm:text-sm whitespace-pre-wrap font-sans leading-relaxed">{checklistGerado}</pre>
              </div>
            )}
          </div>

          <Button onClick={handleCopiar} className="w-full" variant={copiado ? 'outline' : 'default'} size="lg">
            {copiado ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Copiado!</> : <><Copy className="w-4 h-4 mr-2" /> Copiar Checklist</>}
          </Button>
        </div>
      );
    }

    // Loading state (generating QR)
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
      </div>
    );
  };

  return (
    <>
      <Card className={`overflow-hidden border-2 ${jaDesbloqueado ? 'border-green-500/30' : 'border-primary/20'}`}>
        <CardHeader className={`${jaDesbloqueado ? 'bg-green-600' : 'bg-primary'} border-b p-3 sm:p-4`}>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 text-base sm:text-lg ${jaDesbloqueado ? 'text-white' : 'text-primary-foreground'}`}>
              <ClipboardList className={`w-5 h-5 ${jaDesbloqueado ? 'text-white' : 'text-primary-foreground'} flex-shrink-0`} />
              <span>Checklist de Erros na Rescisão</span>
            </CardTitle>
            {jaDesbloqueado && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Desbloqueado
              </span>
            )}
          </div>
          <p className={`text-xs ${jaDesbloqueado ? 'text-white/80' : 'text-primary-foreground/80'} mt-1`}>
            Checklist feito sob medida com base nos dados do seu contrato
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          {jaDesbloqueado ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 sm:p-6 space-y-3">
                <p className="text-sm font-medium">⚠️ ERRO 1: Aviso prévio calculado errado</p>
                <p className="text-xs text-muted-foreground">Risco para o seu caso: Alto. Com base no tempo que você trabalhou...</p>
                <p className="text-sm font-medium mt-2">✅ ERRO 2: Férias vencidas não pagas</p>
                <p className="text-xs text-muted-foreground">Risco para o seu caso: Baixo. Verifique se todas as férias foram quitadas...</p>
                <p className="text-xs text-muted-foreground mt-2">... e mais 13 erros analisados</p>
              </div>

              <Button
                onClick={() => {
                  setEtapa('checklist-gerado');
                  setModalAberto(true);
                }}
                className="w-full max-w-sm mx-auto text-sm sm:text-base py-5 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <ClipboardList className="w-4 h-4 mr-2" /> Acessar Checklist
              </Button>
            </div>
          ) : (
            <>
              <div className="relative rounded-lg overflow-hidden border bg-muted/30">
                <div className="p-4 sm:p-6 space-y-3 blur-[3px] select-none pointer-events-none">
                  <p className="text-sm font-medium">⚠️ ERRO 1: Aviso prévio calculado errado</p>
                   <p className="text-xs text-muted-foreground">Risco para o seu caso: Alto. Com base no tempo que você trabalhou...</p>
                   <p className="text-xs text-muted-foreground">O que conferir: Veja se o valor do aviso prévio considera os anos de casa</p>
                   <p className="text-sm font-medium mt-3">✅ ERRO 2: Férias vencidas não pagas</p>
                   <p className="text-xs text-muted-foreground">Risco para o seu caso: Baixo. Verifique se todas as férias foram quitadas...</p>
                   <p className="text-sm font-medium mt-3">⚠️ ERRO 3: Comissões e extras fora da conta</p>
                   <p className="text-xs text-muted-foreground">Risco para o seu caso: Alto. Quando você recebia valores variáveis...</p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <div className="text-center space-y-3 p-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground max-w-[250px]">
                      Veja os 15 erros mais comuns, analisados com base no <strong>seu contrato</strong>
                    </p>
                    <Button onClick={handleDesbloquear} disabled={isLoading} size="sm" className="mt-1">
                      {isLoading ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Aguarde...</>
                      ) : (
                         <><Unlock className="w-3.5 h-3.5 mr-1.5" /> Desbloquear Agora</>
                       )}
                     </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-center">
                <h3 className="text-base sm:text-lg font-bold">
                  Será que a empresa errou na sua rescisão?
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Com base no <strong className="text-foreground">seu salário, tempo de casa e tipo de demissão</strong>, geramos
                  um checklist com os 15 erros mais comuns e marcamos quais têm mais chance
                  de ter acontecido no seu caso. Simples, direto e fácil de entender.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> 15 erros analisados
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> Feito com os dados do seu contrato
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> Linguagem simples e direta
                  </span>
                </div>
              </div>

              <div className="text-center space-y-3 pt-2">
                {!isBypass && (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">R$ 16,90</span>
                    <span className="text-2xl font-black text-primary">{isBypassPrice ? 'R$ 0,01' : 'R$ 6,90'}</span>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground">
                  {isBypass ? 'Acesso liberado • Geração instantânea' : 'Pagamento único via PIX • Geração instantânea'}
                </p>
                <Button
                  onClick={handleDesbloquear}
                  disabled={isLoading}
                  className="w-full max-w-sm mx-auto text-sm sm:text-base py-5"
                  size="lg"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Gerando...</>
                  ) : isBypass ? (
                    <><Unlock className="w-4 h-4 mr-2" /> Desbloquear Agora</>
                  ) : (
                    <><Lock className="w-4 h-4 mr-2" /> Desbloquear Agora</>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalAberto} onOpenChange={(open) => {
        if (etapa === 'gerando') return;
        setModalAberto(open);
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
