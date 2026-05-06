import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, Wallet, QrCode, Repeat, Check, Loader2, ShieldCheck } from "lucide-react";
import { useStore, actions, calcCart, formatBRL, type PaymentMethod } from "@/lib/store";
import { pagamentosApi, pedidosApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type SearchParams = { coupon?: string };

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Pagamento — Stellari" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    coupon: typeof s.coupon === "string" ? s.coupon : "",
  }),
  component: CheckoutPage,
});

const methods: { id: PaymentMethod; label: string; desc: string; icon: typeof CreditCard }[] = [
  { id: "credit", label: "Cartão de crédito", desc: "Em até 6x sem juros", icon: CreditCard },
  { id: "debit", label: "Cartão de débito", desc: "Aprovação imediata", icon: Wallet },
  { id: "pix", label: "PIX", desc: "5% de cashback Stellari", icon: QrCode },
  { id: "recurring", label: "Pagamento recorrente", desc: "Receba mensalmente (simulado)", icon: Repeat },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const { coupon = "" } = Route.useSearch();
  const cart = useStore((s) => s.cart);
  const products = useStore((s) => s.products);
  const currentUser = useStore((s) => s.users.find((u) => u.id === s.currentUserId));
  const calc = calcCart(cart, products, coupon);

  const [method, setMethod] = useState<PaymentMethod>("credit");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!currentUser) navigate({ to: "/login" });
  }, [currentUser, navigate]);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-medium mb-4">Carrinho vazio</h1>
        <Button asChild className="bg-gradient-primary text-primary-foreground rounded-full">
          <Link to="/produtos">Ver produtos</Link>
        </Button>
      </div>
    );
  }

  const pay = (e: React.FormEvent) => {
    e.preventDefault();
    if ((method === "credit" || method === "debit") && (!card.number || !card.name || !card.exp || !card.cvv)) {
      toast.error("Preencha os dados do cartão");
      return;
    }
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      const r = actions.checkout(coupon, method);
      setProcessing(false);
      if (r.ok) {
        toast.success("Pagamento aprovado! Pedido registrado.");
        navigate({ to: "/" });
      } else {
        toast.error("Falha ao processar pedido");
      }
    }, 1600);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <h1 className="font-display text-4xl md:text-5xl font-medium mb-2">Pagamento</h1>
      <p className="text-muted-foreground mb-12">Escolha como deseja pagar — ambiente 100% seguro.</p>

      <form onSubmit={pay} className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Forma de pagamento</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {methods.map((m) => {
                const active = method === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all flex gap-3 items-start ${
                      active
                        ? "border-primary bg-gradient-card shadow-soft"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      active ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}>
                      <m.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm flex items-center gap-2">
                        {m.label}
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {(method === "credit" || method === "debit") && (
            <div className="bg-card rounded-2xl border border-border shadow-soft p-6 space-y-4">
              <h3 className="font-display text-lg font-semibold">Dados do cartão</h3>
              <div>
                <Label htmlFor="cnum">Número do cartão</Label>
                <Input id="cnum" placeholder="0000 0000 0000 0000" maxLength={19} value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="cname">Nome impresso no cartão</Label>
                <Input id="cname" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="cexp">Validade</Label>
                  <Input id="cexp" placeholder="MM/AA" maxLength={5} value={card.exp}
                    onChange={(e) => setCard({ ...card, exp: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="ccvv">CVV</Label>
                  <Input id="ccvv" placeholder="123" maxLength={4} value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value })} className="mt-1.5" />
                </div>
              </div>
            </div>
          )}

          {method === "pix" && (
            <div className="bg-card rounded-2xl border border-border shadow-soft p-6 text-center">
              <div className="mx-auto h-40 w-40 bg-gradient-to-br from-primary/10 to-blush/20 rounded-2xl flex items-center justify-center mb-4">
                <QrCode className="h-20 w-20 text-primary" strokeWidth={1.2} />
              </div>
              <p className="font-medium">Escaneie o QR Code para pagar</p>
              <p className="text-xs text-muted-foreground mt-1">Confirmação automática em segundos (simulado).</p>
            </div>
          )}

          {method === "recurring" && (
            <div className="bg-gradient-card rounded-2xl border border-border shadow-soft p-6">
              <div className="flex items-start gap-3">
                <Repeat className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Assinatura mensal Stellari</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Você receberá os produtos selecionados todo mês com 10% de desconto exclusivo.
                    Cancele quando quiser. (Cobrança simulada)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="bg-gradient-card rounded-2xl p-6 border border-border shadow-soft h-fit lg:sticky lg:top-24">
          <h3 className="font-display text-xl font-semibold mb-4">Resumo do pedido</h3>
          <div className="space-y-2 text-sm border-b border-border pb-4 mb-4">
            {calc.items.map((it) => (
              <div key={it.productId} className="flex justify-between gap-3">
                <span className="text-muted-foreground truncate">{it.quantity}× {it.product.name}</span>
                <span className="shrink-0">{formatBRL(it.lineTotal)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm">
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
            type="submit"
            size="lg"
            disabled={processing}
            className="w-full mt-6 bg-gradient-primary text-primary-foreground rounded-full h-12 hover:shadow-glow shadow-soft transition-all"
          >
            {processing ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processando pagamento...</>
            ) : (
              <>Pagar {formatBRL(calc.total)}</>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> Pagamento simulado · ambiente seguro
          </p>
        </aside>
      </form>
    </div>
  );
}
