import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { Moon, LayoutDashboard, Users, ShoppingBag, Package, MessageSquare, LogOut, ArrowLeft } from "lucide-react";
import { actions } from "@/lib/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Stellari" }] }),
  component: AdminLayout,
});

const links: ReadonlyArray<{ to: "/admin" | "/admin/clientes" | "/admin/vendas" | "/admin/produtos" | "/admin/mensagens"; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/vendas", label: "Vendas", icon: ShoppingBag },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/mensagens", label: "Mensagens", icon: MessageSquare },
];

function AdminLayout() {
  const currentUser = useStore((s) => s.currentUser);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window !== "undefined" && (!currentUser || currentUser.role !== "admin")) {
      navigate({ to: "/login" });
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== "admin") {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Verificando acesso...</div>;
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col fixed inset-y-0 left-0">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <Moon className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <span className="font-display text-xl font-semibold text-gradient">Stellari</span>
        </Link>

        <nav className="flex-1 space-y-1">
          {links.map((l) => {
            const active = l.exact ? pathname === l.to : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 pt-4 border-t border-sidebar-border">
          <div className="px-3 py-2">
            <p className="text-xs text-muted-foreground">Conectado como</p>
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="w-full justify-start">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao site</Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => { actions.logout(); navigate({ to: "/" }); }}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
