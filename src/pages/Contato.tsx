import { Header } from "@/components/layout/Header";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/layout/Footer";
import { BackLink } from "@/components/BackLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";

export default function Contato() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.mensagem.trim()) {
      toast({ title: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const subject = encodeURIComponent(form.assunto || "Contato via site");
    const body = encodeURIComponent(`Nome: ${form.nome}\nE-mail: ${form.email}\n\n${form.mensagem}`);
    window.location.href = `mailto:suporterescisaocerta@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Seu aplicativo de e-mail foi aberto!", description: "Envie a mensagem pelo seu e-mail." });
      setForm({ nome: "", email: "", assunto: "", mensagem: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOHead title="Contato" description="Entre em contato com a equipe da Rescisão Certa. Suporte via e-mail todos os dias das 08h às 21h." canonical="https://rescisaocerta.com.br/contato" />
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <BackLink />

          <h1 className="text-xl font-bold text-gray-900 mb-2">Contato</h1>
          <p className="text-sm text-gray-500 mb-8">
            Tem alguma dúvida ou precisa de ajuda? Envie uma mensagem e responderemos o mais rápido possível.
          </p>

          <div className="grid gap-8 sm:grid-cols-5">
            {/* Formulário */}
            <form onSubmit={handleSubmit} className="sm:col-span-3 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Nome completo *</label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Seu nome"
                  maxLength={100}
                  className="border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">E-mail *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="seu@email.com"
                  maxLength={255}
                  className="border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Assunto</label>
                <Input
                  value={form.assunto}
                  onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                  placeholder="Ex: Dúvida sobre o relatório"
                  maxLength={200}
                  className="border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Mensagem *</label>
                <Textarea
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  placeholder="Descreva como podemos ajudar..."
                  maxLength={1000}
                  rows={5}
                  className="border-gray-200 resize-none"
                />
                <p className="text-[10px] text-gray-300 text-right mt-1">{form.mensagem.length}/1000</p>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {loading ? "Abrindo e-mail..." : <><Send className="w-4 h-4 mr-2" />Enviar mensagem</>}
              </Button>
            </form>

            {/* Info lateral */}
            <div className="sm:col-span-2 text-sm text-gray-600 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-400">E-mail</p>
                  <a href="mailto:suporterescisaocerta@gmail.com" className="text-blue-600 hover:underline text-sm break-all">
                    suporterescisaocerta@gmail.com
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Horário</p>
                  <p>Todos os dias, 08h às 18h</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Endereço</p>
                  <p className="text-xs">SHN Qd. 2, Bl. F, Sl. 625/626, Asa Norte, Brasília/DF</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">CNPJ</p>
                  <p>62.911.864/0001-12</p>
                </div>
              </div>
            </div>
          </div>

          {/* AdSense */}
          <div className="mt-10">
            <AdBanner slot="9999999992" format="auto" className="" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}