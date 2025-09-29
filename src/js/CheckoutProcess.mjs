import { getLocalStorage } from './utils.mjs';

export class CheckoutProcess {
  constructor(
    key = 'so-cart',
    outputRootSelector = '.order-summary',
    opts = {},
  ) {
    this.key = key;
    this.outputRootSelector = outputRootSelector;

    this.TAX_RATE = opts.taxRate ?? 0.06;
    this.SHIPPING_FIRST = opts.shippingFirst ?? 10;
    this.SHIPPING_ADDITIONAL = opts.shippingAdditional ?? 2;

    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    const raw = getLocalStorage(this.key) || [];
    this.list = this.#normalizeCart(raw);
    this.calculateAll();
    this.#wireZipWatcher();
  }

  refresh() {
    const raw = this.#getLocalStorage(this.key);
    this.list = this.#normalizeCart(raw);
    this.calculateAll();
  }

  // ==== NEW: expose normalized items & totals ====
  getItems() {
    return this.list.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    }));
  }
  getTotals() {
    return {
      itemTotal: this.itemTotal,
      tax: this.tax,
      shipping: this.shipping,
      orderTotal: this.orderTotal,
      itemCount: this.list.reduce((n, i) => n + i.quantity, 0),
    };
  }

  // ==== NEW: build payload straight from form ====
  buildOrderPayload(formEl) {
    // Ensure totals exist (e.g., user never left ZIP)
    if (this.orderTotal === 0 && this.itemTotal > 0)
      this.calculateOrderTotals();

    const fd = new FormData(formEl);
    return {
      orderDate: new Date().toISOString(),
      fname: fd.get('firstName')?.toString() ?? '',
      lname: fd.get('lastName')?.toString() ?? '',
      street: fd.get('street')?.toString() ?? '',
      city: fd.get('city')?.toString() ?? '',
      state: fd.get('state')?.toString() ?? '',
      zip: fd.get('zip')?.toString() ?? '',
      cardNumber: fd.get('ccNumber')?.toString() ?? '',
      expiration: fd.get('exp')?.toString() ?? '',
      code: fd.get('cvv')?.toString() ?? '',
      items: this.getItems(),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };
  }

  // ===== calculations =====
  calculateAll() {
    this.calculateItemSubTotal();
    this.calculateOrderTotals();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );
    this.#setText('#summary-subtotal', this.#money(this.itemTotal));
  }

  calculateOrderTotals() {
    const itemCount = this.list.reduce((n, i) => n + i.quantity, 0);
    this.shipping =
      itemCount === 0
        ? 0
        : this.SHIPPING_FIRST + (itemCount - 1) * this.SHIPPING_ADDITIONAL;
    this.tax = this.itemTotal * this.TAX_RATE;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    this.#setText('#summary-tax', this.#money(this.tax));
    this.#setText('#summary-shipping', this.#money(this.shipping));
    this.#setText('#summary-total', this.#money(this.orderTotal));
  }

  // ===== adapters / helpers =====
  #normalizeCart(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map((item) => {
      const id = item.Id ?? item.id ?? '';
      const name = item.Name ?? item.name ?? item.NameWithoutBrand ?? '';
      const price = Number(
        item.FinalPrice ??
          item.finalPrice ??
          item.ListPrice ??
          item.listPrice ??
          item.price ??
          0,
      );
      const quantity = Number(item.Quantity ?? item.quantity ?? 1) || 1;
      return { id, name, price, quantity };
    });
  }

  #getLocalStorage(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? [];
    } catch {
      return [];
    }
  }
  #money(n) {
    return `$${Number(n || 0).toFixed(2)}`;
  }
  #root() {
    return document.querySelector(this.outputRootSelector) || document;
  }
  #setText(selector, text) {
    const el = this.#root().querySelector(selector);
    if (el) el.textContent = text;
  }

  #wireZipWatcher() {
    const zip = document.querySelector('#zip');
    if (!zip) return;
    const recalc = () => {
      if (zip.value?.trim()) this.calculateOrderTotals();
    };
    zip.addEventListener('change', recalc);
    zip.addEventListener('blur', recalc);
    zip.addEventListener('input', () => {
      if (zip.value.length >= 5) recalc();
    });
  }
}
