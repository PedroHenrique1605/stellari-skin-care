import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { mensagensApi, type ApiMensagem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Reply, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/mensagens")({
  component: MessagesPage,
});

function MessagesPage() {
  const [messages, setMessages] = useState<ApiMensagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [replies, setReplies] = useState<Record<number, string>>({});

  const loadMessages = () => {
    mensagensApi.listAll()
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadMessages(); }, []);

  const send = async (id: number) => {
    const text = replies[id]?.trim();
    if (!text) return toast.error("Digite uma resposta");
    try {
      await mensagensApi.reply(id, text);
      setReplies({ ...replies, [id]: "" });
      toast.success("Resposta registrada");
      loadMessages();
    } catch (err) {
      toast.error(`Erro: ${(err as Error).message}`);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground py-12 text-center">Carregando mensagens...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-medium">Mensagens de suporte</h1>
        <p className="text-muted-foreground text-sm">{messages.length} mensagem(ns) recebida(s).</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground">
            <Mail className="h-12 w-12 mx-auto mb-3 opacity-40" strokeWidth={1} />
            Nenhuma mensagem recebida ainda.
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="bg-card rounded-2xl border border-border shadow-soft p-6">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <p className="font-medium">{m.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.email} · {m.data_hora ? new Date(m.data_hora).toLocaleString("pt-BR") : ""}
                  </p>
                </div>
                {m.resposta && (
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Respondida
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed bg-muted/40 rounded-lg p-4">{m.mensagem}</p>

              {m.resposta ? (
                <div className="mt-3 pl-4 border-l-2 border-primary">
                  <p className="text-xs text-primary font-medium mb-1 flex items-center gap-1">
                    <Reply className="h-3 w-3" /> Sua resposta
                  </p>
                  <p className="text-sm text-muted-foreground">{m.resposta}</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <Textarea
                    placeholder="Escreva sua resposta..."
                    value={replies[m.id!] || ""}
                    onChange={(e) => setReplies({ ...replies, [m.id!]: e.target.value })}
                    rows={3}
                  />
                  <Button
                    size="sm"
                    onClick={() => send(m.id!)}
                    className="bg-gradient-primary text-primary-foreground rounded-full"
                  >
                    <Reply className="h-3.5 w-3.5 mr-1.5" /> Responder
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
