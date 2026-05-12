import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { actions, useStore } from "@/lib/store";
import { clientesApi, pickId } from "@/lib/api";
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
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres").max(72),
  telefone: z.string().regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos numéricos"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos numéricos (sem máscara)"),
  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato AAAA-MM-DD"),
});

function LoginPage() {
  const navigate = useNavigate();
  const currentUser = useStore((s) => s.currentUser);

  useEffect(() => {
    if (currentUser) {
      navigate({ to: currentUser.role === "admin" ? "/admin" : "/" });
    }
  }, [currentUser, navigate]);

  const [login, setLogin] = useState({ email: "", password: "" });
  const [reg, setReg] = useState({ name: "", email: "", password: "", telefone: "", cpf: "", data_nascimento: "" });

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Admin local
    if (login.email === "admin@stellari.com" && login.password === "admin123") {
      actions.setCurrentUser({ id: "admin-1", name: "Admin Stellari", email: "admin@stellari.com", role: "admin" });
      toast.success("Bem-vinda de volta!");
      navigate({ to: "/admin" });
      return;
    }

    // Cliente via backend
    try {
      const cliente = await clientesApi.login(login.email, login.password);
      const backendId = pickId(cliente);
      actions.setCurrentUser({
        id: `client-${backendId}`,
        backendId,
        name: cliente.nome,
        email: cliente.email,
        role: "client",
      });
      toast.success("Bem-vinda de volta!");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(`Credenciais inválidas: ${(err as Error).message}`);
    }
  };

  const doRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = registerSchema.safeParse(reg);
    if (!r.success) return toast.error(r.error.errors[0].message);

    try {
      const created = await clientesApi.create({
        nome: reg.name,
        email: reg.email,
        senha: reg.password,
        telefone: reg.telefone,
        cpf: reg.cpf,
        data_nascimento: reg.data_nascimento,
      });
      const backendId = pickId(created);
      actions.setCurrentUser({
        id: `client-${backendId}`,
        backendId,
        name: reg.name,
        email: reg.email,
        role: "client",
      });
      toast.success("Conta criada com sucesso!");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(`Falha ao criar conta: ${(err as Error).message}`);
    }
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
                  <Input id="rpass" type="password" required value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} className="mt-1.5" minLength={8} maxLength={72} />
                  <p className="text-xs text-muted-foreground mt-1.5">Mínimo 8 caracteres.</p>
                </div>
                <div>
                  <Label htmlFor="rtel">Telefone</Label>
                  <Input id="rtel" required inputMode="numeric" placeholder="11987654321" value={reg.telefone} onChange={(e) => setReg({ ...reg, telefone: e.target.value.replace(/\D/g, "") })} className="mt-1.5" maxLength={11} />
                </div>
                <div>
                  <Label htmlFor="rcpf">CPF</Label>
                  <Input id="rcpf" required inputMode="numeric" placeholder="12345678900" value={reg.cpf} onChange={(e) => setReg({ ...reg, cpf: e.target.value.replace(/\D/g, "") })} className="mt-1.5" maxLength={11} />
                </div>
                <div>
                  <Label htmlFor="rdob">Data de nascimento</Label>
                  <Input id="rdob" type="date" required value={reg.data_nascimento} onChange={(e) => setReg({ ...reg, data_nascimento: e.target.value })} className="mt-1.5" />
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
