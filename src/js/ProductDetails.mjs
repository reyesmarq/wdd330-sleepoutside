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
      const cartItems = JSON.parse(localStorage.getItem('so-cart')) || [];
      setLocalStorage('so-cart', [...cartItems, product]);
    } catch (error) {
      if (error.message.includes('is not iterable')) {
        // means that probably the user runs the older version of the code and we have an object instead of an array
        // So we have to convert it to an array and add the new product
        const cartItems = JSON.parse(localStorage.getItem('so-cart'));
        setLocalStorage('so-cart', [cartItems, product]);
      }

      throw new Error(`Can't add product to cart`);
    }
  }

  async renderProductDetails() {
    await this.init();

    console.log({product: this.product})

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

          <p class="product-card__price">$${this.product.FinalPrice}</p>

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
