import { useState, useEffect, useCallback, useRef } from 'react';
import { UpsellLoadingScreen } from './UpsellLoadingScreen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock, FileText, Loader2, Copy, CheckCircle2, ShieldCheck, Clock, FileCheck, Unlock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DadosCarta {
  dataAdmissao: string;
  dataDesligamento: string;
  tipoDesligamento: string;
  salario: number;
  tempoContrato: string;
  totalBasicas: number;
  totalExtras: number;
  // Dados do quiz
  freqHorasExtras?: string;
  desvioFuncaoFreq?: string;
  pagamentoPorFora?: string;
  adicionaisSelecionados?: string[];
  suspeitaErroEmpregador?: string;
  dependentes?: number;
  saldoFGTS?: number;
}

interface SecaoUpsellCartaProps {
  dadosCarta: DadosCarta;
  emailUsuario: string;
  calculoId: string;
}

type EtapaUpsell = 'oferta' | 'pagamento' | 'formulario' | 'gerando' | 'carta-gerada';

const BYPASS_EMAIL = 'liberaragora@gmail.com';
const BYPASS_PRICE_EMAIL = 'jpabreupontes@gmail.com';

function aplicarMascaraCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function validarCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = sum * 10 % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = sum * 10 % 11;
  if (remainder === 10) remainder = 0;
  return remainder === parseInt(digits[10]);
}

