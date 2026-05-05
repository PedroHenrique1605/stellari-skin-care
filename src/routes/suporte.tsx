import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { actions, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, MessageCircle, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/suporte")({
  head: () => ({ meta: [{ title: "Suporte — Stellari" }] }),
  component: SupportPage,
});

const faqs = [
  { q: "Os produtos Stellari são indicados para pele sensível?", a: "Sim. Toda a linha é hipoalergênica, sem álcool, parabenos ou fragrâncias sintéticas." },
  { q: "Posso usar os três produtos juntos?", a: "Sim, eles foram formulados para trabalhar em sinergia: sérum, depois water gel e creme à noite." },
  { q: "Em quanto tempo verei resultados?", a: "Os primeiros sinais de hidratação aparecem em dias. Resultados em marcas e cicatrizes em 4-8 semanas." },
  { q: "Stellari é cruelty-free?", a: "Sim. Não testamos em animais e nossa fórmula é 100% vegana." },
  { q: "Como funciona o brinde?", a: "Em pedidos com 3 ou mais unidades você ganha automaticamente uma necessaire + amostras." },
  { q: "Qual a política de troca?", a: "Você tem até 7 dias após o recebimento para solicitar troca ou devolução." },
];

const schema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
  message: z.string().trim().min(10, "Mensagem muito curta").max(1000),
});

function SupportPage() {
  const currentUser = useStore((s) => s.users.find((u) => u.id === s.currentUserId));
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = currentUser
      ? { name: currentUser.name, email: currentUser.email, message: form.message }
      : form;
    const r = schema.safeParse(data);
    if (!r.success) {
      toast.error(r.error.errors[0].message);
      return;
    }
    actions.sendMessage(data.name, data.email, data.message, currentUser?.id);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    toast.success("Mensagem enviada com sucesso!");
  };

  return (
    <div>
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Estamos aqui</p>
          <h1 className="font-display text-5xl md:text-6xl font-medium mb-4">Suporte</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tire suas dúvidas ou entre em contato. Respondemos em até 24h.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQ */}
          <div>
            <h2 className="font-display text-3xl font-medium mb-2 flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" /> Perguntas frequentes
            </h2>
            <p className="text-sm text-muted-foreground mb-6">As dúvidas mais comuns sobre nossos produtos.</p>
            <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border shadow-soft px-6">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="text-left font-medium hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Form */}
          <div>
            <h2 className="font-display text-3xl font-medium mb-2 flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" /> Envie sua mensagem
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Nossa equipe retornará em breve.</p>

            <form onSubmit={submit} className="bg-card rounded-2xl border border-border shadow-soft p-8 space-y-5">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" maxLength={100} />
              </div>
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" maxLength={255} />
              </div>
              <div>
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea id="message" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5" maxLength={1000} />
              </div>
              <Button type="submit" size="lg" className="w-full bg-gradient-primary text-primary-foreground rounded-full h-12 hover:shadow-glow shadow-soft transition-all">
                {sent ? <><Check className="h-4 w-4 mr-2" /> Enviado</> : "Enviar mensagem"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
