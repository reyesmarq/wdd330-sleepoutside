// cart.js
import { getLocalStorage, setLocalStorage } from './utils.mjs';

// ---------- helpers ----------
function getCart() {
  const raw = getLocalStorage('so-cart');
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

function formatMoney(n) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(n);
  } catch {
    return `$${Number(n).toFixed(2)}`;
  }
}

function getImageUrl(item) {
  // prefer a flat Image if present; otherwise fall back to catalog structure
  return (
    item.Image ||
    item.Images?.PrimarySmall ||
    item.Images?.PrimaryMedium ||
    item.Images?.PrimaryLarge ||
    ''
  );
}

function getColorName(item) {
  return item.Colors?.[0]?.ColorName ?? '—';
}

// ---------- renderers ----------
export function renderCartContents() {
  const cartItems = getCart();
  const listEl = document.querySelector('.product-list');
  const footerEl = document.querySelector('.cart-footer');
  const totalEl = document.querySelector('.cart-total');

  if (!listEl || !footerEl || !totalEl) return;

  if (cartItems.length === 0) {
    listEl.innerHTML = `
      <li class="cart-card empty">
        <p>Your cart is empty.</p>
      </li>`;
    footerEl.classList.add('hide');
    totalEl.textContent = '0.00';
    return;
  }

  const html = cartItems.map(cartItemTemplate).join('');
  listEl.innerHTML = html;

  // render total
  const total = cartItems.reduce(
    (sum, item) => sum + (item.FinalPrice ?? 0) * (item.quantity ?? 1),
    0,
  );
  totalEl.textContent = total.toFixed(2);
  footerEl.classList.remove('hide');
}

/** @param {import("../types/product.d.ts").Product & { quantity?: number }} item */
function cartItemTemplate(item) {
  const qty = item.quantity ?? 1;
  const unit = Number(item.FinalPrice ?? 0);
  const lineTotal = unit * qty;

  return `
    <li class="cart-card divider" data-id="${item.Id}">
      <a href="#" class="cart-card__image">
        <img src="${getImageUrl(item)}" alt="${item.Name ?? ''}" />
      </a>

      <div class="cart-card__body">
        <a href="#"><h2 class="card__name">${item.Name ?? ''}</h2></a>
        <p class="cart-card__color">${getColorName(item)}</p>
        <p class="cart-card__quantity">qty: ${qty}</p>
      </div>

      <div class="cart-card__prices">
        <p class="cart-card__unit">${formatMoney(unit)} ea</p>
        <p class="cart-card__price">${formatMoney(lineTotal)}</p>
      </div>

      <button class="cart-card__delete-btn" data-action="delete" aria-label="Remove ${item.Name ?? 'item'}">
        Delete
      </button>
    </li>
  `;
}

// ---------- init / events ----------
renderCartContents();

document.querySelector('.product-list')?.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;

  if (target.matches('[data-action="delete"]')) {
    const li = target.closest('.cart-card');
    const id = li?.getAttribute('data-id');
    if (!id) return;

    const cart = getCart();
    const idx = cart.findIndex((i) => i.Id === id);
    if (idx > -1) {
      // remove the item entirely (keeps behavior from your original code)
      cart.splice(idx, 1);

      // If you want to decrement instead of removing, swap the above with:
      // const qty = cart[idx].quantity ?? 1;
      // if (qty > 1) cart[idx] = { ...cart[idx], quantity: qty - 1 };
      // else cart.splice(idx, 1);

      setLocalStorage('so-cart', cart);
      renderCartContents();
    }
  }
});
