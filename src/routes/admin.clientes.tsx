import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { clientesApi, type ApiCliente } from "@/lib/api";
import { formatBRL } from "@/lib/store";
import { pedidosApi, type ApiPedido } from "@/lib/api";

export const Route = createFileRoute("/admin/clientes")({
  component: ClientsPage,
});

function ClientsPage() {
  const [clients, setClients] = useState<ApiCliente[]>([]);
  const [pedidos, setPedidos] = useState<ApiPedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([clientesApi.list(), pedidosApi.listAll()])
      .then(([c, p]) => { setClients(c); setPedidos(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-muted-foreground py-12 text-center">Carregando clientes...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Clientes</h1>
        <p className="text-muted-foreground text-sm">
          {clients.length} cliente(s) cadastrado(s).
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
              <th className="px-6 py-3 font-medium">Telefone</th>
              <th className="px-6 py-3 font-medium text-right">Pedidos</th>
              <th className="px-6 py-3 font-medium text-right">Total gasto</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            ) : (
              clients.map((c) => {
                const clientId = c.id ?? c.id_cliente;
                const clientPedidos = pedidos.filter((p) => p.id_cliente === clientId);
                const total = clientPedidos.reduce((a, p) => a + (p.total ?? 0), 0);
                return (
                  <tr key={clientId} className="border-t border-border">
                    <td className="px-6 py-4 text-muted-foreground">#{clientId}</td>
                    <td className="px-6 py-4 font-medium">{c.nome}</td>
                    <td className="px-6 py-4 text-muted-foreground">{c.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">{c.telefone ?? "—"}</td>
                    <td className="px-6 py-4 text-right">{clientPedidos.length}</td>
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
