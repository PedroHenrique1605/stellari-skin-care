import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore, formatBRL } from "@/lib/store";
import { clientesApi, pedidosApi, mensagensApi, type ApiPedido, type ApiCliente, type ApiMensagem } from "@/lib/api";
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const products = useStore((s) => s.products);
  const [clients, setClients] = useState<ApiCliente[]>([]);
  const [pedidos, setPedidos] = useState<ApiPedido[]>([]);
  const [messages, setMessages] = useState<ApiMensagem[]>([]);

  useEffect(() => {
    clientesApi.list().then(setClients).catch(console.error);
    pedidosApi.listAll().then(setPedidos).catch(console.error);
    mensagensApi.listAll().then(setMessages).catch(console.error);
  }, []);

  const revenue = pedidos.reduce((a, p) => a + (p.total ?? 0), 0);

  const stats = [
    { label: "Faturamento total", value: formatBRL(revenue), icon: DollarSign, color: "from-primary to-primary-glow" },
    { label: "Pedidos", value: pedidos.length, icon: ShoppingBag, color: "from-blush to-lavender" },
    { label: "Clientes", value: clients.length, icon: Users, color: "from-lavender to-primary" },
    { label: "Produtos ativos", value: products.length, icon: Package, color: "from-primary to-lavender" },
    { label: "Mensagens", value: messages.length, icon: MessageSquare, color: "from-blush to-gold" },
  ];

  const recent = [...pedidos].reverse().slice(0, 5);

  const clientName = (idCliente?: number) => {
    if (!idCliente) return "—";
    const c = clients.find((x) => (x.id ?? x.id_cliente) === idCliente);
    return c?.nome ?? `Cliente #${idCliente}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-medium">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Visão geral da operação Stellari.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl p-6 border border-border shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <p className="font-display text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
        <h2 className="font-display text-xl font-semibold mb-4">Pedidos recentes</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Ainda não há pedidos.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{clientName(p.id_cliente)}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.data_hora ? new Date(p.data_hora).toLocaleString("pt-BR") : "—"}
                  </p>
                </div>
                <p className="font-semibold text-primary">{formatBRL(p.total ?? 0)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
