import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useStore, formatBRL } from "@/lib/store";
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const allUsers = useStore((s) => s.users);
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const messages = useStore((s) => s.messages);
  const users = useMemo(() => allUsers.filter((u) => u.role === "client"), [allUsers]);

  const revenue = orders.reduce((a, o) => a + o.total, 0);
  const unitsSold = orders.reduce((a, o) => a + o.items.reduce((b, i) => b + i.quantity, 0), 0);

  const stats = [
    { label: "Faturamento total", value: formatBRL(revenue), icon: DollarSign, color: "from-primary to-primary-glow" },
    { label: "Pedidos", value: orders.length, icon: ShoppingBag, color: "from-blush to-lavender" },
    { label: "Clientes", value: users.length, icon: Users, color: "from-lavender to-primary" },
    { label: "Unidades vendidas", value: unitsSold, icon: TrendingUp, color: "from-gold to-blush" },
    { label: "Produtos ativos", value: products.length, icon: Package, color: "from-primary to-lavender" },
    { label: "Mensagens", value: messages.length, icon: MessageSquare, color: "from-blush to-gold" },
  ];

  const recent = [...orders].reverse().slice(0, 5);

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
            {recent.map((o) => (
              <div key={o.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{o.userName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleString("pt-BR")}</p>
                </div>
                <p className="font-semibold text-primary">{formatBRL(o.total)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
