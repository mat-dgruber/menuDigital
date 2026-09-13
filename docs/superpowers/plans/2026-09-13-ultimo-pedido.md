# Último Pedido Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Após enviar pedido ao WhatsApp, limpar o pedido atual e permitir restaurar um único “Último Pedido”.

**Architecture:** Usar `localStorage` no browser, junto do estado atual do carrinho. O snapshot salva itens + dados do checkout; a UI mostra um botão de restauração apenas quando a sacola estiver vazia e existir snapshot.

**Tech Stack:** Astro, TypeScript client-side, CSS puro, `localStorage`, sem dependências novas.

## Global Constraints

- Não adicionar dependências.
- Reusar `cartStore.ts` e `cartController.ts`.
- Salvar apenas um último pedido, não histórico.
- Limpar sacola e formulário depois de abrir o WhatsApp.

---

### Task 1: Persistir snapshot do último pedido

**Files:**
- Modify: `src/utils/cartStore.ts`

**Interfaces:**
- Consumes: `CartItem`, `CheckoutData`, `getCart()`.
- Produces:
  - `interface LastOrder { items: CartItem[]; checkout: CheckoutData; savedAt: string }`
  - `saveLastOrder(checkout: CheckoutData, items?: CartItem[]): void`
  - `getLastOrder(): LastOrder | null`

- [ ] **Step 1: Add types and storage helpers**

```ts
const LAST_ORDER_STORAGE_KEY = 'menu_digital_last_order';

export interface LastOrder {
  items: CartItem[];
  checkout: CheckoutData;
  savedAt: string;
}

export function saveLastOrder(checkout: CheckoutData, items: CartItem[] = getCart()): void {
  if (!isClient()) return;
  localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify({
    items,
    checkout,
    savedAt: new Date().toISOString(),
  }));
}

export function getLastOrder(): LastOrder | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: PASS.

---

### Task 2: Mostrar ação de repetir pedido vazio

**Files:**
- Modify: `src/components/CartDrawer.astro`
- Modify: `src/scripts/cartController.ts`

**Interfaces:**
- Consumes: `getLastOrder(): LastOrder | null`.
- Produces: botão `#btn-restore-last-order` no estado vazio.

- [ ] **Step 1: Add button in empty state**

In `src/components/CartDrawer.astro`, inside `#cart-empty-state` after the “Explorar Cardápio” button:

```astro
<button type="button" id="btn-restore-last-order" class="btn-restore-last-order" style="display: none;">
  Repetir último pedido
</button>
```

- [ ] **Step 2: Add minimal CSS**

```css
.btn-restore-last-order {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.85rem;
}
```

- [ ] **Step 3: Wire visibility**

In `src/scripts/cartController.ts`, import `getLastOrder` and set button display in `renderDrawerItems()` when cart is empty:

```ts
const btnRestoreLastOrder = document.getElementById('btn-restore-last-order');

if (count === 0) {
  if (btnRestoreLastOrder) btnRestoreLastOrder.style.display = getLastOrder() ? 'inline-block' : 'none';
}
```

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: PASS.

---

### Task 3: Restaurar último pedido e limpar após envio

**Files:**
- Modify: `src/utils/cartStore.ts`
- Modify: `src/scripts/cartController.ts`

**Interfaces:**
- Consumes: `getLastOrder()`, `saveLastOrder()`.
- Produces:
  - `replaceCart(items: CartItem[]): void`
  - UI restoration of checkout fields.

- [ ] **Step 1: Add replaceCart**

```ts
export function replaceCart(items: CartItem[]): void {
  persistCart(items);
}
```

- [ ] **Step 2: Add restore click handler**

```ts
btnRestoreLastOrder?.addEventListener('click', () => {
  const lastOrder = getLastOrder();
  if (!lastOrder) return;

  replaceCart(lastOrder.items);
  if (inputNome) inputNome.value = lastOrder.checkout.nomeCliente;
  if (inputEndereco) inputEndereco.value = lastOrder.checkout.endereco || '';
  if (inputTroco) inputTroco.value = lastOrder.checkout.trocoPara || '';
  if (inputObsGeral) inputObsGeral.value = lastOrder.checkout.observacaoGeral || '';

  const entrega = document.querySelector<HTMLInputElement>(`input[name="tipo_entrega"][value="${lastOrder.checkout.tipoEntrega}"]`);
  entrega?.click();

  const pagamento = document.querySelector<HTMLInputElement>(`input[name="forma_pagamento"][value="${lastOrder.checkout.formaPagamento}"]`);
  pagamento?.click();
});
```

- [ ] **Step 3: Save last order and clear after WhatsApp opens**

After `window.open(waUrl, '_blank', 'noopener,noreferrer');`:

```ts
saveLastOrder(checkout, items);
clearCart();
checkoutForm?.reset();
if (inputEndereco) inputEndereco.required = true;
if (enderecoWrapper) enderecoWrapper.style.display = 'flex';
if (trocoWrapper) trocoWrapper.style.display = 'none';
```

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: PASS.

---

## Self-Review

- Spec coverage: snapshot, limpeza e restauração cobertos.
- Placeholder scan: sem TBD/TODO.
- Type consistency: `LastOrder`, `saveLastOrder`, `getLastOrder`, `replaceCart` definidos antes do uso.
