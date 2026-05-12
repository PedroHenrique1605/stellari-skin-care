export const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:3104";

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

export type ApiMensagem = {
  id?: number;
  nome: string;
  email: string;
  mensagem: string;
  data_hora?: string;
  resposta?: string | null;
  data_resposta?: string | null;
  id_cliente?: number | null;
};

export type ApiPedido = {
  id?: number;
  frete: number;
  cupom?: string | null;
  total: number;
  data_hora?: string;
  id_cliente?: number;
  id_endereco?: number | null;
};

// ===== Clientes =====
export const clientesApi = {
  list: () => request<ApiCliente[]>("/clientes"),
  get: (id: number) => request<ApiCliente>(`/clientes/${id}`),
  create: (c: ApiCliente) =>
    request<ApiCliente>("/clientes", { method: "POST", body: JSON.stringify(c) }),
  login: (email: string, senha: string) =>
    request<ApiCliente>("/clientes/login", { method: "POST", body: JSON.stringify({ email, senha }) }),
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
  listAll: () => request<ApiPedido[]>("/pedidos"),
  listByCliente: (idCliente: number) =>
    request<ApiPedido[]>(`/pedidos?id_cliente=${idCliente}`),
  create: (data: {
    frete: number;
    cupom?: string | null;
    total: number;
    data_hora: string;
    id_cliente: number;
    id_endereco?: number | null;
  }) => request<{ id?: number; id_pedido?: number }>("/pedidos", {
    method: "POST",
    body: JSON.stringify(data),
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
    id_pedido: number;
  }) => request<{ id?: number; id_pagamento?: number }>("/pagamentos", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// ===== Mensagens =====
export const mensagensApi = {
  listAll: () => request<ApiMensagem[]>("/mensagens"),
  listByCliente: (idCliente: number) =>
    request<ApiMensagem[]>(`/mensagens?id_cliente=${idCliente}`),
  create: (data: { nome: string; email: string; mensagem: string; id_cliente?: number | null }) =>
    request<ApiMensagem>("/mensagens", { method: "POST", body: JSON.stringify(data) }),
  reply: (id: number, resposta: string) =>
    request<unknown>(`/mensagens/${id}/resposta`, {
      method: "POST",
      body: JSON.stringify({ resposta }),
    }),
};

// ===== Helpers =====
export function pickId<T extends { id?: number; id_cliente?: number; id_produto?: number; id_pedido?: number; id_pagamento?: number }>(
  obj: T,
): number | undefined {
  return obj.id ?? obj.id_cliente ?? obj.id_produto ?? obj.id_pedido ?? obj.id_pagamento;
}
