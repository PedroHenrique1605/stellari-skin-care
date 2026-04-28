import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, Droplets, Sparkles, ShieldCheck, Heart, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/beneficios")({
  head: () => ({
    meta: [
      { title: "Benefícios — Stellari" },
      { name: "description", content: "Conheça os benefícios da linha Stellari para a saúde e beleza da sua pele." },
    ],
  }),
  component: BenefitsPage,
});

const features = [
  { icon: Leaf, title: "Extratos botânicos puros", text: "Melaleuca, calêndula e camomila extraídos a frio para preservar princípios ativos." },
  { icon: Droplets, title: "Tecnologia water-gel", text: "Penetração profunda sem deixar resíduo oleoso, ideal para clima tropical." },
  { icon: Sparkles, title: "Cicatrização visível", text: "Aceleração comprovada da regeneração celular e redução de marcas." },
  { icon: ShieldCheck, title: "Pele sensível", text: "Formulação hipoalergênica, sem álcool, parabenos ou fragrâncias sintéticas." },
  { icon: Heart, title: "Vegano & cruelty-free", text: "Comprometimento com bem-estar animal e ingredientes 100% vegetais." },
  { icon: FlaskConical, title: "Padrão farmacêutico", text: "Concentrações terapêuticas testadas dermatologicamente." },
];

function BenefitsPage() {
  return (
    <div>
      <section className="bg-gradient-hero py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Diferenciais</p>
          <h1 className="font-display text-5xl md:text-7xl font-medium mb-6">
            Ciência <em className="text-gradient not-italic">e</em> botânica
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada produto Stellari é desenvolvido em parceria com farmacêuticos e dermatologistas
            para garantir resultados visíveis e segurança para todos os tipos de pele.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="group bg-gradient-card rounded-3xl p-8 border border-border shadow-soft hover:shadow-elegant transition-all">
              <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 shadow-soft group-hover:shadow-glow transition-shadow">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3">{f.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 lg:px-8 pb-24">
        <div className="bg-gradient-primary rounded-3xl p-12 md:p-16 text-center shadow-elegant">
          <h2 className="font-display text-4xl md:text-5xl font-medium text-primary-foreground mb-4">
            Comece o ritual Stellari
          </h2>
          <p className="text-primary-foreground/90 max-w-xl mx-auto mb-8">
            Sua pele merece o cuidado de quem entende dermocosmética farmacêutica.
          </p>
          <Button size="lg" variant="secondary" asChild className="rounded-full h-12 px-8">
            <Link to="/produtos">Ver produtos</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
