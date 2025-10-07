import { getLocalStorage } from './utils.mjs';

export class NumberOfItemsOnCart {
  constructor() {
    this.cartKey = 'so-cart';
    this.cartCountElementId = 'cart-items-count';
  }

  getCartItems() {
    const data = getLocalStorage(this.cartKey);
    if (!data) return [];
    return Array.isArray(data) ? data : [data]; // legacy support
  }

  getCartCount() {
    const items = this.getCartItems();
    return items.reduce((total, item) => total + (item.quantity ?? 1), 0);
  }

  updateCartCount() {
    const cartCountElement = document.getElementById(this.cartCountElementId);
    if (!cartCountElement) return; // graceful fail if not found

    cartCountElement.textContent = this.getCartCount();
  }
}
