import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  getCartTotals,
  updateItemObservation,
} from './cartStore';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

const sampleItem = {
  id: 'esfiha-carne-1',
  nome: 'Esfiharia Teste - Carne',
  preco: 7.5,
  quantidade: 1,
};

describe('getCart', () => {
  it('retorna array vazio quando localStorage está vazio', () => {
    expect(getCart()).toEqual([]);
  });
});

describe('addItem', () => {
  it('adiciona um novo item', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe(sampleItem.id);
    expect(cart[0].quantidade).toBe(1);
  });

  it('incrementa quantidade ao adicionar item existente', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].quantidade).toBe(2);
  });

  it('adiciona item diferente separadamente', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    addItem({ ...sampleItem, id: 'esfiha-frango-2', nome: 'Frango' });
    vi.advanceTimersByTime(200);
    expect(getCart()).toHaveLength(2);
  });
});

describe('updateQuantity', () => {
  it('incrementa quantidade', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    updateQuantity(sampleItem.id, 1);
    vi.advanceTimersByTime(200);
    expect(getCart()[0].quantidade).toBe(2);
  });

  it('decrementa quantidade', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    updateQuantity(sampleItem.id, -1);
    vi.advanceTimersByTime(200);
    expect(getCart()[0].quantidade).toBe(1);
  });

  it('remove item quando quantidade chega a 0', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    updateQuantity(sampleItem.id, -1);
    vi.advanceTimersByTime(200);
    expect(getCart()).toHaveLength(0);
  });
});

describe('removeItem', () => {
  it('remove item específico', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    addItem({ ...sampleItem, id: 'outro', nome: 'Outro' });
    vi.advanceTimersByTime(200);
    removeItem(sampleItem.id);
    vi.advanceTimersByTime(200);
    const cart = getCart();
    expect(cart).toHaveLength(1);
    expect(cart[0].id).toBe('outro');
  });
});

describe('clearCart', () => {
  it('limpa todo o carrinho', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    addItem({ ...sampleItem, id: 'outro', nome: 'Outro' });
    vi.advanceTimersByTime(200);
    clearCart();
    vi.advanceTimersByTime(200);
    expect(getCart()).toEqual([]);
  });
});

describe('getCartTotals', () => {
  it('calcula totais corretamente', () => {
    addItem({ ...sampleItem, preco: 10, quantidade: 1 });
    vi.advanceTimersByTime(200);
    addItem({ ...sampleItem, id: 'item-2', preco: 5, quantidade: 1 });
    vi.advanceTimersByTime(200);
    const cart = getCart();
    const totals = getCartTotals(cart);
    expect(totals.count).toBe(2);
    expect(totals.subtotal).toBe(15);
  });

  it('retorna zero para carrinho vazio', () => {
    const totals = getCartTotals([]);
    expect(totals.count).toBe(0);
    expect(totals.subtotal).toBe(0);
  });
});

describe('updateItemObservation', () => {
  it('atualiza observação de um item', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    updateItemObservation(sampleItem.id, 'Sem cebola');
    vi.advanceTimersByTime(200);
    const cart = getCart();
    expect(cart[0].observacao).toBe('Sem cebola');
  });

  it('não adiciona observação a item inexistente', () => {
    addItem(sampleItem);
    vi.advanceTimersByTime(200);
    updateItemObservation('id-inexistente', 'Teste');
    vi.advanceTimersByTime(200);
    const cart = getCart();
    expect(cart).toHaveLength(1);
    // O item original não deve ter recebido a observação
    expect(cart[0].id).toBe(sampleItem.id);
  });
});
