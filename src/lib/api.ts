// Cliente HTTP para o back-end Stellari (http://localhost:3000)
// Configurável via VITE_API_URL.
export const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return undefined as T;
  const ct = res.headers.get("content-type") || "";
  return (ct.includes("application/json") ? await res.json() : (await res.text() as unknown)) as T;
}

// ===== Tipos do back-end =====
export type ApiProduto = {
  id?: number;
  id_produto?: number;
  nome_produto: string;
  composicao?: string;
  indicacao?: string;
  beneficios?: string;
  advertencias?: string;
  modo_uso?: string;
  lote?: string;
  validade?: string;
  descricao?: string;
  finalidade?: string;
  valor: number | string;
  id_categoria?: number;
};

export type ApiCliente = {
  id?: number;
  id_cliente?: number;
  nome: string;
  telefone?: string;
  cpf?: string;
  email: string;
  senha?: string;
  data_nascimento?: string;
};

export type ApiItemCarrinho = {
  id_produto: number;
  id_cliente: number;
  quantidade: number;
};

// ===== Produtos =====
export const produtosApi = {
  list: () => request<ApiProduto[]>("/produtos"),
  get: (id: number) => request<ApiProduto>(`/produtos/${id}`),
};

// ===== Clientes =====
export const clientesApi = {
  list: () => request<ApiCliente[]>("/clientes"),
  searchByName: (nome: string) =>
    request<ApiCliente[]>(`/clientes?nome=${encodeURIComponent(nome)}`),
  create: (c: ApiCliente) =>
    request<ApiCliente>("/clientes", { method: "POST", body: JSON.stringify(c) }),
};

// ===== Carrinho =====
export const carrinhoApi = {
  list: (idCliente: number) => request<unknown[]>(`/carrinho/${idCliente}`),
  add: (item: ApiItemCarrinho) =>
    request<unknown>("/carrinho", { method: "POST", body: JSON.stringify(item) }),
  updateQty: (idCliente: number, idProduto: number, quantidade: number) =>
    request<unknown>(`/carrinho/${idCliente}/${idProduto}`, {
      method: "PUT",
      body: JSON.stringify({ id_cliente: idCliente, id_produto: idProduto, quantidade }),
    }),
  remove: (idCliente: number, idProduto: number) =>
    request<unknown>(`/carrinho/${idCliente}/${idProduto}`, { method: "DELETE" }),
  clear: (idCliente: number) =>
    request<unknown>(`/carrinho/${idCliente}`, { method: "DELETE" }),
};

// ===== Pedidos =====
export const pedidosApi = {
  create: (data: {
    frete: number;
    cupom: string | null;
    total: number;
    data_hora: string;
    id_cliente: number;
    id_endereco?: number | null;
    id_pagamento?: number | null;
  }) => request<{ id?: number; id_pedido?: number }>("/pedidos", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  addItem: (idPedido: number, item: { id_produto: number; quantidade: number; preco_unitario: number }) =>
    request<unknown>(`/pedidos/${idPedido}/itens`, {
      method: "POST",
      body: JSON.stringify(item),
    }),
};

// ===== Pagamentos =====
export const pagamentosApi = {
  create: (data: {
    metodo: string;
    status_pagamento: string;
    data_pagamento: string | null;
    status_entrega: string;
    valor: number;
    id_pedido?: number | null;
  }) => request<{ id?: number; id_pagamento?: number }>("/pagamentos", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// ===== Helpers =====
export function pickId<T extends { id?: number; id_cliente?: number; id_produto?: number; id_pedido?: number; id_pagamento?: number }>(
  obj: T,
): number | undefined {
  return obj.id ?? obj.id_cliente ?? obj.id_produto ?? obj.id_pedido ?? obj.id_pagamento;
}
