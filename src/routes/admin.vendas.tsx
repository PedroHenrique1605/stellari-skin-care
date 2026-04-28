import { createFileRoute } from "@tanstack/react-router";
import { useStore, formatBRL } from "@/lib/store";

export const Route = createFileRoute("/admin/vendas")({
  component: SalesPage,
});

function SalesPage() {
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const total = orders.reduce((a, o) => a + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Vendas</h1>
          <p className="text-muted-foreground text-sm">{orders.length} pedido(s) registrado(s).</p>
        </div>
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl px-6 py-3 shadow-soft">
          <p className="text-xs opacity-80">Faturamento total</p>
          <p className="font-display text-2xl font-semibold">{formatBRL(total)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground">
            Nenhuma venda registrada ainda.
          </div>
        ) : (
          [...orders].reverse().map((o) => (
            <div key={o.id} className="bg-card rounded-2xl border border-border shadow-soft p-6">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                <div>
                  <p className="font-medium">{o.userName}</p>
                  <p className="text-xs text-muted-foreground">#{o.id} · {new Date(o.date).toLocaleString("pt-BR")}</p>
                </div>
                <p className="font-display text-xl font-semibold text-primary">{formatBRL(o.total)}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                {o.items.map((it) => {
                  const p = products.find((x) => x.id === it.productId);
                  return (
                    <span key={it.productId} className="text-xs bg-muted px-3 py-1 rounded-full">
                      {it.quantity}× {p?.name ?? it.productId}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
