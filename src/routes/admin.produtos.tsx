import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, actions, formatBRL, type Product } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/produtos")({
  component: AdminProducts,
});

const empty: Product = {
  id: "", name: "", tagline: "", description: "",
  composition: [], uses: [], benefits: [], price: 0,
  image: "", category: "Gel cicatrizante",
};

function AdminProducts() {
  const products = useStore((s) => s.products);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product>(empty);

  const save = () => {
    if (!editing.name || editing.price <= 0) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }
    const p: Product = { ...editing, id: editing.id || `prod-${Date.now()}` };
    actions.saveProduct(p);
    toast.success("Produto salvo");
    setOpen(false);
    setEditing(empty);
  };

  const startEdit = (p: Product) => { setEditing(p); setOpen(true); };
  const startNew = () => { setEditing(empty); setOpen(true); };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium">Produtos</h1>
          <p className="text-muted-foreground text-sm">{products.length} produto(s) · {categories.length} categoria(s)</p>
        </div>
        <Button onClick={startNew} className="bg-gradient-primary text-primary-foreground rounded-full">
          <Plus className="h-4 w-4 mr-2" /> Novo produto
        </Button>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <h2 className="font-display text-lg font-semibold mb-3 text-muted-foreground">{cat}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.filter((p) => p.category === cat).map((p) => (
              <div key={p.id} className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
                {p.image && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold leading-tight mb-1 line-clamp-1">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.tagline}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-primary">{formatBRL(p.price)}</span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => { if (confirm("Excluir produto?")) { actions.deleteProduct(p.id); toast.success("Excluído"); } }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{editing.id ? "Editar produto" : "Novo produto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Nome</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Categoria</Label><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
            </div>
            <div><Label>Tagline</Label><Input value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></div>
            <div><Label>Descrição</Label><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={editing.price} onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) || 0 })} /></div>
              <div><Label>URL da imagem</Label><Input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></div>
            </div>
            <div><Label>Composição (separe por vírgula)</Label><Input value={editing.composition.join(", ")} onChange={(e) => setEditing({ ...editing, composition: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
            <div><Label>Indicações de uso (separe por vírgula)</Label><Input value={editing.uses.join(", ")} onChange={(e) => setEditing({ ...editing, uses: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
            <div><Label>Benefícios (separe por vírgula)</Label><Input value={editing.benefits.join(", ")} onChange={(e) => setEditing({ ...editing, benefits: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
            <Button onClick={save} className="w-full bg-gradient-primary text-primary-foreground rounded-full h-11">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
