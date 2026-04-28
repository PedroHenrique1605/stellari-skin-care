import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { actions, useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Moon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Stellari" }] }),
  component: LoginPage,
});

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const currentUser = useStore((s) => s.users.find((u) => u.id === s.currentUserId));

  if (currentUser) {
    navigate({ to: currentUser.role === "admin" ? "/admin" : "/" });
  }

  const [login, setLogin] = useState({ email: "", password: "" });
  const [reg, setReg] = useState({ name: "", email: "", password: "" });

  const doLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const r = actions.login(login.email, login.password);
    if (!r.ok) return toast.error(r.error!);
    toast.success("Bem-vinda de volta!");
    const u = useStore.length;
    void u;
    setTimeout(() => {
      const cu = (window as any) && undefined;
      void cu;
      // navigate via state
      const role = JSON.parse(localStorage.getItem("stellari-state-v1") || "{}");
      const me = role.users?.find((x: any) => x.id === role.currentUserId);
      navigate({ to: me?.role === "admin" ? "/admin" : "/" });
    }, 100);
  };

  const doRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const r = registerSchema.safeParse(reg);
    if (!r.success) return toast.error(r.error.errors[0].message);
    const res = actions.register(reg.name, reg.email, reg.password);
    if (!res.ok) return toast.error(res.error!);
    toast.success("Conta criada com sucesso!");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16 bg-gradient-hero">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Moon className="h-7 w-7 text-primary" strokeWidth={1.5} />
            <span className="font-display text-3xl font-semibold text-gradient">Stellari</span>
          </Link>
          <h1 className="font-display text-3xl font-medium">Bem-vinda</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse sua conta ou crie uma nova</p>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-elegant p-8">
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={doLogin} className="space-y-4">
                <div>
                  <Label htmlFor="lemail">E-mail</Label>
                  <Input id="lemail" type="email" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="lpass">Senha</Label>
                  <Input id="lpass" type="password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} className="mt-1.5" />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground rounded-full h-11 mt-2">Entrar</Button>
                <p className="text-xs text-center text-muted-foreground pt-2">
                  Admin demo: <span className="font-medium">admin@stellari.com</span> / <span className="font-medium">admin123</span>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={doRegister} className="space-y-4">
                <div>
                  <Label htmlFor="rname">Nome completo</Label>
                  <Input id="rname" required value={reg.name} onChange={(e) => setReg({ ...reg, name: e.target.value })} className="mt-1.5" maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="remail">E-mail</Label>
                  <Input id="remail" type="email" required value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} className="mt-1.5" maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="rpass">Senha</Label>
                  <Input id="rpass" type="password" required value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} className="mt-1.5" minLength={6} maxLength={72} />
                  <p className="text-xs text-muted-foreground mt-1.5">Mínimo 6 caracteres. Senha será criptografada.</p>
                </div>
                <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground rounded-full h-11 mt-2">Criar conta</Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
