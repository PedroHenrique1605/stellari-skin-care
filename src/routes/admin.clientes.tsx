import { createFileRoute } from "@tanstack/react-router";
import { useStore, formatBRL } from "@/lib/store";

export const Route = createFileRoute("/admin/clientes")({
  component: ClientsPage,
});

function ClientsPage() {
  const allUsers = useStore((s) => s.users);
  const orders = useStore((s) => s.orders);
  const users = allUsers.filter((u) => u.role === "client");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Clientes</h1>
        <p className="text-muted-foreground text-sm">
          {users.length} cliente(s) cadastrado(s) · {allUsers.length} usuário(s) no total.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
              <th className="px-6 py-3 font-medium">Tipo</th>
              <th className="px-6 py-3 font-medium text-right">Pedidos</th>
              <th className="px-6 py-3 font-medium text-right">Total gasto</th>
            </tr>
          </thead>
          <tbody>
            {allUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum usuário cadastrado ainda.
                </td>
              </tr>
            ) : (
              allUsers.map((c) => {
                const userOrders = orders.filter((o) => o.userId === c.id);
                const total = userOrders.reduce((a, o) => a + o.total, 0);
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-6 py-4 font-medium">{c.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{c.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          c.role === "admin"
                            ? "bg-gold/20 text-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {c.role === "admin" ? "Admin" : "Cliente"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">{userOrders.length}</td>
                    <td className="px-6 py-4 text-right font-semibold text-primary">
                      {formatBRL(total)}
                    </td>
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

