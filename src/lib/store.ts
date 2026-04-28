// Frontend-only store using localStorage. All "persisted" data lives in the browser.
import { useEffect, useState, useSyncExternalStore } from "react";
import productJar from "@/assets/product-cream-jar.jpeg";
import productTube from "@/assets/product-gel-tube.jpeg";
import productSerum from "@/assets/product-serum-dropper.jpeg";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  composition: string[];
  uses: string[];
  benefits: string[];
  price: number;
  image: string;
  category: string;
};

const defaultProducts: Product[] = [
  {
    id: "stellari-water-gel-cream",
    name: "Stellari Calming Water Gel Cream",
    tagline: "Hidratação leve e cicatrizante para uso diário",
    description:
      "Gel-creme de toque seco que acalma, hidrata e auxilia na regeneração da pele sensível. Fórmula vegana com extratos botânicos.",
    composition: ["Melaleuca", "Calêndula", "Camomila", "Aloe Vera", "Pantenol"],
    uses: ["Aplicar 2x ao dia em pele limpa", "Massagear até completa absorção", "Pode ser usado sob maquiagem"],
    benefits: ["Acalma irritações", "Reduz vermelhidão", "Auxilia na cicatrização", "Hidratação 24h"],
    price: 89.9,
    image: productTube,
    category: "Gel cicatrizante",
  },
  {
    id: "stellari-herbal-cream",
    name: "Stellari Calming Herbal Cream",
    tagline: "Creme regenerador noturno com ativos botânicos",
    description:
      "Creme rico em ativos vegetais que trabalha durante a noite restaurando a barreira cutânea e acelerando a cicatrização de microlesões.",
    composition: ["Melaleuca", "Calêndula", "Camomila", "Manteiga de Karité", "Vitamina E"],
    uses: ["Aplicar à noite em pele limpa", "Massagear em movimentos circulares"],
    benefits: ["Regeneração noturna", "Restaura barreira cutânea", "Nutrição profunda", "Pele iluminada"],
    price: 119.9,
    image: productJar,
    category: "Gel cicatrizante",
  },
  {
    id: "stellari-herbal-serum",
    name: "Stellari Calming Herbal Serum",
    tagline: "Sérum concentrado de alta performance",
    description:
      "Sérum em gel com alta concentração de ativos calmantes e regeneradores. Penetração profunda para tratamento intensivo de cicatrizes e marcas.",
    composition: ["Melaleuca", "Calêndula", "Camomila", "Niacinamida", "Ácido Hialurônico"],
    uses: ["3-5 gotas em pele limpa", "Antes do creme hidratante", "Manhã e noite"],
    benefits: ["Reduz manchas", "Uniformiza tom", "Cicatrização acelerada", "Antioxidante"],
    price: 149.9,
    image: productSerum,
    category: "Sérum cicatrizante",
  },
];

export type CartItem = { productId: string; quantity: number };
export type User = { id: string; name: string; email: string; password: string; role: "client" | "admin" };
export type PaymentMethod = "credit" | "debit" | "pix" | "recurring";
export type Order = {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  date: string;
  paymentMethod?: PaymentMethod;
};
export type Message = { id: string; name: string; email: string; message: string; date: string; reply?: string };

type State = {
  products: Product[];
  cart: CartItem[];
  users: User[];
  currentUserId: string | null;
  orders: Order[];
  messages: Message[];
  coupons: Record<string, number>; // code -> percent
};

const STORAGE_KEY = "stellari-state-v1";

const initialState: State = {
  products: defaultProducts,
  cart: [],
  users: [
    { id: "admin-1", name: "Admin Stellari", email: "admin@stellari.com", password: "admin123", role: "admin" },
  ],
  currentUserId: null,
  orders: [],
  messages: [],
  coupons: { STELLARI10: 10, BEMVINDA: 15 },
};

let state: State = loadState();
const listeners = new Set<() => void>();

function loadState(): State {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as State;
    // Always refresh product images (imports change between builds)
    return {
      ...initialState,
      ...parsed,
      products: parsed.products?.length
        ? parsed.products.map((p) => {
            const def = defaultProducts.find((d) => d.id === p.id);
            return def ? { ...p, image: def.image } : p;
          })
        : defaultProducts,
    };
  } catch {
    return initialState;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

function setState(updater: (s: State) => State) {
  state = updater(state);
  persist();
}

export function getState() {
  return state;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initialState),
  );
}

