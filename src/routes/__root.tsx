import { Outlet, createRootRoute, HeadContent, Scripts, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MessagesFab } from "@/components/MessagesFab";
import { Toaster } from "@/components/ui/sonner";
import { produtosApi, pickId } from "@/lib/api";
import { actions, type Product, getState } from "@/lib/store";
import productJar from "@/assets/product-cream-jar.jpeg";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-soft hover:shadow-elegant transition-all"
          >
            Voltar para a Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Stellari — Géis cicatrizantes farmacêuticos" },
      { name: "description", content: "Stellari: linha farmacêutica de géis cicatrizantes com extratos botânicos. Cuidado que acalma, beleza que floresce." },
      { property: "og:title", content: "Stellari — Géis cicatrizantes farmacêuticos" },
      { property: "og:description", content: "Stellari: linha farmacêutica de géis cicatrizantes com extratos botânicos. Cuidado que acalma, beleza que floresce." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Stellari — Géis cicatrizantes farmacêuticos" },
      { name: "twitter:description", content: "Stellari: linha farmacêutica de géis cicatrizantes com extratos botânicos. Cuidado que acalma, beleza que floresce." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/180c7577-deae-40d3-bf2a-f565e4ab5efb/id-preview-487f481f--09226419-845b-4fd1-ab5b-ee09400173d0.lovable.app-1777500273247.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/180c7577-deae-40d3-bf2a-f565e4ab5efb/id-preview-487f481f--09226419-845b-4fd1-ab5b-ee09400173d0.lovable.app-1777500273247.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    let cancelled = false;
    produtosApi
      .list()
      .then((list) => {
        if (cancelled || !Array.isArray(list) || list.length === 0) return;
        const mapped: Product[] = list.map((p) => {
          const id = String(pickId(p) ?? p.nome_produto);
          const price = typeof p.valor === "string" ? parseFloat(p.valor) : Number(p.valor);
          return {
            id,
            name: p.nome_produto,
            tagline: p.finalidade || p.indicacao || "",
            description: p.descricao || "",
            composition: (p.composicao || "").split(",").map((s) => s.trim()).filter(Boolean),
            uses: (p.modo_uso || p.indicacao || "").split(/[.;\n]/).map((s) => s.trim()).filter(Boolean),
            benefits: (p.beneficios || "").split(/[.;\n]/).map((s) => s.trim()).filter(Boolean),
            price: Number.isFinite(price) ? price : 0,
            image: "",
            category: "",
          };
        });
        actions.setProductsFromApi(mapped);
      })
      .catch(() => {
        // API offline — mantém produtos locais como fallback silencioso
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <MessagesFab />}
      <Toaster position="top-right" />
    </div>
  );
}
