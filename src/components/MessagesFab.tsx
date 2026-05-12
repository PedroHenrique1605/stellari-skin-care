import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { useStore, useHydrated } from "@/lib/store";

export function MessagesFab() {
  const hydrated = useHydrated();
  const currentUser = useStore((s) => s.currentUser);

  if (!hydrated || !currentUser || currentUser.role === "admin") return null;

  return (
    <Link
      to="/minhas-mensagens"
      aria-label="Minhas mensagens"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow flex items-center justify-center transition-all hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </Link>
  );
}
