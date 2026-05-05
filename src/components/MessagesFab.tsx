import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useStore, useHydrated } from "@/lib/store";

export function MessagesFab() {
  const hydrated = useHydrated();
  const currentUser = useStore((s) => s.users.find((u) => u.id === s.currentUserId));
  const unread = useStore((s) => {
    if (!s.currentUserId) return 0;
    const u = s.users.find((x) => x.id === s.currentUserId);
    return s.messages.filter(
      (m) => (m.userId === s.currentUserId || (u && m.email === u.email)) && !!m.reply,
    ).length;
  });

  if (!hydrated || !currentUser || currentUser.role === "admin") return null;

  return (
    <Link
      to="/minhas-mensagens"
      aria-label="Minhas mensagens"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow flex items-center justify-center transition-all hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gold text-foreground text-xs font-bold flex items-center justify-center border-2 border-background">
          {unread}
        </span>
      )}
    </Link>
  );
}
