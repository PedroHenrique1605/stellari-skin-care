import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Leaf, Droplets, Star, Gift, ShieldCheck } from "lucide-react";
import { useStore, actions, formatBRL } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stellari — Cuidado que acalma, beleza que floresce" },
      { name: "description", content: "Descubra a linha Stellari de géis cicatrizantes farmacêuticos com extratos botânicos." },
    ],
  }),
  component: HomePage,
});

const testimonials = [
  { name: "Mariana C.", text: "Minha pele sensível nunca esteve tão calma. O sérum é incrível!", rating: 5 },
  { name: "Beatriz L.", text: "Vi resultado em duas semanas. Marcas de acne realmente diminuíram.", rating: 5 },
  { name: "Camila R.", text: "Textura leve, perfume sutil. Virou meu skincare diário.", rating: 5 },
];

const benefits = [
  { icon: Leaf, title: "Extratos botânicos", text: "Melaleuca, calêndula e camomila em concentração farmacêutica." },
  { icon: Droplets, title: "Hidratação profunda", text: "Tecnologia water-gel que penetra sem deixar oleosidade." },
  { icon: Sparkles, title: "Cicatrização ativa", text: "Acelera regeneração da pele e reduz marcas visivelmente." },
  { icon: ShieldCheck, title: "Pele sensível", text: "Vegano, sem parabenos, dermatologicamente testado, cruelty-free." },
];

function HomePage() {
  const products = useStore((s) => s.products);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 -left-20 h-96 w-96 rounded-full bg-primary-glow blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blush blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 backdrop-blur border border-border shadow-soft mb-6">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium tracking-wide">Linha farmacêutica botânica</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.05] mb-6">
                Cuidado que <em className="text-gradient not-italic">acalma</em>,
                <br />
                beleza que <em className="text-gradient not-italic">floresce</em>.
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                Géis cicatrizantes Stellari com extratos de melaleuca, calêndula e camomila.
                Formulação farmacêutica para pele sensível e regeneração visível.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground hover:shadow-glow shadow-soft transition-all h-12 px-8 rounded-full">
                  <Link to="/produtos">
                    Comprar agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 rounded-full border-primary/20 hover:bg-primary/5">
                  <Link to="/beneficios">Ver benefícios</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-border/50">
                <div>
                  <p className="font-display text-2xl font-semibold text-primary">+50k</p>
                  <p className="text-xs text-muted-foreground">clientes</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-primary">98%</p>
                  <p className="text-xs text-muted-foreground">satisfação</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-primary">4.9★</p>
                  <p className="text-xs text-muted-foreground">avaliação</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <div className="relative grid grid-cols-2 gap-4">
                {products.slice(0, 3).map((p, i) => (
                  <div
                    key={p.id}
                    className={`relative rounded-3xl overflow-hidden shadow-elegant border border-border/50 ${
                      i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                    }`}
                  >
                    <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS DESTAQUE */}
      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Nossa linha</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">Três rituais, uma promessa</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Produtos pensados para trabalhar em sinergia, restaurando o equilíbrio natural da sua pele.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-3xl overflow-hidden bg-gradient-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">{p.category}</p>
                <h3 className="font-display text-xl font-semibold mb-2 leading-tight">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{p.tagline}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-semibold text-primary">{formatBRL(p.price)}</span>
                  <Button
                    size="sm"
                    onClick={() => {
                      actions.addToCart(p.id);
                      toast.success("Adicionado ao carrinho");
                    }}
                    className="bg-gradient-primary text-primary-foreground rounded-full hover:shadow-soft"
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="bg-gradient-soft py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Diferenciais</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">Por que escolher Stellari</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-elegant transition-all">
                <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-soft">
                  <b.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMOÇÃO */}
      <section className="container mx-auto px-4 lg:px-8 py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-10 md:p-16 shadow-elegant">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-primary-glow blur-3xl" />
          </div>
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div className="text-primary-foreground">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur mb-4">
                <Gift className="h-3.5 w-3.5" />
                <span className="text-xs font-medium uppercase tracking-wider">Oferta especial</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">
                Compre 3 e ganhe um brinde exclusivo
              </h2>
              <p className="text-primary-foreground/90 mb-6 max-w-md">
                Em pedidos com 3 ou mais unidades (somando qualquer produto da linha),
                você ganha uma necessaire Stellari + amostras grátis.
              </p>
              <Button size="lg" variant="secondary" asChild className="rounded-full h-12 px-8">
                <Link to="/produtos">Aproveitar oferta</Link>
              </Button>
            </div>
            <div className="hidden md:flex justify-end">
              <Gift className="h-48 w-48 text-primary-foreground/30" strokeWidth={0.8} />
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="container mx-auto px-4 lg:px-8 pb-24">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Depoimentos</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium">Quem usa, recomenda</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-2xl p-8 border border-border shadow-soft">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">"{t.text}"</p>
              <p className="font-medium text-sm">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