export function SecaoUpsellCarta({ dadosCarta, emailUsuario, calculoId }: SecaoUpsellCartaProps) {
  const [etapa, setEtapa] = useState<EtapaUpsell>('oferta');
  const [isLoading, setIsLoading] = useState(false);
  const [cartaGerada, setCartaGerada] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [jaDesbloqueado, setJaDesbloqueado] = useState(false);

  // Dados do formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [cpfErro, setCpfErro] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cargo, setCargo] = useState('');
  const [infoAdicional, setInfoAdicional] = useState('');
  // PIX
  const [qrCode, setQrCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [chargeId, setChargeId] = useState('');
  const [checkingPayment, setCheckingPayment] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Recuperar email do sessionStorage (do pagamento anterior)
  const email = emailUsuario || sessionStorage.getItem('rescisao-email') || 'dejue4djh3ush33z@gmail.com';
  const calcId = calculoId || sessionStorage.getItem('rescisao-calculo-id') || '';

  // Check if bypass email
  const isBypass = email.toLowerCase() === BYPASS_EMAIL;
  const isBypassPrice = email.toLowerCase() === BYPASS_PRICE_EMAIL;
  const upsellAmount = isBypassPrice ? 1 : 990;

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Check if carta was already generated (persisted in sessionStorage)
  useEffect(() => {
    const storageKey = `carta-rh-${calcId}`;
    const savedCarta = sessionStorage.getItem(storageKey);
    if (savedCarta) {
      setCartaGerada(savedCarta);
      setJaDesbloqueado(true);
      setEtapa('carta-gerada');
    }
  }, [calcId]);

  const appendTransactionId = () => {
    const txId = crypto.randomUUID();
    const url = new URL(window.location.href);
    url.searchParams.set('transaction_id', txId);
    window.history.replaceState({}, '', url.toString());
  };

  const handleDesbloquear = async () => {
    // If bypass email, skip payment and go straight to form
    if (isBypass) {
      setModalAberto(true);
      setEtapa('formulario');
      appendTransactionId();
      return;
    }

    if (!email) {
      toast({
        title: 'E-mail não encontrado',
        description: 'Volte à página de resultado e complete o pagamento primeiro.',
        variant: 'destructive'
      });
      return;
    }

    // If PIX was already generated and not expired, reuse it
    if (qrCode && qrCodeUrl && chargeId && etapa === 'pagamento') {
      setModalAberto(true);
      return;
    }

    setModalAberto(true);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-pix-v2', {
        body: {
          amount: upsellAmount,
          email,
          calculoId: calcId || undefined
        }
      });

      if (error) {
        const errorMessage = error.message || 'Erro ao gerar PIX';
        throw new Error(errorMessage);
      }

      if (data?.error) {
        throw new Error(data.details || data.error);
      }

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
      toast({
        title: 'Erro ao gerar PIX',
        description: err instanceof Error ? err.message : 'Tente novamente.',
        variant: 'destructive'
      });
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
        const { data } = await supabase.functions.invoke('verificar-pix', {
          body: { chargeId: cid }
        });

        if (data?.status === 'paid') {
          if (pollingRef.current) clearInterval(pollingRef.current);
          toast({ title: 'Pagamento confirmado! ✅' });
          appendTransactionId();
          setEtapa('formulario');
        }
      } catch {

        // Silently ignore polling errors
      }}, 5000);
  }, []);

  const handleVerificarManual = async () => {
    if (!chargeId) return;
    setCheckingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke('verificar-pix', {
        body: { chargeId }
      });
      if (error) throw error;
      if (data?.status === 'paid') {
        if (pollingRef.current) clearInterval(pollingRef.current);
        toast({ title: 'Pagamento confirmado! ✅' });
        appendTransactionId();
        setEtapa('formulario');
      } else {
        toast({
          title: 'Pagamento pendente',
          description: 'Ainda não identificamos o pagamento. Aguarde alguns segundos.'
        });
      }
    } catch {
      toast({ title: 'Erro ao verificar', variant: 'destructive' });
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleGerarCarta = async () => {
    if (!nomeCompleto.trim()) {
      toast({ title: 'Preencha seu nome completo', variant: 'destructive' });
      return;
    }
    // Validate CPF if provided
    const cpfDigits = cpf.replace(/\D/g, '');
    if (cpfDigits.length > 0 && !validarCPF(cpfDigits)) {
      setCpfErro('CPF inválido');
      toast({ title: 'CPF inválido', description: 'Verifique o número digitado.', variant: 'destructive' });
      return;
    }
    setCpfErro('');
    setEtapa('gerando');
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gerar-carta-rh', {
        body: {
          nomeCompleto,
          cpf: cpfDigits || undefined,
          empresa: empresa || undefined,
          cnpj: cnpj || undefined,
          cargo: cargo || undefined,
          infoAdicional: infoAdicional || undefined,
          ...dadosCarta
        }
      });
      if (error) throw error;
      setCartaGerada(data.carta);
      setEtapa('carta-gerada');
      setJaDesbloqueado(true);
      const storageKey = `carta-rh-${calcId}`;
      sessionStorage.setItem(storageKey, data.carta);
    } catch {
      toast({ title: 'Erro ao gerar carta', description: 'Tente novamente.', variant: 'destructive' });
      setEtapa('formulario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(cartaGerada);
      setCopiado(true);
      toast({ title: 'Carta copiada! 📋' });
      setTimeout(() => setCopiado(false), 3000);
    } catch {
      toast({ title: 'Erro ao copiar', variant: 'destructive' });
    }
  };

  const formatarData = (data: string) => {
    if (!data) return '-';
    try {return new Date(data).toLocaleDateString('pt-BR');} catch {return data;}
  };

  // ---- MODAL CONTENT ----
  const renderModalContent = () => {
    if (etapa === 'pagamento') {
      return (
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Cobre a empresa sem precisar de advogado
            </DialogTitle>
          </DialogHeader>

          <p className="text-center text-sm text-muted-foreground">
            Receba uma carta profissional pronta para enviar ao RH, personalizada com os dados do seu contrato.
          </p>
          <p className="text-center text-xs text-muted-foreground">
            Escaneie o QR Code para pagar <strong className="text-foreground">{isBypassPrice ? 'R$ 0,01' : 'R$ 9,90'}</strong> via PIX
          </p>

          {qrCodeUrl &&
          <div className="flex justify-center">
              <img src={qrCodeUrl} alt="QR Code PIX" className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg" />
            </div>
          }

          {qrCode &&
          <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">Ou copie o código PIX:</p>
              <div className="flex gap-2">
                <Input
                readOnly value={qrCode} className="text-xs font-mono"
                onClick={(e) => (e.target as HTMLInputElement).select()} />

                <Button variant="outline" size="sm" onClick={() => {
                navigator.clipboard.writeText(qrCode);
                toast({ title: 'Código copiado!' });
              }}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          }

          <Button onClick={handleVerificarManual} disabled={checkingPayment} className="w-full" size="lg">
            {checkingPayment ?
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Verificando...</> :
            'Consultar pagamento'}
          </Button>

          <div className="border-t pt-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">O que você vai receber:</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <FileCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Carta formal de contestação personalizada</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Tom profissional, sem ameaças legais</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Solicita resposta em 5 dias úteis</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Copy className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Pronta para copiar e enviar por e-mail</span>
              </div>
            </div>
          </div>
        </div>);

    }

    if (etapa === 'formulario') {
      return (
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              Complete seus dados para a carta
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Preencha os dados abaixo para personalizar a carta. Apenas o nome é obrigatório.
          </p>
          <div className="space-y-3">
            <div>
              <Label htmlFor="carta-nome" className="text-sm">Nome completo *</Label>
              <Input id="carta-nome" placeholder="Seu nome completo" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="carta-cpf" className="text-sm">CPF (opcional)</Label>
              <Input
                id="carta-cpf"
                placeholder="000.000.000-00"
                value={cpf}
                maxLength={14}
                onChange={(e) => {
                  const masked = aplicarMascaraCPF(e.target.value);
                  setCpf(masked);
                  if (cpfErro) setCpfErro('');
                }}
                className={cpfErro ? 'border-red-500' : ''} />

              {cpfErro && <p className="text-xs text-red-500 mt-1">{cpfErro}</p>}
            </div>
            <div>
              <Label htmlFor="carta-cargo" className="text-sm">Cargo / Função (opcional)</Label>
              <Input id="carta-cargo" placeholder="Ex: Auxiliar administrativo" value={cargo} onChange={(e) => setCargo(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="carta-empresa" className="text-sm">Nome da empresa (opcional)</Label>
              <Input id="carta-empresa" placeholder="Nome da empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="carta-cnpj" className="text-sm">CNPJ da empresa (opcional)</Label>
              <Input id="carta-cnpj" placeholder="00.000.000/0000-00" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="carta-info" className="text-sm">Informações adicionais (opcional)</Label>
              <textarea
                id="carta-info"
                placeholder="Descreva aqui qualquer situação relevante que queira mencionar na carta (ex: promessas não cumpridas, mudança de função sem registro, etc.)"
                value={infoAdicional}
                onChange={(e) => setInfoAdicional(e.target.value)}
                maxLength={500}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />

              <p className="text-[10px] text-muted-foreground mt-1">{infoAdicional.length}/500 caracteres</p>
            </div>
          </div>
          <Button onClick={handleGerarCarta} disabled={isLoading} className="w-full" size="lg">
            {isLoading ?
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Gerando carta...</> :

            <><FileText className="w-4 h-4 mr-2" /> Gerar Carta ao RH</>
            }
          </Button>
        </div>);

    }

    if (etapa === 'gerando') {
      return (
        <UpsellLoadingScreen
          titulo="Gerando sua carta de contestação..."
          etapas={[
          { label: 'Analisando dados do contrato' },
          { label: 'Calculando verbas e diferenças' },
          { label: 'Redigindo carta personalizada' },
          { label: 'Revisando tom e fundamentação' },
          { label: 'Finalizando documento' }]
          } />);


    }

    if (etapa === 'carta-gerada') {
      return (
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-lg font-bold text-primary">
              <CheckCircle2 className="w-5 h-5" />
              Carta Gerada com Sucesso!
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Copie o texto e envie por e-mail ou protocole no RH da empresa.
          </p>
          <div className="bg-muted/30 border rounded-lg p-4 max-h-[400px] overflow-y-auto">
            <pre className="text-xs sm:text-sm whitespace-pre-wrap font-sans leading-relaxed">{cartaGerada}</pre>
          </div>
          <Button onClick={handleCopiar} className="w-full" variant={copiado ? 'outline' : 'default'} size="lg">
            {copiado ?
            <><CheckCircle2 className="w-4 h-4 mr-2" /> Copiado!</> :

            <><Copy className="w-4 h-4 mr-2" /> Copiar Carta</>
            }
          </Button>
        </div>);

    }

    // Loading state
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
      </div>);

  };

  return (
    <>
      <Card className={`overflow-hidden border-2 ${jaDesbloqueado ? 'border-green-500/30' : 'border-primary/20'}`}>
        <CardHeader className={`${jaDesbloqueado ? 'bg-green-600' : 'bg-primary'} border-b p-3 sm:p-4`}>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 text-base sm:text-lg ${jaDesbloqueado ? 'text-white' : 'text-primary-foreground'}`}>
              <FileText className={`w-5 h-5 ${jaDesbloqueado ? 'text-white' : 'text-primary-foreground'} flex-shrink-0`} />
              <span>Carta de Contestação ao RH</span>
            </CardTitle>
            {jaDesbloqueado &&
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Desbloqueado
              </span>
            }
          </div>
          <p className={`text-xs ${jaDesbloqueado ? 'text-white/80' : 'text-primary-foreground/80'} mt-1`}>
            Aumenta em até 40% suas chances de correção dos valores pela empresa
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          {jaDesbloqueado ? (
          /* Estado desbloqueado */
          <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 sm:p-6 space-y-2 text-xs sm:text-sm leading-relaxed">
                <p className="font-medium">{empresa ? `À ${empresa}` : 'À Empresa'}</p>
                <p>Departamento de Recursos Humanos</p>
                <p className="mt-2">Prezado(a) Senhor(a),</p>
                <p className="text-muted-foreground">
                  Eu, <strong className="text-foreground">{nomeCompleto || 'trabalhador(a)'}</strong>
                  {cargo && <>, ocupante do cargo de <strong className="text-foreground">{cargo}</strong></>}
                  , venho por meio desta contestar os valores da minha rescisão contratual referente ao período 
                  de <strong className="text-foreground">{formatarData(dadosCarta.dataAdmissao)}</strong> a <strong className="text-foreground">{formatarData(dadosCarta.dataDesligamento)}</strong> ({dadosCarta.tempoContrato}).
                </p>
                <p className="text-muted-foreground">
                  Salário base: <strong className="text-foreground">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosCarta.salario)}</strong>
                </p>
                <p className="text-muted-foreground italic">... clique em "Acessar Carta" para ver o texto completo</p>
              </div>

              <Button
              onClick={() => {
                setEtapa('carta-gerada');
                setModalAberto(true);
              }}
              className="w-full max-w-sm mx-auto text-sm sm:text-base py-5 bg-green-600 hover:bg-green-700"
              size="lg">

                <FileText className="w-4 h-4 mr-2" /> Acessar Carta
              </Button>
            </div>) : (

          /* Estado bloqueado */
          <>
              <div className="relative rounded-lg overflow-hidden border bg-muted/30">
                <div className="p-4 sm:p-6 space-y-3 blur-[3px] select-none pointer-events-none">
                  <p className="text-sm font-medium">À Empresa [Nome da Empresa]</p>
                  <p className="text-sm">Departamento de Recursos Humanos</p>
                  <p className="text-sm mt-4">Prezado(a) Senhor(a),</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Eu, [Nome Completo], portador(a) do CPF nº [CPF], venho por meio desta, de forma respeitosa
                    e fundamentada, apresentar contestação formal aos valores constantes no Termo de Rescisão do
                    Contrato de Trabalho (TRCT), referente ao período de {formatarData(dadosCarta.dataAdmissao)} a {formatarData(dadosCarta.dataDesligamento)}...
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Após análise detalhada das verbas rescisórias, foram identificadas divergências nos seguintes valores...
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Solicito a revisão dos valores apresentados e resposta formal em até 5 dias úteis...
                  </p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <div className="text-center space-y-3 p-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="font-bold text-sm sm:text-base">Carta Bloqueada</p>
                    <p className="text-xs text-muted-foreground max-w-[250px]">Desbloqueie o modelo de carta pronta para enviar ao RH baseado nas informações do seu contrato

                  </p>
                    <Button
                    onClick={handleDesbloquear}
                    disabled={isLoading}
                    size="sm"
                    className="mt-1">

                      {isLoading ?
                    <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Aguarde...</> :

                    <><Unlock className="w-3.5 h-3.5 mr-1.5" /> Desbloquear Agora</>
                    }
                     </Button>
                   </div>
                 </div>
               </div>

               <div className="space-y-3 text-center">
                 <h3 className="text-base sm:text-lg font-bold">
                   Não perca tempo: envie uma carta formal ao RH
                 </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Muitas empresas corrigem valores quando recebem uma contestação formal e bem fundamentada.
                  Nossa carta é gerada automaticamente com os dados do seu contrato e os valores apurados.
                  É rápido, direto e sem precisar de advogado.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> Linguagem formal e respeitosa
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> Baseada nos valores do seu contrato
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-primary" /> Pronta para copiar e enviar ao RH
                  </span>
                </div>
              </div>

              {/* Preço e CTA */}
              <div className="text-center space-y-3 pt-2">
                {!isBypass &&
              <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">R$ 19,90</span>
                    <span className="text-2xl font-black text-primary">{isBypassPrice ? 'R$ 0,01' : 'R$ 9,90'}</span>
                  </div>
              }
                <p className="text-[10px] text-muted-foreground">
                  {isBypass ? 'Acesso liberado • Geração instantânea' : 'Pagamento único via PIX • Geração instantânea'}
                </p>
                <Button
                onClick={handleDesbloquear}
                disabled={isLoading}
                className="w-full max-w-sm mx-auto text-sm sm:text-base py-5"
                size="lg">

                  {isLoading ?
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Gerando...</> :
                isBypass ?
                <><Unlock className="w-4 h-4 mr-2" /> Desbloquear Agora</> :

                <><Lock className="w-4 h-4 mr-2" /> Desbloquear Agora</>
                }
                </Button>
              </div>
            </>)
          }
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalAberto} onOpenChange={(open) => {
        if (etapa === 'gerando') return;
        setModalAberto(open);
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </>);

}