// Hydration-safe boolean for client-only rendering
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

// ===== Actions =====
export const actions = {
  addToCart(productId: string, quantity = 1) {
    setState((s) => {
      const existing = s.cart.find((c) => c.productId === productId);
      const cart = existing
        ? s.cart.map((c) => (c.productId === productId ? { ...c, quantity: c.quantity + quantity } : c))
        : [...s.cart, { productId, quantity }];
      return { ...s, cart };
    });
  },
  updateQty(productId: string, quantity: number) {
    setState((s) => ({
      ...s,
      cart: quantity <= 0
        ? s.cart.filter((c) => c.productId !== productId)
        : s.cart.map((c) => (c.productId === productId ? { ...c, quantity } : c)),
    }));
  },
  removeFromCart(productId: string) {
    setState((s) => ({ ...s, cart: s.cart.filter((c) => c.productId !== productId) }));
  },
  clearCart() {
    setState((s) => ({ ...s, cart: [] }));
  },
  register(name: string, email: string, password: string): { ok: boolean; error?: string } {
    if (state.users.some((u) => u.email === email)) return { ok: false, error: "E-mail já cadastrado" };
    const id = `user-${Date.now()}`;
    setState((s) => ({
      ...s,
      users: [...s.users, { id, name, email, password: btoa(password), role: "client" }],
      currentUserId: id,
    }));
    return { ok: true };
  },
  login(email: string, password: string): { ok: boolean; error?: string } {
    const user = state.users.find(
      (u) => u.email === email && (u.password === password || u.password === btoa(password)),
    );
    if (!user) return { ok: false, error: "Credenciais inválidas" };
    setState((s) => ({ ...s, currentUserId: user.id }));
    return { ok: true };
  },
  logout() {
    setState((s) => ({ ...s, currentUserId: null }));
  },
  checkout(coupon: string, paymentMethod: PaymentMethod = "credit"): { ok: boolean; orderId?: string } {
    const u = state.users.find((x) => x.id === state.currentUserId);
    if (!u || state.cart.length === 0) return { ok: false };
    const subtotal = state.cart.reduce((a, c) => {
      const p = state.products.find((x) => x.id === c.productId);
      return a + (p?.price ?? 0) * c.quantity;
    }, 0);
    const discountPct = state.coupons[coupon.toUpperCase()] ?? 0;
    const total = subtotal * (1 - discountPct / 100);
    const order: Order = {
      id: `order-${Date.now()}`,
      userId: u.id,
      userName: u.name,
      items: state.cart,
      total,
      date: new Date().toISOString(),
      paymentMethod,
    };
    setState((s) => ({ ...s, orders: [...s.orders, order], cart: [] }));
    return { ok: true, orderId: order.id };
  },
  sendMessage(name: string, email: string, message: string) {
    const m: Message = { id: `msg-${Date.now()}`, name, email, message, date: new Date().toISOString() };
    setState((s) => ({ ...s, messages: [...s.messages, m] }));
  },
  replyMessage(id: string, reply: string) {
    setState((s) => ({ ...s, messages: s.messages.map((m) => (m.id === id ? { ...m, reply } : m)) }));
  },
  saveProduct(p: Product) {
    setState((s) => ({
      ...s,
      products: s.products.some((x) => x.id === p.id)
        ? s.products.map((x) => (x.id === p.id ? p : x))
        : [...s.products, p],
    }));
  },
  deleteProduct(id: string) {
    setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
  },
};

export function calcCart(cart: CartItem[], products: Product[], couponCode = "") {
  const items = cart.map((c) => {
    const p = products.find((x) => x.id === c.productId)!;
    return { ...c, product: p, lineTotal: (p?.price ?? 0) * c.quantity };
  });
  const totalUnits = cart.reduce((a, c) => a + c.quantity, 0);
  const subtotal = items.reduce((a, i) => a + i.lineTotal, 0);
  const coupons = state.coupons;
  const discountPct = coupons[couponCode.toUpperCase()] ?? 0;
  const discount = subtotal * (discountPct / 100);
  const total = subtotal - discount;
  const giftEligible = totalUnits >= 3;
  return { items, totalUnits, subtotal, discount, discountPct, total, giftEligible };
}

export function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
