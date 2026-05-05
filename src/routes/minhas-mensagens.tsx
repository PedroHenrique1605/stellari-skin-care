import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { useNavigate } from "@tanstack/react-router";
import { Mail, Reply, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/minhas-mensagens")({
  head: () => ({ meta: [{ title: "Minhas mensagens — Stellari" }] }),
  component: MyMessagesPage,
});

function MyMessagesPage() {
  const currentUser = useStore((s) => s.users.find((u) => u.id === s.currentUserId));
  const messages = useStore((s) =>
    s.messages.filter(
      (m) => (currentUser && (m.userId === currentUser.id || m.email === currentUser.email)),
    ),
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined" && !currentUser) navigate({ to: "/login" });
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-medium flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-primary" /> Minhas mensagens
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Histórico das suas conversas com o suporte Stellari.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground shadow-soft">
          <Mail className="h-12 w-12 mx-auto mb-3 opacity-40" strokeWidth={1} />
          <p>Você ainda não enviou nenhuma mensagem.</p>
          <Link
            to="/suporte"
            className="inline-block mt-4 text-primary font-medium hover:underline"
          >
            Ir para o Suporte
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {[...messages].reverse().map((m) => (
            <div key={m.id} className="bg-card rounded-2xl border border-border shadow-soft p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center shrink-0 text-xs font-semibold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    Você · {new Date(m.date).toLocaleString("pt-BR")}
                  </p>
                  <p className="text-sm bg-muted/40 rounded-lg p-3 leading-relaxed">{m.message}</p>
                </div>
              </div>

              {m.reply ? (
                <div className="flex items-start gap-3 mt-4">
                  <div className="h-9 w-9 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0 text-xs font-semibold">
                    S
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-primary font-medium mb-1 flex items-center gap-1">
                      <Reply className="h-3 w-3" /> Stellari Suporte
                      {m.replyDate && (
                        <span className="text-muted-foreground font-normal">
                          · {new Date(m.replyDate).toLocaleString("pt-BR")}
                        </span>
                      )}
                    </p>
                    <p className="text-sm bg-primary/5 border border-primary/10 rounded-lg p-3 leading-relaxed">
                      {m.reply}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic mt-3 pl-12">
                  Aguardando resposta da equipe...
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
