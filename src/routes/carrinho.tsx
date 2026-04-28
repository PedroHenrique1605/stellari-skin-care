import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Minus, Plus, Gift, ShoppingBag, Tag } from "lucide-react";
import { useStore, actions, calcCart, formatBRL } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho — Stellari" }] }),
  component: CartPage,
});

function CartPage() {
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const currentUser = useStore((s) => s.users.find((u) => u.id === s.currentUserId));
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const navigate = useNavigate();

  const calc = calcCart(cart, products, appliedCoupon);

  const applyCoupon = () => {
    const test = calcCart(cart, products, coupon);
    if (test.discountPct > 0) {
      setAppliedCoupon(coupon);
      toast.success(`Cupom aplicado: ${test.discountPct}% OFF`);
    } else {
      toast.error("Cupom inválido");
    }
  };

  const checkout = () => {
    if (!currentUser) {
      toast.error("Faça login para finalizar");
      navigate({ to: "/login" });
      return;
    }
    navigate({ to: "/checkout", search: { coupon: appliedCoupon } as never });
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-8 py-24 text-center">
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/40 mb-6" strokeWidth={1} />
        <h1 className="font-display text-4xl font-medium mb-3">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mb-8">Que tal começar pelos nossos best-sellers?</p>
        <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground rounded-full h-12 px-8">
          <Link to="/produtos">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <h1 className="font-display text-4xl md:text-5xl font-medium mb-12">Seu carrinho</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-4">
          {calc.items.map((it) => (
            <div key={it.productId} className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-soft flex gap-4">
              <div className="h-24 w-24 md:h-28 md:w-28 rounded-xl overflow-hidden bg-muted shrink-0">
                <img src={it.product.image} alt={it.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-primary uppercase tracking-wider mb-1">{it.product.category}</p>
                <h3 className="font-display text-lg font-semibold leading-tight mb-2 truncate">{it.product.name}</h3>
                <p className="text-primary font-semibold">{formatBRL(it.product.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <Button variant="ghost" size="icon" onClick={() => actions.removeFromCart(it.productId)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center border border-border rounded-full overflow-hidden">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => actions.updateQty(it.productId, it.quantity - 1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{it.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => actions.updateQty(it.productId, it.quantity + 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {calc.giftEligible && (
            <div className="bg-gradient-primary rounded-2xl p-5 text-primary-foreground flex items-center gap-4 shadow-soft">
              <Gift className="h-8 w-8 shrink-0" />
              <div>
                <p className="font-semibold">Brinde desbloqueado! 🎁</p>
                <p className="text-sm text-primary-foreground/90">Necessaire Stellari + amostras grátis serão enviadas com seu pedido.</p>
              </div>
            </div>
          )}
        </div>

        <aside className="bg-gradient-card rounded-2xl p-6 border border-border shadow-soft h-fit lg:sticky lg:top-24">
          <h3 className="font-display text-xl font-semibold mb-6">Resumo</h3>

          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cupom de desconto"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" onClick={applyCoupon}>Aplicar</Button>
          </div>

          <div className="space-y-3 text-sm border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatBRL(calc.subtotal)}</span>
            </div>
            {calc.discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Desconto ({calc.discountPct}%)</span>
                <span>−{formatBRL(calc.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-primary font-medium">Grátis</span>
            </div>
            <div className="flex justify-between text-lg font-display font-semibold pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatBRL(calc.total)}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full mt-6 bg-gradient-primary text-primary-foreground rounded-full h-12 hover:shadow-glow shadow-soft transition-all"
            onClick={checkout}
          >
            Finalizar compra
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Cupons disponíveis: <span className="font-medium">STELLARI10</span>, <span className="font-medium">BEMVINDA</span>
          </p>
        </aside>
      </div>
    </div>
  );
}
