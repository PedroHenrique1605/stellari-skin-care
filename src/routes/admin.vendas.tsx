import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { pedidosApi, clientesApi, type ApiPedido, type ApiCliente } from "@/lib/api";
import { formatBRL } from "@/lib/store";

export const Route = createFileRoute("/admin/vendas")({
  component: SalesPage,
});

function SalesPage() {
  const [pedidos, setPedidos] = useState<ApiPedido[]>([]);
  const [clients, setClients] = useState<ApiCliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([pedidosApi.listAll(), clientesApi.list()])
      .then(([p, c]) => { setPedidos(p); setClients(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = pedidos.reduce((a, p) => a + (p.total ?? 0), 0);

  const clientName = (idCliente?: number) => {
    if (!idCliente) return "—";
    const c = clients.find((x) => (x.id ?? x.id_cliente) === idCliente);
    return c?.nome ?? `Cliente #${idCliente}`;
  };

  if (loading) {
    return <div className="text-muted-foreground py-12 text-center">Carregando vendas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium">Vendas</h1>
          <p className="text-muted-foreground text-sm">{pedidos.length} pedido(s) registrado(s).</p>
        </div>
        <div className="bg-gradient-primary text-primary-foreground rounded-2xl px-6 py-3 shadow-soft">
          <p className="text-xs opacity-80">Faturamento total</p>
          <p className="font-display text-2xl font-semibold">{formatBRL(total)}</p>
        </div>
      </div>

      <div className="space-y-3">
        {pedidos.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground">
            Nenhuma venda registrada ainda.
          </div>
        ) : (
          [...pedidos].reverse().map((p) => (
            <div key={p.id} className="bg-card rounded-2xl border border-border shadow-soft p-6">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p className="font-medium">{clientName(p.id_cliente)}</p>
                  <p className="text-xs text-muted-foreground">
                    Pedido #{p.id} · {p.data_hora ? new Date(p.data_hora).toLocaleString("pt-BR") : "—"}
                  </p>
                  {p.cupom && (
                    <p className="text-xs text-primary mt-1 font-medium">Cupom: {p.cupom}</p>
                  )}
                </div>
                <p className="font-display text-xl font-semibold text-primary">{formatBRL(p.total ?? 0)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
