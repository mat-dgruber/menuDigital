export interface CartItem {
  id: string;
  nome: string;
  preco: number;
  foto?: string;
  quantidade: number;
  observacao?: string;
}

export interface CheckoutData {
  tipoEntrega: 'delivery' | 'retirada';
  nomeCliente: string;
  endereco?: string;
  formaPagamento: 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro';
  trocoPara?: string;
  observacaoGeral?: string;
}

const STORAGE_KEY = 'menu_digital_cart';
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function isClient(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Recupera os itens salvos na sacola
 */
export function getCart(): CartItem[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Erro ao ler carrinho do localStorage:', err);
    return [];
  }
}

/**
 * Salva os itens com debounce de 100ms para evitar batidas excessivas no storage
 */
function persistCart(items: CartItem[]): void {
  if (!isClient()) return;
  if (saveTimeout) clearTimeout(saveTimeout);

  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Erro ao persistir carrinho:', err);
    }
  }, 100);

  // Notifica componentes imediatamente via CustomEvent
  window.dispatchEvent(
    new CustomEvent('cart:updated', {
      detail: {
        items,
        ...getCartTotals(items),
      },
    })
  );
}

/**
 * Calcula quantidade total de itens e subtotal
 */
export function getCartTotals(items: CartItem[] = getCart()): { count: number; subtotal: number } {
  return items.reduce(
    (acc, item) => {
      acc.count += item.quantidade;
      acc.subtotal += item.preco * item.quantidade;
      return acc;
    },
    { count: 0, subtotal: 0 }
  );
}

/**
 * Adiciona um item ou incrementa sua quantidade
 */
export function addItem(item: Omit<CartItem, 'quantidade'> & { quantidade?: number }): void {
  const current = getCart();
  const existingIndex = current.findIndex((i) => i.id === item.id);

  if (existingIndex > -1) {
    current[existingIndex].quantidade += item.quantidade || 1;
    if (item.observacao) {
      current[existingIndex].observacao = item.observacao;
    }
  } else {
    current.push({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      foto: item.foto,
      quantidade: item.quantidade || 1,
      observacao: item.observacao || '',
    });
  }

  persistCart(current);
}

/**
 * Altera a quantidade de um item (+1 ou -1). Se chegar a 0, remove.
 */
export function updateQuantity(id: string, delta: number): void {
  const current = getCart();
  const index = current.findIndex((i) => i.id === id);
  if (index === -1) return;

  current[index].quantidade += delta;

  if (current[index].quantidade <= 0) {
    current.splice(index, 1);
  }

  persistCart(current);
}

/**
 * Remove um item completamente da sacola
 */
export function removeItem(id: string): void {
  const current = getCart();
  const filtered = current.filter((i) => i.id !== id);
  persistCart(filtered);
}

/**
 * Atualiza a observação individual de um item
 */
export function updateItemObservation(id: string, observacao: string): void {
  const current = getCart();
  const item = current.find((i) => i.id === id);
  if (item) {
    item.observacao = observacao;
    persistCart(current);
  }
}

/**
 * Limpa toda a sacola
 */
export function clearCart(): void {
  persistCart([]);
}

/**
 * Formata moeda BRL (R$ 0,00)
 */
export function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

/**
 * Gera a mensagem formatada para o WhatsApp com verificação de tamanho seguro
 */
export function buildWhatsAppUrl(
  phone: string,
  checkout: CheckoutData,
  items: CartItem[] = getCart(),
  restaurantName: string = "Kaleb's Esfiharia"
): string {
  const sanitizedPhone = phone.replace(/\D/g, '');
  const { subtotal } = getCartTotals(items);

  const lines: string[] = [];
  lines.push(`🍽️ *NOVO PEDIDO — ${restaurantName.toUpperCase()}*`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`👤 *Cliente:* ${checkout.nomeCliente.trim()}`);
  lines.push(`📍 *Modalidade:* ${checkout.tipoEntrega === 'delivery' ? '🛵 Entrega (Delivery)' : '🥡 Retirada no Balcão'}`);

  if (checkout.tipoEntrega === 'delivery' && checkout.endereco) {
    lines.push(`🏠 *Endereço:* ${checkout.endereco.trim()}`);
  }

  const paymentLabels: Record<CheckoutData['formaPagamento'], string> = {
    pix: 'Pix',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito',
    dinheiro: checkout.trocoPara ? `Dinheiro (Troco para ${checkout.trocoPara})` : 'Dinheiro (Sem troco)',
  };

  lines.push(`💳 *Pagamento:* ${paymentLabels[checkout.formaPagamento] || checkout.formaPagamento}`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`📋 *ITENS DO PEDIDO:*`);

  items.forEach((it) => {
    const itemTotal = formatCurrency(it.preco * it.quantidade);
    lines.push(`• ${it.quantidade}x *${it.nome}* (${itemTotal})`);
    if (it.observacao && it.observacao.trim()) {
      lines.push(`  ↳ _Obs: ${it.observacao.trim()}_`);
    }
  });

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`💰 *SUBTOTAL:* ${formatCurrency(subtotal)}`);

  if (checkout.observacaoGeral && checkout.observacaoGeral.trim()) {
    lines.push(`📝 *Obs Geral:* ${checkout.observacaoGeral.trim()}`);
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`_Pedido gerado pelo Cardápio Digital_`);

  let text = lines.join('\n');

  // Limite seguro de caracteres para evitar quebra de URL no WhatsApp (~1800 caracteres)
  if (text.length > 1800) {
    text = text.slice(0, 1750) + '\n\n...(pedido extenso resumido para envio)';
  }

  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(text)}`;
}
