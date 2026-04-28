import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Check } from "lucide-react";
import { useStore, actions, formatBRL } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/produtos")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => ({ q: (s.q as string) || undefined }),
  head: () => ({
    meta: [
      { title: "Produtos — Stellari" },
      { name: "description", content: "Conheça a linha completa de géis cicatrizantes Stellari." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q } = Route.useSearch();
  const products = useStore((s) => s.products);
  const filtered = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase()),
      )
    : products;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Coleção Stellari</p>
        <h1 className="font-display text-5xl md:text-6xl font-medium mb-4">Produtos</h1>
        <p className="text-muted-foreground">
          Cada fórmula desenvolvida com extratos botânicos em concentração farmacêutica.
        </p>
        {q && (
          <p className="text-sm text-muted-foreground mt-4">
            Resultados para "<span className="font-medium text-foreground">{q}</span>" ({filtered.length})
          </p>
        )}
      </div>

      <div className="space-y-24">
        {filtered.map((p, idx) => (
          <ProductBlock key={p.id} product={p} reverse={idx % 2 === 1} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
}

function ProductBlock({ product: p, reverse }: { product: ReturnType<typeof useStore<{ id: string; name: string; tagline: string; description: string; composition: string[]; uses: string[]; benefits: string[]; price: number; image: string; category: string }>>; reverse: boolean }) {
  const [qty, setQty] = useState(1);

  return (
    <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-elegant border border-border">
          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">{p.category}</p>
        <h2 className="font-display text-4xl md:text-5xl font-medium mb-3 leading-tight">{p.name}</h2>
        <p className="text-lg text-muted-foreground mb-6">{p.tagline}</p>
        <p className="text-foreground/80 leading-relaxed mb-8">{p.description}</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Section title="Composição" items={p.composition} />
          <Section title="Indicações" items={p.uses} />
          <Section title="Benefícios" items={p.benefits} />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="font-display text-4xl font-semibold text-primary">{formatBRL(p.price)}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center border border-border rounded-full overflow-hidden bg-card">
            <Button variant="ghost" size="icon" className="rounded-none h-11 w-11" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 h-11 border-0 text-center focus-visible:ring-0"
            />
            <Button variant="ghost" size="icon" className="rounded-none h-11 w-11" onClick={() => setQty((q) => q + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="lg"
            className="bg-gradient-primary text-primary-foreground rounded-full h-11 px-8 hover:shadow-glow shadow-soft transition-all"
            onClick={() => {
              actions.addToCart(p.id, qty);
              toast.success(`${qty}x adicionado ao carrinho`);
            }}
          >
            Adicionar ao carrinho
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-muted/40 rounded-2xl p-4 border border-border/50">
      <h4 className="font-semibold text-xs uppercase tracking-wider text-primary mb-3">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
