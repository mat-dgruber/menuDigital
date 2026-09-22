import settings from '../data/settings.json';
import {
  getCart,
  addItem,
  updateQuantity,
  updateItemObservation,
  replaceCart,
  saveLastOrder,
  getLastOrder,
  clearCart,
  getCartTotals,
  formatCurrency,
  buildWhatsAppUrl,
  type CartItem,
  type CheckoutData,
} from '../utils/cartStore';
import { getStoreStatus, type AtendimentoConfig } from '../utils/businessHours';

function initCartSystem() {
  const storeStatus = getStoreStatus(settings.atendimento as AtendimentoConfig);

  // --- Elementos de UI ---
  const drawerRoot = document.getElementById('cart-drawer-root');
  const drawerSheet = drawerRoot?.querySelector('.cart-sheet');
  const emptyState = document.getElementById('cart-empty-state');
  const btnRestoreLastOrder = document.getElementById('btn-restore-last-order');
  const itemsContainer = document.getElementById('cart-items-container');
  const checkoutForm = document.getElementById('cart-checkout-form') as HTMLFormElement | null;
  const cartFooter = document.getElementById('cart-footer');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const closedNotice = document.getElementById('cart-closed-notice');

  // Sticky Bar
  const stickyEmptyView = document.getElementById('sticky-empty-view');
  const stickyCartView = document.getElementById('sticky-cart-view');
  const stickyItemsCount = document.getElementById('sticky-items-count');
  const stickyTotalValue = document.getElementById('sticky-total-value');
  const stickySubtitle = document.getElementById('sticky-subtitle');
  const btnOpenCart = document.getElementById('btn-open-cart-drawer');

  // Nav Bar
  const navCartBtn = document.getElementById('nav-cart-btn');
  const navCartBadge = document.getElementById('nav-cart-badge');
  const navStatusDot = document.getElementById('nav-status-dot');
  const navStatusText = document.getElementById('nav-status-text');

  // Checkout Form Elements
  const inputNome = document.getElementById('cliente-nome') as HTMLInputElement | null;
  const inputEndereco = document.getElementById('cliente-endereco') as HTMLInputElement | null;
  const enderecoWrapper = document.getElementById('endereco-wrapper');
  const trocoWrapper = document.getElementById('troco-wrapper');
  const inputTroco = document.getElementById('troco-valor') as HTMLInputElement | null;
  const inputObsGeral = document.getElementById('pedido-obs') as HTMLTextAreaElement | null;
  const btnSubmitOrder = document.getElementById('btn-submit-order');

  const errNome = document.getElementById('err-nome');
  const errEndereco = document.getElementById('err-endereco');

  // --- Persistência de Dados do Cliente para Retorno Rápido (UX Quick Win) ---
  const CUSTOMER_STORAGE_KEY = 'cardapio_customer_info';

  function restoreCustomerInfo() {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (inputNome && parsed.nome && !inputNome.value) inputNome.value = parsed.nome;
        if (inputEndereco && parsed.endereco && !inputEndereco.value) inputEndereco.value = parsed.endereco;
      }
    } catch (e) {
      // Ignora erro de parsing
    }
  }

  function saveCustomerInfo(nome: string, endereco?: string) {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify({
        nome: nome.trim(),
        endereco: (endereco || '').trim(),
      }));
    } catch (e) {
      // Ignora erro de storage
    }
  }

  restoreCustomerInfo();

  inputNome?.addEventListener('change', () => {
    saveCustomerInfo(inputNome.value, inputEndereco?.value);
  });

  inputEndereco?.addEventListener('change', () => {
    saveCustomerInfo(inputNome?.value || '', inputEndereco.value);
  });

  // Atualiza indicadores de status em tempo real
  if (navStatusDot && navStatusText) {
    navStatusDot.className = `status-dot ${storeStatus.isOpen ? '' : 'status-dot--closed'}`;
    navStatusText.className = `status-text ${storeStatus.isOpen ? '' : 'status-text--closed'}`;
    navStatusText.textContent = storeStatus.label;
  }

  // Aviso na barra inferior quando o restaurante estiver fechado (Opção A)
  if (!storeStatus.isOpen && stickySubtitle) {
    stickySubtitle.textContent = 'Fechado no momento · Toque para agendar';
  }

  // Aviso no Drawer quando o restaurante estiver fechado
  if (closedNotice) {
    closedNotice.style.display = storeStatus.isOpen ? 'none' : 'flex';
  }

  // --- Funções de Abertura / Fechamento da Sacola ---
  function openCart() {
    if (!drawerRoot) return;
    drawerRoot.classList.add('is-open');
    drawerRoot.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderDrawerItems();
    if (drawerSheet instanceof HTMLElement) {
      drawerSheet.focus();
    }
  }

  function closeCart() {
    if (!drawerRoot) return;
    if (drawerSheet instanceof HTMLElement) {
      drawerSheet.style.transform = '';
    }
    drawerRoot.classList.remove('is-open');
    drawerRoot.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Eventos de Abertura e Fechamento
  btnOpenCart?.addEventListener('click', openCart);
  navCartBtn?.addEventListener('click', openCart);

  btnRestoreLastOrder?.addEventListener('click', () => {
    const lastOrder = getLastOrder();
    if (!lastOrder) return;

    replaceCart(lastOrder.items);
    if (inputNome) inputNome.value = lastOrder.checkout.nomeCliente;
    if (inputEndereco) inputEndereco.value = lastOrder.checkout.endereco || '';
    if (inputTroco) inputTroco.value = lastOrder.checkout.trocoPara || '';
    if (inputObsGeral) inputObsGeral.value = lastOrder.checkout.observacaoGeral || '';

    document.querySelector<HTMLInputElement>(`input[name="tipo_entrega"][value="${lastOrder.checkout.tipoEntrega}"]`)?.click();
    document.querySelector<HTMLInputElement>(`input[name="forma_pagamento"][value="${lastOrder.checkout.formaPagamento}"]`)?.click();
  });

  document.querySelectorAll('[data-close-cart]').forEach((btn) => {
    btn.addEventListener('click', closeCart);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerRoot?.classList.contains('is-open')) {
      closeCart();
    }
  });

  // --- Gestos de Deslizar para Fechar (Apple Fluid Swipe-to-Dismiss) ---
  const dragArea = document.getElementById('cart-drag-area');
  const cartHeader = drawerRoot?.querySelector('.cart-header');
  let skipDrawerRender = false;
  let startY = 0;
  let currentDeltaY = 0;
  let isDragging = false;

  function onTouchStart(e: TouchEvent) {
    if (window.innerWidth > 640 || !drawerSheet) return;
    startY = e.touches[0].clientY;
    currentDeltaY = 0;
    isDragging = true;
    (drawerSheet as HTMLElement).style.transition = 'none';
  }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging || !drawerSheet) return;
    const clientY = e.touches[0].clientY;
    const diff = clientY - startY;

    if (diff > 0) {
      currentDeltaY = diff;
      const damped = diff * 0.75;
      (drawerSheet as HTMLElement).style.transform = `translateY(${damped}px)`;
    }
  }

  function onTouchEnd() {
    if (!isDragging || !drawerSheet) return;
    isDragging = false;
    const sheet = drawerSheet as HTMLElement;
    sheet.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';

    if (currentDeltaY > 80) {
      sheet.style.transform = '';
      closeCart();
    } else {
      sheet.style.transform = '';
    }
  }

  dragArea?.addEventListener('touchstart', onTouchStart, { passive: true });
  dragArea?.addEventListener('touchmove', onTouchMove, { passive: true });
  dragArea?.addEventListener('touchend', onTouchEnd);

  cartHeader?.addEventListener('touchstart', onTouchStart, { passive: true });
  cartHeader?.addEventListener('touchmove', onTouchMove, { passive: true });
  cartHeader?.addEventListener('touchend', onTouchEnd);

  // --- Sincronização de Cards do Cardápio ---
  function syncMenuCards(cartItems: CartItem[] = getCart()) {
    const cardControls = document.querySelectorAll<HTMLElement>('[data-cart-control]');

    cardControls.forEach((control) => {
      const id = control.dataset.itemId;
      if (!id) return;

      const itemInCart = cartItems.find((i) => i.id === id);
      const addBtn = control.querySelector<HTMLElement>('.add-to-cart-btn');
      const stepper = control.querySelector<HTMLElement>('.qty-stepper');
      const display = control.querySelector<HTMLElement>('.qty-display');
      const minusBtn = control.querySelector<HTMLElement>('.qty-btn--minus');

      if (itemInCart && itemInCart.quantidade > 0) {
        if (addBtn) addBtn.style.display = 'none';
        if (stepper) stepper.style.display = 'inline-flex';
        if (display) display.textContent = String(itemInCart.quantidade);

        if (minusBtn) {
          const isTrash = itemInCart.quantidade === 1;
          minusBtn.classList.toggle('is-trash', isTrash);
          minusBtn.innerHTML = isTrash ? '🗑️' : '<span class="qty-minus-icon">−</span>';
          minusBtn.setAttribute('aria-label', isTrash ? 'Remover item da sacola' : 'Diminuir quantidade');
        }
      } else {
        if (addBtn) addBtn.style.display = 'inline-flex';
        if (stepper) stepper.style.display = 'none';
      }
    });
  }

  // Delegação de cliques nos Cards
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    // Clique em "+ Adicionar" no Card
    const addBtn = target.closest('.add-to-cart-btn');
    if (addBtn) {
      const control = addBtn.closest<HTMLElement>('[data-cart-control]');
      if (control) {
        const id = control.dataset.itemId;
        const nome = control.dataset.itemName || control.dataset.itemNome;
        const preco = parseFloat(control.dataset.itemPrice || control.dataset.itemPreco || '0');
        const foto = control.dataset.itemPhoto || control.dataset.itemFoto;

        if (id && nome && preco) {
          addItem({ id, nome, preco, foto, quantidade: 1 });
        }
      }
      return;
    }

    // Clique em "+" no Stepper do Card
    const plusBtn = target.closest('.card-cart-controls .qty-btn--plus');
    if (plusBtn) {
      const control = plusBtn.closest<HTMLElement>('[data-cart-control]');
      const id = control?.dataset.itemId;
      if (id) updateQuantity(id, 1);
      return;
    }

    // Clique em "-" ou "🗑️" no Stepper do Card
    const minusBtn = target.closest('.card-cart-controls .qty-btn--minus');
    if (minusBtn) {
      const control = minusBtn.closest<HTMLElement>('[data-cart-control]');
      const id = control?.dataset.itemId;
      if (id) updateQuantity(id, -1);
      return;
    }
  });

  function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[char] || char);
  }

  // --- Renderização dos Itens no Drawer ---
  function renderDrawerItems() {
    const items = getCart();
    const { count, subtotal } = getCartTotals(items);

    if (count === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      if (btnRestoreLastOrder) btnRestoreLastOrder.style.display = getLastOrder() ? 'inline-flex' : 'none';
      if (itemsContainer) itemsContainer.style.display = 'none';
      if (checkoutForm) checkoutForm.style.display = 'none';
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (itemsContainer) itemsContainer.style.display = 'flex';
    if (checkoutForm) checkoutForm.style.display = 'flex';
    if (cartFooter) cartFooter.style.display = 'flex';

    if (cartSubtotal) {
      cartSubtotal.textContent = formatCurrency(subtotal);
    }

    if (itemsContainer) {
      itemsContainer.innerHTML = items
        .map((it) => {
          const itemTotal = formatCurrency(it.preco * it.quantidade);
          const isTrash = it.quantidade === 1;
          const itemName = escapeHtml(it.nome);
          const itemObservation = escapeHtml(it.observacao || '');

          return `
            <div class="cart-item-row" data-drawer-item-id="${it.id}">
              <div class="cart-item-main">
                <div class="cart-item-info">
                  <div class="cart-item-name">${itemName}</div>
                  <div class="cart-item-price">${itemTotal} <small style="color: var(--color-text-muted); font-size: 0.72rem;">(${formatCurrency(it.preco)} un)</small></div>
                </div>

                <div class="cart-item-stepper">
                  <button type="button" class="cart-item-minus ${isTrash ? 'is-trash' : ''}" data-action="minus" aria-label="Diminuir">
                    ${isTrash ? '🗑️' : '−'}
                  </button>
                  <span class="cart-item-qty">${it.quantidade}</span>
                  <button type="button" class="cart-item-plus" data-action="plus" aria-label="Aumentar">+</button>
                </div>
              </div>

              <textarea
                class="cart-item-obs-input"
                placeholder="Observação (ex: sem cebola, ponto da carne, alergias...)"
                maxlength="200"
                rows="2"
                data-action="obs"
              >${itemObservation}</textarea>
            </div>
          `;
        })
        .join('');
    }
  }

  // Eventos dentro do Drawer (Stepper e Observações)
  itemsContainer?.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>('button[data-action]');
    if (!btn) return;

    const row = btn.closest<HTMLElement>('.cart-item-row');
    const id = row?.dataset.drawerItemId;
    if (!id) return;

    const action = btn.dataset.action;
    if (action === 'plus') {
      updateQuantity(id, 1);
    } else if (action === 'minus') {
      updateQuantity(id, -1);
    }
  });

  itemsContainer?.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.dataset.action === 'obs') {
      const row = target.closest<HTMLElement>('.cart-item-row');
      const id = row?.dataset.drawerItemId;
      if (id) {
        skipDrawerRender = true;
        updateItemObservation(id, target.value);
      }
    }
  });

  // --- Lógica de Formulário Condicional (Delivery vs Retirada) ---
  const radiosEntrega = document.querySelectorAll<HTMLInputElement>('input[name="tipo_entrega"]');
  radiosEntrega.forEach((radio) => {
    radio.addEventListener('change', () => {
      const isDelivery = radio.value === 'delivery';
      if (enderecoWrapper) {
        enderecoWrapper.style.display = isDelivery ? 'flex' : 'none';
      }
      if (inputEndereco) {
        inputEndereco.required = isDelivery;
        if (!isDelivery) {
          inputEndereco.classList.remove('has-error');
          errEndereco?.classList.remove('is-visible');
        }
      }
    });
  });

  // Forma de Pagamento (Condicional Dinheiro -> Troco)
  const radiosPagamento = document.querySelectorAll<HTMLInputElement>('input[name="forma_pagamento"]');
  radiosPagamento.forEach((radio) => {
    radio.addEventListener('change', () => {
      const isDinheiro = radio.value === 'dinheiro';
      if (trocoWrapper) {
        trocoWrapper.style.display = isDinheiro ? 'flex' : 'none';
      }
    });
  });

  // --- Sincronização Global da Sacola ---
  function updateGlobalUI(cartItems: CartItem[] = getCart()) {
    const { count, subtotal } = getCartTotals(cartItems);

    // Nav Badge
    if (navCartBadge) {
      if (count > 0) {
        navCartBadge.style.display = 'flex';
        navCartBadge.textContent = count > 99 ? '99+' : String(count);
      } else {
        navCartBadge.style.display = 'none';
      }
    }

    // Sticky Bar
    if (count > 0) {
      if (stickyEmptyView) stickyEmptyView.style.display = 'none';
      if (stickyCartView) stickyCartView.style.display = 'flex';
      if (stickyItemsCount) stickyItemsCount.textContent = `${count} ${count === 1 ? 'item' : 'itens'}`;
      if (stickyTotalValue) stickyTotalValue.textContent = formatCurrency(subtotal);
    } else {
      if (stickyEmptyView) stickyEmptyView.style.display = 'flex';
      if (stickyCartView) stickyCartView.style.display = 'none';
    }

    syncMenuCards(cartItems);
    if (drawerRoot?.classList.contains('is-open') && !skipDrawerRender) {
      renderDrawerItems();
    }
    skipDrawerRender = false;
  }

  window.addEventListener('cart:updated', ((e: CustomEvent) => {
    updateGlobalUI(e.detail?.items || getCart());
  }) as EventListener);

  // --- Submissão do Pedido para o WhatsApp ---
  btnSubmitOrder?.addEventListener('click', () => {
    const items = getCart();
    if (items.length === 0) return;

    let hasError = false;

    // Valida Nome
    const nome = inputNome?.value.trim() || '';
    if (!nome) {
      inputNome?.classList.add('has-error');
      errNome?.classList.add('is-visible');
      hasError = true;
    } else {
      inputNome?.classList.remove('has-error');
      errNome?.classList.remove('is-visible');
    }

    // Valida Endereço se Delivery
    const selectedEntrega = (document.querySelector('input[name="tipo_entrega"]:checked') as HTMLInputElement)?.value as 'delivery' | 'retirada';
    const endereco = inputEndereco?.value.trim() || '';

    if (selectedEntrega === 'delivery' && !endereco) {
      inputEndereco?.classList.add('has-error');
      errEndereco?.classList.add('is-visible');
      hasError = true;
    } else {
      inputEndereco?.classList.remove('has-error');
      errEndereco?.classList.remove('is-visible');
    }

    if (hasError) return;

    const selectedPagamento = (document.querySelector('input[name="forma_pagamento"]:checked') as HTMLInputElement)?.value as CheckoutData['formaPagamento'];

    const checkout: CheckoutData = {
      tipoEntrega: selectedEntrega,
      nomeCliente: nome,
      endereco: selectedEntrega === 'delivery' ? endereco : undefined,
      formaPagamento: selectedPagamento,
      trocoPara: selectedPagamento === 'dinheiro' ? inputTroco?.value.trim() : undefined,
      observacaoGeral: inputObsGeral?.value.trim() || undefined,
    };

    const waUrl = buildWhatsAppUrl(
      settings.atendimento.whatsapp,
      checkout,
      items,
      settings.negocio.nome
    );

    // Salva dados do cliente para preenchimento automático em compras futuras
    saveCustomerInfo(nome, selectedEntrega === 'delivery' ? endereco : undefined);

    // Abre o WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    saveLastOrder(checkout, items);
    clearCart();
    checkoutForm?.reset();
    if (inputEndereco) inputEndereco.required = true;
    if (enderecoWrapper) enderecoWrapper.style.display = 'flex';
    if (trocoWrapper) trocoWrapper.style.display = 'none';
  });

  // Inicialização no carregamento
  updateGlobalUI();
}

// Inicializa quando o DOM estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCartSystem);
} else {
  initCartSystem();
}
