import { Link } from "@tanstack/react-router";
import { Moon, Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-gradient-soft">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Moon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <span className="font-display text-2xl font-semibold text-gradient">Stellari</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cuidado farmacêutico que acalma. Beleza que floresce. Géis cicatrizantes formulados com extratos botânicos.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Navegação</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link to="/produtos" className="hover:text-primary transition">Produtos</Link></li>
              <li><Link to="/beneficios" className="hover:text-primary transition">Benefícios</Link></li>
              <li><Link to="/suporte" className="hover:text-primary transition">Suporte</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Contato</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>contato@stellari.com</span></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>(11) 4002-8922</span></li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>São Paulo, Brasil</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">Empresa</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition">Sobre nós</a></li>
              <li><a href="#" className="hover:text-primary transition">Política de privacidade</a></li>
              <li><a href="#" className="hover:text-primary transition">Termos de uso</a></li>
              <li><a href="#" className="hover:text-primary transition">Trabalhe conosco</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Stellari Farmacêutica. Todos os direitos reservados.</p>
          <p>ANVISA · CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
}
