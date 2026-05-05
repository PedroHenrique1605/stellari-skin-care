import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X, Moon } from "lucide-react";
import { useState } from "react";
import { useStore, useHydrated, actions } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/produtos", label: "Produtos" },
  { to: "/beneficios", label: "Benefícios" },
  { to: "/suporte", label: "Suporte" },
] as const;

export function Header() {
  const hydrated = useHydrated();
  const cartCount = useStore((s) => s.cart.reduce((a, c) => a + c.quantity, 0));
  const currentUser = useStore((s) => s.users.find((u) => u.id === s.currentUserId));
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/produtos", search: { q: search } as never });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Moon className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </div>
            <span className="font-display text-2xl font-semibold text-gradient">Stellari</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                activeProps={{ className: "text-primary font-semibold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Search desktop */}
          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="pl-9 bg-muted/50 border-transparent focus-visible:bg-card"
            />
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {hydrated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {currentUser.role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                      Painel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate({ to: "/carrinho" })}>
                    Meu carrinho
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/minhas-mensagens" })}>
                    Minhas mensagens
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => actions.logout()}>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                <Link to="/login">Entrar</Link>
              </Button>
            )}

            <Button variant="ghost" size="icon" asChild className="relative rounded-full">
              <Link to="/carrinho">
                <ShoppingBag className="h-5 w-5" />
                {hydrated && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-gradient-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center shadow-soft">
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* Mobile menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-8">
                  <form onSubmit={submitSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar..."
                      className="pl-9"
                    />
                  </form>
                  <nav className="flex flex-col gap-1">
                    {navLinks.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className="px-3 py-3 rounded-lg text-base font-medium hover:bg-muted transition-colors"
                      >
                        {l.label}
                      </Link>
                    ))}
                    {!currentUser && (
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="px-3 py-3 rounded-lg text-base font-medium hover:bg-muted transition-colors"
                      >
                        Entrar / Cadastrar
                      </Link>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
