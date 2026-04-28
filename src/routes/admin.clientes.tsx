import { createFileRoute } from "@tanstack/react-router";
import { useStore, formatBRL } from "@/lib/store";

export const Route = createFileRoute("/admin/clientes")({
  component: ClientsPage,
});

function ClientsPage() {
  const clients = useStore((s) => s.users.filter((u) => u.role === "client"));
  const orders = useStore((s) => s.orders);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Clientes</h1>
        <p className="text-muted-foreground text-sm">{clients.length} cliente(s) cadastrado(s).</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
              <th className="px-6 py-3 font-medium text-right">Pedidos</th>
              <th className="px-6 py-3 font-medium text-right">Total gasto</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Nenhum cliente ainda.</td></tr>
            ) : (
              clients.map((c) => {
                const userOrders = orders.filter((o) => o.userId === c.id);
                const total = userOrders.reduce((a, o) => a + o.total, 0);
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-6 py-4 font-medium">{c.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{c.email}</td>
                    <td className="px-6 py-4 text-right">{userOrders.length}</td>
                    <td className="px-6 py-4 text-right font-semibold text-primary">{formatBRL(total)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
