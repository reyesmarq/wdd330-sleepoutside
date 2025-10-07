import { setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  /** @type {import("../types/product.d.ts").Product} */
  product;
  productId;
  dataSource;

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
  }

  addProductToCart(product) {
    try {
      const storedCart = localStorage.getItem('so-cart');
      let cartItems = [];

      // Handle malformed or legacy data
      if (storedCart) {
        try {
          cartItems = JSON.parse(storedCart);
          if (!Array.isArray(cartItems)) cartItems = [cartItems];
        } catch {
          cartItems = [];
        }
      }

      // Check if product already exists in the cart
      const existingIndex = cartItems.findIndex(
        (item) => item.Id === product.Id,
      );

      if (existingIndex !== -1) {
        // Increment quantity if item already in cart
        const existingItem = cartItems[existingIndex];
        const currentQty = existingItem.quantity || 1;
        cartItems[existingIndex] = {
          ...existingItem,
          quantity: currentQty + 1,
        };
      } else {
        // Add new item with quantity = 1
        cartItems.push({ ...product, quantity: 1 });
      }

      // Save the updated cart
      setLocalStorage('so-cart', cartItems);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw new Error(`Can't add product to cart`);
    }
  }
  async renderProductDetails() {
    await this.init();
    const discount = Math.round(
      this.product.SuggestedRetailPrice - this.product.FinalPrice,
    );

    const html = `
      <main class="divider">
        <section class="product-detail">
          <h3>${this.product.NameWithoutBrand}</h3>

          <h2 class="divider">${this.product.Brand.Name}</h2>

          <img
            class="divider"
            src="${this.product.Images.PrimaryMedium}"
            alt="${this.product.NameWithoutBrand}"
          />

          <p class="product-card__price">$${this.product.FinalPrice} ${discount > 0 ? `<span class="discount-badge">Save $${discount}!</span>` : ''}</p>

          <p class="product__color">${this.product.Colors[0].ColorName}</p>

          <p class="product__description">
            ${this.product.DescriptionHtmlSimple}
          </p>

          <div class="product-detail__add">
            <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
          </div>
        </section>
      </main>
    `;

    return html;
  }
}
