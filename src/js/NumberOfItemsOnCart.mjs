import { getLocalStorage } from './utils.mjs';

export class NumberOfItemsOnCart {
  constructor() {
    this.cartItems = getLocalStorage('so-cart') || [];
  }

  updateCartCount() {
    this.cartItems = getLocalStorage('so-cart') || [];
    const cartCountElement = document.getElementById('cart-items-count');
    cartCountElement.textContent = this.cartItems.length;
  }
}
